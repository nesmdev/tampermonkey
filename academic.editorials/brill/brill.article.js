// ==UserScript==
// @name         Brill Book Article Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://brill.com/display/book/edcoll/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brill.com
// @require      https://code.jquery.com/jquery-3.6.3.js
// @require 	 file:///E:/Teampermonkey/academic.editorials/Brill/brill.article.js
// @require 	 file:///E:/ndev/dist/ndev.1.0.11.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	function addHtml() {
		$("h1.title:first").after(`<button id="ncopy">copy</button>`);

		$("#ncopy").on("click", function () {
			$(this).toggleClass("nclicked");
			const name = $(this).data("name");
			new nstring(name).copy2();
			console.log("name", name);
		});

		$("body").append(`
			<style>
				.nclicked {
					color:white;
					background-color:gray;
				} 
			</style>
			`);
	}
	function getData() {
		const author = $("#authorAffiliate").text().trim();
		const book_ = $("span.source-link a").text().trim();
		const book = new nstring(book_).validFileName().value();
		const pages = $("dd.pagerange").text().trim();
		const title_ = $("h1.title:first")
			.text()
			.trim()
			.split("  ")
			.pop()
			.trim();
		const title = new nstring(title_).validFileName().value();
		const year =
			$("dd.printpubdate")
				.text()
				.match(/[0-9]{4}/g) &&
			$("dd.printpubdate")
				.text()
				.match(/[0-9]{4}/g)[0];

		console.log(author, book, pages, title);

		const name = `${author} [${year}]. ${title}. '${book}', pp. ${pages}`;

		console.log("name", name);
		$("#ncopy")
			.text("copy: \n" + name)
			.data("name", name);
	}

	$(document).ready(function () {
		addHtml();
		getData();
	});
})();
