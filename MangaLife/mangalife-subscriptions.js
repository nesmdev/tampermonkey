// ==UserScript==
// @name         MangaLife Subscriptions Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://manga4life.com/user/subscription.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manga4life.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/plugin/relativeTime.min.js
// @require 	 file:///E:/Teampermonkey/MangaLife/mangalife-subscriptions.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	dayjs.extend(window.dayjs_plugin_relativeTime);

	function formatHtml() {
		const $items = $("div.top-10.bottom-5.ng-scope[ng-repeat]:not(.ndev)");
		$items.each((i, item) => {
			$(item).addClass("ndev");
			const date_ =
				$(item)
					.text()
					.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g) &&
				$(item)
					.text()
					.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g)[0];

			if (!date_) return;
			const $date = $(item).find(`span.ng-scope:contains(${date_})`);
			console.log("date_", date_, "$date", $date);
			const [month, day, year] = date_.split("/");
			const time = new Date().toTimeString().split(" ")[0];
			const dateStr = `${year}-${month}-${day} ${time}`;
			const date = dayjs(dateStr);
			const fromNow = date.fromNow();

			const weekDay = date.format("dddd");

			$date.after(`<span>(${weekDay}) ${fromNow}</span>`);
		});
	}
	window.onload = function () {
		setInterval(formatHtml, 3000);
	};
})();
