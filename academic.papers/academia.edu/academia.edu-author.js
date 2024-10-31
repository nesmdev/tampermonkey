// ==UserScript==
// @name         Academia Author Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.academia.edu/*
// @exclude      https://www.academia.edu/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=academia.edu
//// @require      https://code.jquery.com/jquery-3.6.2.js
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/Teampermonkey/academic.papers/academia.edu/academia.edu-common.js
// @require      file:///E:/Teampermonkey/academic.papers/academia.edu/academia.edu-author.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	function formatArticles() {
		$(
			".js-work-strip.profile--work_container[data-work-id]:not(.nfun)",
		).each((i, article) => {
			$(article).addClass("nfun");

			if ($(article).find("span:contains(Download)").length)
				$(article).addClass("ndownloadable");

			const author = $("h1.ds-product-heading-lg").text().trim();

			const titleRaw = clearTitle(
				$(article).find(".wp-workCard_item.wp-workCard--title").text(),
			);

			const publishRaw = $(article).find(".wp-workCard_item:eq(1)").text();

			const title = getTitle(titleRaw);
			const year = getYear(titleRaw, publishRaw);
			const pages = getPages(titleRaw);
			const journal = getJournal(publishRaw);

			const name = new nstring(title).validFileName().value();

			const file = `${author} [${year}]. ${name}. ${journal}, ${pages}`;

			$(article)
				.find(".wp-workCard.wp-workCard_itemContainer")
				.append(
					`<button class="ncopy" data-file="${file}">${file}</button>`,
				);
		});

		$(".ncopy:not(.nfun)").on("click", function () {
			const file = $(this).data("file");
			new nstring(file).copy2();
			$(this).toggleClass("nclicked");

			console.log("file", file);
		});

		$(".ncopy:not(.nfun)").addClass("nfun");
	}

	$(document).ready(function () {
		setInterval(formatArticles, 3000);

		$("body").append(`
        <style>
            .nchapter {
                border: 2px solid #007596;

            }

            .nclicked{
                background-color:gray;
                color:white;
            }

            .ndownloadable {
            	border: 3px solid green;
            }
        </style>`);
	});
})();
