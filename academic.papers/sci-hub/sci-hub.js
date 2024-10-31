// ==UserScript==
// @name         Sci-Hub Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sci-hub.ru/*
// @match        https://sci-hub.mksa.top/*
// @match        https://sci-hub.ee/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sci-hub.ru
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/teampermonkey/academic.papers/sci-hub/sci-hub.js
// @grant        none
// ==/UserScript==
console.log("start...");
window.onload = function () {
	console.log("loading...");
	setTimeout(() => {
		const params = new URLSearchParams(window.location.search);
		const filename = params.get("file");
		const title = document.querySelector("h1");
		if (title) {
			title.innerHTML = "<span>"+filename+"</span>";
		}
		console.log("params", params);
		if (filename) {
			$(document).on("click mouseover", function () {
				new nstring(filename).copy();
				new nstring(filename).copy2();
				console.log("filename", filename);
				$("body").toggleClass("copied");
			});
		}
	}, 2000);

	$("body").append(`
		<style>


			.copied{
				background-color:gray;
			}


		</style>
	`)
};
