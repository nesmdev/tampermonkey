// ==UserScript==
// @name         Libgen Papers Userscript
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       You
// @match        https://libgen.is/scimag/?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://nesmdev.github.io/ndev/dist/ndev.1.0.9.js
// @require 	 file:///E:/Teampermonkey/Libgen/libgen-papers-v2.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	async function getUrl(url) {
		return await GM.xmlHttpRequest({ url: url }).then(
			(r) => r.responseText,
		);
	}

	function capitalize(str) {
		const exceptions = "a,as,and,for,his,in,of,on,the,to".split(",");
		return str
			.replace(/  /g, "")
			.trim()
			.split(" ")
			.map((s, i) =>
				exceptions.indexOf(s.toLowerCase()) !== -1 && i !== 0
					? s.toLowerCase()
					: s[0].toUpperCase() + s.substring(1).toLowerCase(),
			)
			.join(" ")
			.split("-")
			.map((s, i) =>
				exceptions.indexOf(s.toLowerCase()) !== -1 && i !== 0
					? s
					: s[0].toUpperCase() + s.substring(1),
			)
			.join("-")
			.split(". ")
			.map((s, i) =>
				exceptions.indexOf(s.toLowerCase()) !== -1 && i !== 0
					? s
					: s[0].toUpperCase() + s.substring(1),
			)
			.join(". ")
			.split("(")
			.map((s, i) =>
				exceptions.indexOf(s.toLowerCase()) !== -1 && i !== 0
					? s
					: s[0].toUpperCase() + s.substring(1),
			)
			.join("(");
	}
	async function getArticle(tr) {
		let author = $(tr)
			.find("td:eq(0)")
			.text()
			.split(";")
			.map((a) => a.split(", ").reverse().join(" "))
			.join(", ");

		let title = $(tr).find("td:eq(1) p:first").text().split("||").pop();

		let journal = $(tr)
			.find("td:eq(2)")
			.text()
			.replace("volume", "")
			.replace(`, issue `, ".")
			.replace(/([0-9]{4})/g, "")
			.replace("()", "")
			.trim()
			.split("/")[0]
			.trim();

		let year_ = $(tr)
			.find("td:eq(2)")
			.text()
			.match(/([0-9]{4})/);
		let year = (year_ && year_[0]) || "";

		console.log("author, title, journal", author, title, journal);

		const pp = await getPages(tr);

		const title2 = new nstring(title).validFileName();
		const article = `${capitalize(author)} [${year}]. ${capitalize(
			title2,
		)}. ${journal}, pp. ${pp ? pp : "–"}`;

		console.log(article);
		return article;
	}

	async function getReview(tr) {
		let reviewer = $(tr).find("td:eq(0)").text().replace("Review by:", "");

		// let title = ("'" + $(tr).find("td:eq(1) p:first").text()).replace(
		// 	"by ",
		// 	"' by "
		// );

		let titleAuthor = $(tr).find("td:eq(1) p:first").text().split("by");

		let author = titleAuthor.pop();
		let title = titleAuthor.join("by");
		//let author = $(tr).find("td:eq(1) p:first").text().match(/by [a-zA-Z.]/,"");
		//let author = "aaaa";
		let journal = $(tr)
			.find("td:eq(2)")
			.text()
			.replace("volume", "")
			.replace(`, issue `, ".")
			.replace(/([0-9]{4})/g, "")
			.replace("()", "")
			.trim()
			.split("/")[0]
			.trim();

		let year_ = $(tr)
			.find("td:eq(2)")
			.text()
			.match(/([0-9]{4})/);
		let year = (year_ && year_[0]) || "";

		// console.log(author, title, journal, year);

		const title2 = new nstring(title).validFileName();
		const article = `${capitalize(
			reviewer,
		)} [${year}]. Review of '${capitalize(title2)}', by ${capitalize(
			author,
		)}. ${journal}, pp. –`;

		console.log(article);
		return article;
	}

	async function getCitations() {
		console.log("getting citations...");

		const rows = Array.from($(".catalog tbody tr"));
		for (const i in rows) {
			const tr = rows[i];
			let isReview = $(tr).find("td:eq(0)").text().includes("Review by");
			console.log("isReview", isReview);
			let article;
			try {
				// article = isReview ? getReview(tr) : getArticle(tr);
				if (isReview) {
					article = await getReview(tr);
					console.log(new Date());
				} else {
					article = await getArticle(tr);
					console.log(new Date());
				}
			} catch (e) {
				article = "";
				console.log("error => ", e);
			}

			$(tr)
				.find("td:eq(1)")
				.append(
					$(`<button class="btn-copy">Copy citation</button>`)
						.data("article", article)
						.text("Copy: " + article)
						.on("click", function () {
							new nstring(article).copy2();
							$(this).css({
								color: "white",
								backgroundColor: "gray",
							});
						}),
				);
		}
	}

	async function getPages(tr) {
		const url = $(tr).find("ul a").prop("href");
		console.log("url", url);
		return getUrl(url)
			.then((res) => $(res).find("#citation").text())
			.then((txt) => {
				console.log("txt", txt);
				const pp =
					txt.match(/[0-9]{1,}\–[0-9]{1,}/g)?.[0] 
					// txt.match(/[0-9]{1,}\./)?.[0].replace(".", "");
				console.log("pp", pp);
				return pp;
				// if(pp)
			});
	}

	$(document).ready(function () {
		getCitations();
	});
})();