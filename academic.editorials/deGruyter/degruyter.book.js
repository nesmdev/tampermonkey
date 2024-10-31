// ==UserScript==
// @name         DeGruyter Book Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.degruyter.com/document/doi/*/*/html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=degruyter.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/Teampermonkey/academic.editorials/degruyter/degruyter.book.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	const pages = [];
	const start = +new URLSearchParams(window.location.search).get("start");

	$(document).ready(function () {
		$("#contentsTab")[0].click();

		const book = new nstring($("h1").text())
			.validFileName()
			.value()
			.split("(")[0]
			.trim();
		const year = $(".publicationDate:first").text();
		const subtitle = $("h2.subtitle").text().trim();

		const Author = Array.from(
			$(".contributors-AUTHOR .contributor .displayName"),
		)
			.map((div) => $(div).text().trim())
			.join(", ");

		const publisher = $(".ga_published_by.ga_published_by_header")
			.text()
			.trim();

		const File = `${Author} (${year}). ${book}. ${subtitle}. ${publisher}`;
		const url = `https://libgen.is/search.php?req=${Author} ${book}&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def`;
		$(".doi").after(
			`<button><a href="${url}" target="_blank">Libgen</a></button>
			<button id="ncopy" class="ncopy" data-file="${File}">${File}</button>`,
		);

		$(".bookTocEntryRow")
			.each((i, chapter) => {
				const content = $(chapter).text().trim();
				const page = content.split(" ").pop().trim();
				pages.push(+page);
			})
			.each((i, chapter) => {
				//console.log($(chapter).text().trim())

				if (!$(chapter).has(".bookTocEntryAuthors.contributors").length)
					return;
				$(chapter).addClass("nchapter");

				const pageI = +pages[i];
				const pageF = +pages[i + 1] - 1;
				const pp = `${pageI}–${pageF}`;

				const title = $(chapter).find(".bookTocEntry").text().trim();
				const author = $(chapter)
					.find(".bookTocEntryAuthors")
					.text()
					.trim();

				if (start) {
					$(chapter)
						.find(".accessRequireAuth")
						.after(
							`<span>${pageI + start}-${pageF + start}</span>`,
						);
				}

				const file = `${author} [${year}]. ${new nstring(title)
					.validFileName()
					.value()}. '${book}', pp. ${pp}`;

				console.log("file", file);

				$(chapter)
					.find(".accessRequireAuth")
					.after(
						`<button class="ncopy" data-file="${file}">copy: ${file}</button>`,
					);
			});

		$(".ncopy").on("click", function () {
			const file = $(this).data("file");
			new nstring(file).copy2();
			$(this).toggleClass("nclicked");
		});

		// console.log(pages);

		$("body").append(`
		<style>
			.nchapter {
				border: 2px solid #007596;

			}

			.nclicked{
				background-color:gray;
				color:white;
			}
		</style>`);
	});
})();
