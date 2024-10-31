// ==UserScript==
// @name         Libgen Search Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-05-05
// @description  try to take over the world!
// @author       You
// @match        https://libgen.is/search.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=libgen.is
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/teampermonkey/libgen/libgen-books.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	const search = new URLSearchParams(window.location.search)
		.get("req")
		.split(/[ \+]/g)
		.filter((w) => w)
		.map((w) => w.toLowerCase());

	console.log("search", search);

	async function getUrl(url) {
		return await GM.xmlHttpRequest({ url: url }).then(
			(r) => r.responseText,
		);
	}

	const rows = Array.from($("table.c tbody tr")).slice(1);
	//.slice(1, 8);

	async function parseRows() {
		$("table.c tbody tr a").each((i, a) => {
			const text = $(a).text();

			console.log("text", text);

			const newText = text
				.split(" ")
				.map((word) =>
					search.indexOf(word.toLowerCase()) !== -1
						? `<span class="nmatch">${word}</span>`
						: word,
				)
				.join(" ")
				.split(",")
				.map((word) =>
					search.indexOf(word.toLowerCase()) !== -1
						? `<span class="nmatch">${word}</span>`
						: word,
				)
				.join(",")
				.split(".")
				.map((word) =>
					search.indexOf(word.toLowerCase()) !== -1
						? `<span class="nmatch">${word}</span>`
						: word,
				)
				.join(".")
				.split(";")
				.map((word) =>
					search.indexOf(word.toLowerCase()) !== -1
						? `<span class="nmatch">${word}</span>`
						: word,
				)
				.join(";");

			$(a).html(newText);
		});

		$("h1").after(`<button id="copy-all">Copy selected books</button>
			<hr/>
			<input id="select-all" type="checkbox">`);

		$("#select-all").on("change", function () {
			const checked = $(this).prop("checked");

			$(".select-book").prop("checked", checked).trigger("change");
		});

		$("#copy-all").on("click", function () {
			const books = Array.from($(".select-book:checked")).sort(
				(a, b) => +$(a).data("size") - +$(b).data("size"),
			);
			const node = books
				.map(
					(book, i, books) =>
						decodeURI(book.value) +
						` "${i + 1} of ${books.length}. Size: ${$(book).data(
							"message",
						)}"`,
				)
				.join("\n\n");
			console.log("node: ", node);
			new nstring("\n\n" + node + "\n\n").copy2();
			alert(books.length + " books selected");
		});

		for (const row of rows) {
			// console.log($(row).html())

			const url1 = $(row).find("a:contains([1])").prop("href");
			const url2 = $(row).find("a:contains([2])").prop("href");
			const id = $(row).find("td:eq(0)").text().trim();
			const author = $(row).find("td:eq(1)").text().trim();
			const rtitle = $(row)
				.find("td:eq(2) a[title]")
				.clone()
				.find("font")
				.remove()
				.end()
				.text()
				.split("(")[0]
				.replaceAll(/[0-9]{6,}[A-Z]{1,}\,/g, "")
				.replaceAll(/[0-9]{6,}\,/g, "")
				.replaceAll(/[0-9]{6,}/g, "")
				.replaceAll(/[0-9\-]{6,}/g, "")
				.trim();

			const title = new nstring(rtitle).validFileName().value();

			const $editorial = $(row).find("td:eq(3)");
			const editorial = $editorial.text().trim().replaceAll("/", "-");

			if (
				[
					"mohr siebeck",
					"Sheffield Academic Press",
					"T&T Clark",
					"Oxford University Press",
					"JCB Mohr (Paul Siebeck)",
				]
					.map((words) => words.toLowerCase().trim())
					.some((words) => editorial.toLowerCase().includes(words))
			) {
				$editorial.addClass("selected-editorial");
			}

			const year = $(row).find("td:eq(4)").text().trim();

			const ext = $(row).find("td:eq(8)").text().trim();

			const name = `${author} (${year}). ${title}${
				editorial ? ". " + editorial : ""
			} ${id}.${ext}`;

			// const sw = Math.random() > 0.0;
			const downloadOption = 1;

			// console.log("sw", sw);
			let downloadUrl;
			if (downloadOption === 1) {
				downloadUrl = await getUrl(url1).then((r) =>
					$(r).find("#download a").prop("href"),
				);
			} else if (downloadOption === 2) {
				downloadUrl = await getUrl(url2).then((r) =>
					$(r).find("a:contains(GET)").prop("href"),
				);
			}

			console.log("url1", url1);
			console.log("downloadUrl", downloadUrl);
			// console.log("url2", url2);
			// console.log("downloadUrl2", downloadUrl2);

			const nodeName = `D:\nnode E://node//ndownload.js "${downloadUrl}" "downnode/libgen.is" "${name}"`;
			const message = $(row).find("td:eq(7)").text().trim();
			const size =
				+message.match(/[0-9]{1,}/g)[0] *
				(message.includes("Mb") ? 1000 : 1);

			$(row).find("td:eq(2)").append(`
				<button>
					<a  
						class="contextmenu-name"
						data-name="${name}"
						href="${downloadUrl}" 
						target="_blank">
						copy: ${name}</a>
				</button>
			
		 

				<button 
					class="copy-name ${downloadUrl ? "success" : "undefined"}"
					data-size="${size}"
					data-message="${message}"
					data-name="${encodeURI(nodeName)}">
					Node ${downloadUrl ? new URL(downloadUrl).hostname : ""}
				</button>

				<input class="select-book" data-size="${size}"
					data-message="${message}" type="checkbox" value="${encodeURI(nodeName)}">

				`);

			$(".contextmenu-name:not(.ndev)").each((i, a) => {
				$(a).on("contextmenu", function () {
					const name = $(this).data("name");
					new nstring(name).copy2();
					console.log(name);

					$(this).addClass("ndev");
				});
			});

			$(".copy-name:not(.ndev)").each((i, a) => {
				$(a).on("click", function () {
					const name = decodeURI($(this).data("name"));
					new nstring(name + "\n\n").copy2();
					console.log(name);
					$(this).addClass("ndev");
				});
			});
		}

		$(".select-book").on("change", function () {
			const checked = $(this).prop("checked");
			console.log("checked", checked);
			$(this).closest("tr").toggleClass("book-selected", checked);

			const allSelected =
				$(".select-book:checked").length === $(".select-book").length;
			$("#select-all").prop("checked", allSelected);
		});
	}

	function addStyles() {
		$("body").append(`
<style>
	.book-selected{
		background-color:#C5C5C5;
	}
	span.nmatch {
		font-weight:bold;
		background-color:yellow;
	}
	.undefined {
		color: white;
		background-color:red;
	}

	.selected-editorial{
		font-weight:bold;
		font-size:12px;
		color:green;
	}
</style>
`);
	}
	parseRows();
	addStyles();
	// getUrl("http://library.lol/main/59DBF01674C4643B6129DBF4C61DB8F4")
	//   .then((r) => $(r).find("#download a").prop("href"))
	//   .then((url) => new nurl(url).downloadAs("nolocrick.pdf"));
})();