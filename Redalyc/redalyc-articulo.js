// ==UserScript==
// @name         Redalyc Articulo Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.redalyc.org/articulo.oa?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redalyc.org
// @require      https://code.jquery.com/jquery-3.6.3.js
// @require 	 file:///E:/Teampermonkey/Redalyc/redalyc-articulo.js
// @require 	 file:///E:/ndev/dist/ndev.1.0.11.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	$("body").append(`<style>
		.nblack {
			background-color:gray;
			color:white;
		}

		</style>`);

	$(document).ready(function () {
		const authors = Array.from($("meta[name=citation_author]"))
			.map((meta) => $(meta).prop("content").trim().replaceAll("  ", " "))
			.map((author) =>
				author === author.toUpperCase()
					? new nstring(author).lower().capitalize().value()
					: author
			);
		const year = $("meta[name=citation_publication_date]").prop("content");
		const journal = $("meta[name=citation_journal_title]")
			.prop("content")
			.split(/[\.:\-]/)[0]
			.trim();
		let volume = $("meta[name=citation_volume]").prop("content").trim();
		const issue = $("meta[name=citation_issue]").prop("content");
		let title = $("meta[name=citation_title]")
			.prop("content")
			.replace(/\n/g, " ");
		const pp1 = $("meta[name=citation_firstpage]").prop("content");
		const pp2 = $("meta[name=citation_lastpage]").prop("content");

		console.log("volume", volume, "title", title);
		
		if (new nstring(volume).isRoman())
			volume = new nstring(volume).romanToInt().value();

		title = new nstring(title).validFileName().value();
		if (title === title.toUpperCase())
			title = new nstring(title).lower2().value();

		const fulltitle = `${authors.join(
			", "
		)} [${year}]. ${title}. ${journal} ${
			volume ? volume + "." : ""
		}${issue}, pp. ${pp1}–${pp2}`;

		console.log("fulltitle", fulltitle);

		$("div.menu-acciones").after(
			`<hr/><center><button id="ncopy">Copy: ${fulltitle}</button></center>`
		);

		$("#ncopy").on("click", function () {
			new nstring(fulltitle).copy2();
			console.log(fulltitle);
			$(this).toggleClass("nblack");
		});
	});
})();
