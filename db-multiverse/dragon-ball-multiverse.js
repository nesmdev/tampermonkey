// ==UserScript==
// @name         DB-M Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.dragonball-multiverse.com/en/chapters.html?comic=page
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dragonball-multiverse.com
// @require      https://nesmdev.github.io/ndev/dist/ndev.1.0.9.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	async function getImageUrl(pageUrl) {
		return $.get(pageUrl).then((res) =>
			$(res.trim()).find("#h_read img,#page1000 img").prop("src")
		);
	}

	function addCheckBoxes() {
		$(".cadrelect.chapter ").each((i, ch) => {
			const title = $(ch).find("h4").text();
			$(ch).append(
				`<input type="checkbox" class="nselect" data-title="${title}">
				<hr/>
				<button class="nget">Get selected chapters</button>`
			);
		});

		$(".nselect").on("click", function () {
			const title = $(this).data("title");
			$(`.cadrelect.chapter:contains(${title})`).toggleClass(
				"nselected",
				this.checked
			);
		});

		$(".nget").on("click", function () {
			$(this).css({ color: "white", backgroundColor: "black" });
			getCommands();
		});

		$("body").append(`
			<style>
       .nselected {

       	background-color: purple;
       }

		</style>`);
	}

	async function getChapter(ch) {
		const title = $(ch).find("h4").text().replace("Chap.", "Chapter");
		const pages = Array.from($(ch).find("p > a")).map((a) => ({
			num: ("000000" + $(a).prop("href").match(/\d+/)[0]).substr(-6),
			url: $(a).prop("href"),
		}));
		//console.log("pages", pages);

		//const images =
		return await Promise.all(
			pages.map((page) =>
				getImageUrl(page.url).then((url) => ({
					...page,
					url: url,
					title: new nstring(title).validFileName(),
				}))
			)
		);
		//console.log("images", images);
		//return images;
	}
	async function getChapters() {
		const chapters = await Promise.all(
			Array.from($(".cadrelect.chapter.nselected")).map((ch) =>
				getChapter(ch)
			)
		);

		return chapters;
	}

	async function getCommands() {
		const chapters = await getChapters();
		const images = chapters.flat();
		console.log("images", images);
		const host = window.location.hostname.replace("www.", "");
		const commands = images.map(
			(img) =>
				`node E://node//ndownload.js "${img.url}" "downnode/${host}/${img.title}" "${img.num}.jpg"`
		);

		const command = "D:\n" + commands.join("\n") + "\n\n";
		new nstring(command).copy2();
		console.log("command", command);
		alert(chapters.length + " Copied!");
	}

	$(document).ready(function () {
		addCheckBoxes();

		//setTimeout(getCommands, 5000);
	});
})();
