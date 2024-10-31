// ==UserScript==
// @name         Facebook Group Search Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.facebook.com/groups/*/user/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @require      file:///E:/ndev/dist/ndev.1.0.10.js
// @require      file:///E:/Teampermonkey/Facebook/fb-group-search.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...
	function addFunctions() {
		document
			.querySelectorAll(
				"div.x1iorvi4.x1pi30zi.x1l90r2v.x1swvt13:not(.ndev)"
			)
			.forEach((div) => {
				console.log("added functions to " + div.innerText);
				div.parentNode.parentNode.oncontextmenu = function () {
					console.log(div.innerText);
					new nstring(div.innerText+".pdf").copy2();
				};

				div.classList.add("ndev");
			});
	}

	window.onload = function () {
		setInterval(addFunctions, 1000);
	};
})();
