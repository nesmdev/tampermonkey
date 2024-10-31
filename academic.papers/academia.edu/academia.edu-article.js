// ==UserScript==
// @name         Academia.edu article Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.academia.edu/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=academia.edu
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/Teampermonkey/academic.papers/academia.edu/academia.edu-common.js
// @require      file:///E:/Teampermonkey/academic.papers/academia.edu/academia.edu-article.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	$(document).ready(function () {
		const author = $(".work-card--authors-list").text().trim();

		const titleRaw = clearTitle($("#swp-tcr--title").text());
		const publishRaw = $(".work-card--publish-wrapper").text();

		const title = getTitle(titleRaw, author);
		const year = getYear(titleRaw, publishRaw);
		const pages = getPages(titleRaw);

		const name = new nstring(title).validFileName().value();

		const file = `${author} [${year}]. ${name}, ${pages}`
			.replaceAll(",,", ",")
			.replaceAll(" ,",",")
			.replaceAll(" .",".")
			.replaceAll(".,", ".")


		$(".work-card--authors-list").after(
			`<button class="ncopy" data-file="${file}" class="ncopy">${file}</button>`,
		);

		$(".ncopy").on("click", function () {
			const file = $(this).data("file");
			new nstring(file).copy2();
			$(this).toggleClass("nclicked");
		});

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