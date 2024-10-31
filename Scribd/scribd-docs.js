// ==UserScript==
// @name         Scribd Docs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://es.scribd.com/search?query=*&content_type=documents&page=*
// @match        https://es.scribd.com/user/*/*/uploads*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scribd.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      file:///E:/Teampermonkey/scribd/scribd-docs.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";
	//_3Ny5GS
	// Your code here...

	const Params = new URLSearchParams(window.location.search);
	function addSavedClass() {
		$("article").each((i, article) => {
			const saved = $(article).find(
				"button[data-e2e=save-button-saved]"
			)[0];
			const $title = $(article).find("p[data-e2e=title]");

			$(article).prop("title", $title.text());
			//console.log("title",$title.text());
			if (Params.get("ndown")) {
				const href = $(article).find("a._2mcyMD").prop("href");
				let url = new URL(href);
				const params = new URLSearchParams(url.search);
				params.set("ndown", true);
				url.search = params.toString();

				$(article).find("a._2mcyMD").prop("href", url.toString());
			}

			if (saved) {
				$(article).addClass("nsaved");
			} else {
				$(article).removeClass("nsaved");
			}
		});
	}

	function addStyles() {
		$("body").append(`
      <style>
         .nsaved{
           border: 1px solid green;
           opacity: 0.3;

         }
      </style>
     `);
	}
	$(document).ready(() => {
		addStyles();

		setInterval(addSavedClass, 1000);
	});
})();
