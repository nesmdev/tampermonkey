// ==UserScript==
// @name         JSTOR Article Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.jstor.org/stable/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jstor.org
// @require      https://code.jquery.com/jquery-3.6.2.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/Teampermonkey/academic.papers/JSTOR/JSTOR-common.js
// @require      file:///E:/Teampermonkey/academic.papers/JSTOR/JSTOR-article.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	function start() {
		const $title = $(
			`turnaway-pharos-heading.title-font,
			 book-view-pharos-heading,
			 mfe-content-details-pharos-heading.item-title-heading,
			 mfe-turnaway-pharos-heading span`,
		);
		if ($title.hasClass("ndev")) return;
		$title.addClass("ndev");

		const titleRaw = $title.text().trim();
		if (!titleRaw) throw new Error("TitleRaw not found!!");

		const title = getTitle(titleRaw);

		const $author = $(`div.author-font,
			div.item-authors,
			p.content-meta-data__authors`);

		const authorRaw = $author.text().trim();
		if (!authorRaw) throw new Error("authorRaw not found!!");

		const author = getAuthor(authorRaw);

		// const authorSearch = `https://www.jstor.org/action/doBasicSearch?Query=au%3A%28%22${author}%22%29`;
		const authorSearch = encodeURI(
			`https://www.jstor.org/action/doBasicSearch?Query=au:("${author}")&acc=off&efqs=eyJjdHkiOlsiYW05MWNtNWhiQT09Il19`,
		);

		$author.html(`<a href="${authorSearch}">${author}</a>`);

		const publisherRaw = $(
			`div.turnaway-content__summary,
			div.item-journal-info,
			div[data-qa=journal],
			div.summary-journal`,
		)
			.text()
			.trim();

		console.log("publisherRaw", publisherRaw);

		if (!publisherRaw) throw new Error("publisherRaw not found!");

		const journal = getJournal(publisherRaw);

		const num = getNum(publisherRaw);
		if (!num) throw Error("No num found!!");

		const year = getYear(publisherRaw);

		const pages = getPages(publisherRaw);

		if (!pages) throw Error("No pages found!!");

		const name = new nstring(title).validFileName().value();
		const file = `${author} [${year}]. ${name}. ${journal}${num}, ${pages}`;

		console.log({
			title: title,
			author: author,
			publisher: publisherRaw,
			journal: journal,
			num: num,
			year: year,
			pages: pages,
			file: file,
			name: name,
		});

		$title.after(`<br/>
			<button class="nbutton">Copy: ${file}</button>
			<hr/>
			<button class="nbutton">
				<a 
					target="_blank" 
					href="https://sci-hub.mksa.top/${window.location.href.split("?")[0]}">
						Sci-Hub.mksa.top
				</a>
			</button>
			<hr/>
			<button class="nbutton">
				<a 
					target="_blank" 
					href="https://sci-hub.ru/${window.location.href.split("?")[0]}">
						Sci-Hub.ru
				</a>
			</button>

			<hr/>
			<button class="nbutton">
				<a 
					target="_blank" 
					href="https://libgen.is/scimag/?q=${author} ${title}">
						Go to LibGen
				</a>
			</button>
			`);

		$(".nbutton").on("click", function () {
			new nstring(file).copy2();
			console.log(file);
			$(this).css({ backgroundColor: "black", color: "white" });
		});
	}

	$(document).ready(function () {
		setInterval(start, 5000);
	});
})();
