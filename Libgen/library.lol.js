// ==UserScript==
// @name         library.lol Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://library.lol/main/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=library.lol
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	$(document).ready(function () {
		setTimeout(
			() => $("a:contains(GET)").prop("target", "_blank")[0].click(),
			3000
		);
		setTimeout(window.close, 5000);
	});
})();
