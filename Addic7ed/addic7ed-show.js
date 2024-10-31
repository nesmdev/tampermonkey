// ==UserScript==
// @name         Addic7ed Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.addic7ed.com/show/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=addic7ed.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require 	 file:///E:/Teampermonkey/Addic7ed/addic7ed-show.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	const langs = ["french", "portuguese (brazilian)"];

	$(document).ready(function () {
		$("tr").each((i, tr) => {
			const lang = $(tr).find("td").eq(3).text().trim().toLowerCase();
			const hi = $(tr).find("td").eq(6).text().trim();
			console.log("hi", hi);

			if (langs.indexOf(lang) !== -1) {
				$(tr).hide();
			}

			if (!hi) $(tr).css("fontWeight", "bold");
		});
	});
})();
