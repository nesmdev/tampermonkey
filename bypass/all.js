// ==UserScript==
// @name         All Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iir.one
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	$(document).ready(function () {
		if (document.title.includes("Anoni.mo")) {
			setTimeout(() => {
				$("#timer")[0].click();
			}, 1000);

			setInterval(() => {
				const link = $("#gotolink").attr("href");
				if (link != "#") {
					window.location.href = link;
				}
			}, 1000);
		}
	});
})();
