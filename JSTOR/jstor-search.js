// ==UserScript==
// @name         JSTOR Search Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.jstor.org/action/doBasicSearch?Query=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jstor.org
// @require      https://code.jquery.com/jquery-3.6.2.min.js
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/Teampermonkey/JSTOR/JSTOR-search.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	function html() {
		$("li.result-list__item:not(.ndev)").each((i, res) => {
			const review = $(res)
				.find("div.title")
				.text()
				.trim()
				.includes("Review:");
			if (review) return;
			const type = $(res)
				.find("div.content-type")
				.text()
				.trim()
				.toLowerCase()
				.replaceAll(" ", "-");
			$(res).addClass("ndev");
			$(res).addClass(type);
		});
	}

	$(document).ready(function () {
		setInterval(html, 1000);

		$("body").append(`
			<style>
				.journal-article {
					border: 3px solid green;
				}
			</style>
			`);
	});
})();
