// ==UserScript==
// @name         free-proxy-list.net Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://free-proxy-list.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=free-proxy-list.net
// @require 	 file:///E:/Teampermonkey/proxy/free-proxy-list.net.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	$(document).ready(function () {
		let proxies = "";
		let tmp = "http://<host>:<port>";
		$("table")
			.eq(0)
			.find("tbody tr")
			.each((i, tr) => {
				let host = $(tr).find("td").eq(0).text();

				let port = $(tr).find("td").eq(1).text();
				let https =
					$(tr).find("td").eq(6).text() === "yes" ? "https" : "http";

				const proxy = `${https}://${host}:${port}`;

				proxies = proxies + "\n" + proxy;
			});

		console.log(proxies);
	});
})();
