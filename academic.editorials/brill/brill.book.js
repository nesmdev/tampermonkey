// ==UserScript==
// @name         Brill Book Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://brill.com/edcollbook/title/*
// @match        https://brill.com/display/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brill.com
// @require      https://code.jquery.com/jquery-3.6.3.js
// @require 	 file:///E:/ndev/dist/ndev.1.0.11.js
// @require 	 file:///E:/Teampermonkey/academic.editorials/Brill/brill.book.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	const params = new URLSearchParams(window.location.search);
	$(document).ready(function () {
		addStyles();

		const book = $("h1.title")
			.text()
			.replace(/[“”]/g, "")
			.split(":")[0]
			.trim();

		const year = $(".copyrightyear.text-metadata-value").text().trim();
		let counter = 0;

		$("div.type-chapter.leaf").each((i, chapter) => {
			// const content = $(chapter).text().trim();
			// console.log("content", content);

			const title = $(chapter)
				.find("h6.title")
				.text()
				.replace(/Chapter [0-9A-Za-z]{1,} /, "")
				.trim();

			const name = new nstring(title).validFileName().value();
			const authors = Array.from($(chapter).find(".contributor-unlinked"))
				.map((a) => $(a).text().trim())
				.join(", ");

			const pages = $(chapter)
				.find("dd.text-metadata-value")
				.text()
				.trim();

			if (!pages) return;

			$(chapter).addClass("nchapter");
			const pp1 = +pages.split("–")?.[0]?.trim();

			const pp2 = +pages.split("–")?.[1]?.trim();
			const start = +params.get("start");
			if (params.get("start")) {
				console.log("starting...");
				let sw;
				if (!isNaN(pp2 + start)) {
					counter++;
					sw = true;
				}
				$(chapter)
					.find("dd.text-metadata-value")
					.after(
						`<span>=> <b>${sw ? counter + "." : ""} (${
							pp1 + start
						}-${pp2 + start})</b></span>`,
					);
			}

			console.log("pp", pp1, pp2);
			console.log("title", title, "authors", authors, "pages", pages);

			const file = `${authors} [${year}]. ${name}. '${book}', pp. ${pages}`;
			$(chapter).append(
				`<button class="ncopy" data-file="${file}">${file}</button>`,
			);
		});

		$(".ncopy").on("click", function () {
			new nstring($(this).data("file")).copy2();

			$(this).toggleClass("nclicked");
		});
	});

	function addStyles() {
		$("body").append(`
		<style>
			.nchapter {
				border: 2px solid #007596;
				margin: 5px;
				padding: 5px;

			}

			.nclicked{
				background-color:gray;
				color:white;
			}
		</style>`);
	}
})();