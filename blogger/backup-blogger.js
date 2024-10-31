// ==UserScript==
// @name         Blogger Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.blogspot.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blogspot.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js
// @require 	 file:///E:/Teampermonkey/blogger/backup-blogger.firestore.js
// @require 	 file:///E:/Teampermonkey/blogger/backup-blogger.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	const blogId = window.location.hostname;

	$(document).ready(function () {
		$("body").prepend("<button id='nstart'>Start<button/>");

		$("#nstart").on("click", function () {
			//db.collection("testinggg").add({ foo: "bar" });
			getPost(
				"https://thesecretcorps.blogspot.com/2023/03/i-hate-fairyland-v2-04.html"
			);
		});
	});

	async function getPost(url) {
		const html = await fetch(url)
			.then((res) => res.text())
			.then((data) => data);

		console.log("html", html);

		const post ={}

		post.title = $(html).find("h3.entry-title").text();
		post.content = $(html).find("div.entry-content").html();

		post.image = $(content).find("img").prop("src");

		const date_ = $(html).find("abbr.published").attr("title");

		const date = new Date(date_);
		post.date = date.getTime();

		console.log("date", date, date_, time);
	}
})();
