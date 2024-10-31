// ==UserScript==
// @name         MangaLife Manga Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://manga4life.com/manga/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manga4life.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/plugin/relativeTime.min.js
// @require 	 file:///E:/Teampermonkey/MangaLife/mangalife-manga.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...
	dayjs.extend(window.dayjs_plugin_relativeTime);
	function formatHtml() {
		$("a.ChapterLink:not(.ndev)").each((i, item) => {
			$(item).addClass("ndev");
			const date_ = $(item)
				.text()
				.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g)[0];

			const $date = $(`span:contains(${date_})`);
			console.log("date_", date_);
			const [month, day, year] = date_.split("/");
			const dateStr = `${year}-${month}-${day}`;
			const date = dayjs(dateStr);
			const fromNow = date.fromNow();
			const format = date.format("dddd, DD/MM/YYYY");

			$date.html(`${format}<br/>(${fromNow})`);
		});
	}
	window.onload = function () {
		setInterval(formatHtml, 1000);
	};
})();
