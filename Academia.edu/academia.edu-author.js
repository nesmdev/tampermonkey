// ==UserScript==
// @name         Academia.edu Author Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://huji.academia.edu/PaulaFredriksen
// @icon         https://www.google.com/s2/favicons?sz=64&domain=academia.edu
// @require 	 file:///E:/Teampermonkey/Academia.edu/academia.edu-author.js
// @require 	 file:///E:/ndev/dist/ndev.1.0.11.js
// @grant        none
// ==/UserScript==
(function () {
	"use strict";

	// Your code here...
	function updateHtml() {
		console.log("updating...");
		const $articles = $("div.profile--work_container:not(.ndev)");

		$articles.each((i, article) => {
			console.log(i);
			$(article).addClass("ndev");
			const available = $(article).find(
				"span:contains(Download):visible"
			)[0];
			//const saved = $(article).find("span:contains(Saved to Library)")[0];

			console.log("available", available,typeof available);
			$(article).toggleClass("navaliable", typeof available!=="undefined");
			//$(article).toggleClass("nsaved", saved);
		});
	}

	$(document).ready(function () {
		$("body").append(`
			<style>
				.navaliable {
					border: 1px solid green;
				}
			</style>
		`);
		setInterval(updateHtml, 1000);
	});
})();
