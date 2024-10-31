// ==UserScript==
// @name         Academia Author Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.academia.edu/*?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=academia.edu
// @require      https://code.jquery.com/jquery-3.6.2.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...
	function autoDownload() {
		const items = Array.from(
			$(".profile--work_container:not(.ndownloaded)")
		).filter((item) => $(item).find("a:contains(Download)").length);

		const item = items[0];

		if (item) {
			const title = $(item).find(".wp-workCard--title").text().trim();

			const url = $(item).find("a:contains(Download)").prop("href");
			downloadUrlAs(url, title);
			$(item).addClass("ndownloaded");

			console.log(
				"url",
				url,
				"title",
				title,
				"pending",
				items.length - 1
			);
		}
	}

	function downloadUrlAs(url, fileName) {
		var link = document.createElement("a");
		link.target = "_blank";
		link.download = fileName + ".pdf";
		link.href = url;
		document.body.append(link);
		link.click();
	}

	$(document).ready(function () {
		const params = new URLSearchParams(window.location.search);
		if (params.get("downloadAll")) {
			setInterval(autoDownload, 20*1000);
		}
	});
})();

// const links = Array.from($("a:contains(Download)"));
// const titleC = "wp-workCard--title";
// const itemC = "profile--work_container";
// span:contains(Skip)
