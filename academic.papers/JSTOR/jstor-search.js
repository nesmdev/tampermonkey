// ==UserScript==
// @name         JSTOR Search Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.jstor.org/action/doBasicSearch?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jstor.org
// @require      https://code.jquery.com/jquery-3.6.2.min.js
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      file:///E:/Teampermonkey/academic.papers/JSTOR/JSTOR-common.js
// @require      file:///E:/Teampermonkey/academic.papers/JSTOR/JSTOR-search.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	function html() {
		// console.log("html....");

		$("li.result-list__item").each((i, article) => {
			const saved = $(article).find(
				"mfe-save-to-workspace-pharos-button:contains(Saved)",
			).length===1;

			console.log(saved);
			$(article).toggleClass("nsaved", saved);
		});

		$("li.result-list__item:not(.ndev)").each((i, article) => {
			const review = $(article)
				.find("div.title")
				.text()
				.trim()
				.includes("Review:");
			if (review) return;
			const type = $(article)
				.find("div.content-type")
				.text()
				.trim()
				.toLowerCase()
				.replaceAll(" ", "-");
			$(article).addClass("ndev");
			$(article).addClass(type);

			const titleRaw = $(article)
				.find("search-results-vue-pharos-heading")
				.text()
				.trim();

			const authorRaw = $(article)
				.find("[data-qa=search-result-authors]")
				.text()
				.trim();

			const publisherRaw = $(article)
				.find("[data-qa=item-src-info]")
				.text()
				.trim();

			console.log("titleRaw", titleRaw);
			console.log("authorRaw", authorRaw);
			console.log("publisherRaw", publisherRaw);

			const title = getTitle(titleRaw);
			const author = getAuthor(authorRaw);
			const year = getYear(publisherRaw);
			const journal = getJournal(publisherRaw);
			const num = getNum(publisherRaw);
			const pages = getPages(publisherRaw);

			const name = new nstring(title).validFileName().value();
			const file = `${author} [${year}]. ${name}. ${journal}${num}, ${pages}`;

			console.log("file", file);

			const url = $(article)
				.find("search-results-vue-pharos-link")
				.prop("href")
				.split("?")[0];

			$(article).find(".action-buttons.action-buttons--grouped").append(`
					<button data-file="${file}" class="nbutton">${file}</button>

					<a class="nbutton" data-file="${file}" target="_blank" 
						href="https://sci-hub.ee/https://www.jstor.org${url}?file=${file}">
							Sci-Hub.ee
					</a>
				 
				 	<a class="nbutton" data-file="${file}" target="_blank" 
						href="https://sci-hub.ru/https://www.jstor.org${url}?file=${file}">
							Sci-Hub.ru
					</a>
					
					<a class="nbutton" data-file="${file}" target="_blank" 
						href="https://sci-hub.mksa.top/https://www.jstor.org${url}?file=${file}">
							Sci-Hub.mksa.top
					</a>

					<a class="nbutton" data-file="${file}" target="_blank" 
						href="https://libgen.is/scimag/?q=${author} ${title.replaceAll("'", "")}">
							Go to LibGen
					</a>
					`);

			$(".nbutton:not(.nfun)").on("click", function () {
				const file = $(this).data("file");

				console.log("data-file", file);
				if (file) {
					new nstring(file).copy2();
					console.log(file);
				}

				$(this).toggleClass("nclicked");
			});

			$(".nbutton:not(.nfun)").addClass("nfun");
		});
	}

	$(document).ready(function () {
		setInterval(html, 5000);

		$("body").append(`
			<style>
				.journal-article {
					border: 3px solid green;
				}
				.nbutton.nclicked{
					background-color:gray;
					color:white;
				}

				.nsaved{
					background-color:#c8c8c8;
				}
			</style>
			`);
	});
})();
