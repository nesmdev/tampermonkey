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
// @require      file:///E:/Teampermonkey/JSTOR/JSTOR-article.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...
	// console.log(new nstring("123").lower());

	const connectors = [
		"a",
		"and",
		"at",
		"between",
		"by",
		"in",
		"of",
		"or",
		"the",
		"to",
		"with",
	].map((w) => w.toUpperCase());

	function start() {
		const $title = $(
			`turnaway-pharos-heading.title-font,
			 book-view-pharos-heading,
			 mfe-content-details-pharos-heading.item-title-heading,
			 mfe-turnaway-pharos-heading span`
		);
		if ($title.hasClass("ndev")) return;
		$title.addClass("ndev");
		let title = $title.text().trim();

		console.log("title 0", title);
		title = title
			.split(" ")
			.map((word) =>
				word !== word.toUpperCase()
					? word
					: connectors.indexOf(word) !== -1
					? word.toLowerCase()
					: _(word).capitalize()
			)
			.map((word) => (isRomanNumber(word) ? romanToInt(word) : word))
			.join(" ");
		//if (title === title.toUpperCase()) title = title.toLowerCase();

		if (!title) throw new Error("Title not found!!");

		console.log("title", title);

		const $author = $(`div.author-font,
			div.item-authors,
			p.content-meta-data__authors`);

		console.log("$author",$author[0])
		const author = $author
			.text()
			.trim()
			.split(" ")
			.map((w) => _(w).capitalize())
			.join(" ");

		if (!author) throw new Error("Author not found!!");

		console.log("author", author);

		// const authorSearch = `https://www.jstor.org/action/doBasicSearch?Query=au%3A%28%22${author}%22%29`;
		const authorSearch = encodeURI(
			`https://www.jstor.org/action/doBasicSearch?Query=au:("${author}")&acc=off&efqs=eyJjdHkiOlsiYW05MWNtNWhiQT09Il19`
		);

		$author.html(`<a href="${authorSearch}">${author}</a>`);

		// const publisher = $("turnaway-pharos-link:first")
		// 	.parent()
		// 	.parent()
		// 	.text()
		// 	.trim();

		const publisher = $(
			`div.turnaway-content__summary,
			div.item-journal-info,
			div[data-qa=journal],
			div.summary-journal`
		)
			.text()
			.trim();

		console.log("publisher", publisher);

		if (!publisher) throw new Error("Publisher not found!");
		// .split("\n")
		// .map((w) => w.trim())
		// .filter((w) => w)
		// .join(" ")
		// .trim();

		// const journal = publisher.split("Vol.")[0].replace(",","").trim();
		const journal = publisher
			.split(/(Vol\.|\n)/)[0]
			.trim()
			.replaceAll(":", ",")
			.split("(")[0].trim()
			.split("\n")[0]
			.trim();
		// journal = journal[0].trim();
		console.log("journal", journal);

		let num =
			publisher.match(/Vol\. [0-9]{1,}, No\. [0-9]{1,}/) ||
			publisher.match(/Vol\. [0-9]{1,}, Fasc\. [0-9]{1,}/) ||
			publisher.match(/Vol\. [0-9]{1,}/) ||
			publisher.match(/No\. [0-9]{1,}\:[0-9]{1,}/) ||
			publisher.match(/No\. [0-9]{1,}, Fasc\. [0-9]{1,}/) ||
			publisher.match(/No\. [0-9]{1,}/) ||
			publisher.match(/T\. [0-9]{1,}, Fasc\. [0-9]{1,}/);

		console.log("num1:", num);

		//if (!num) throw new Error("Num not found!!!");
		if (num) {
			num = num[0]
				.replace("Vol. ", "")
				.replace(", No. ", ".")
				.replace("No. ", "")
				.replace(":", ".")
				.replace("T. ", "")
				.replace(", Fasc. ", ".")
				.trim();
			console.log("num2:", num);
		} else {
			num = "";

			console.log("Num not found....");
		}

		let year =
			publisher.match(/\([0-9]{4}\)/) ||
			publisher.match(/\([A-Za-z]{3,} [0-9]{4}\)/) ||
			publisher.match(/\([A-Za-z]{3,}, [0-9]{4}\)/) ||
			publisher.match(/\([A-Za-z]{3,}\., [0-9]{4}\)/) ||
			publisher.match(/[0-9]{4}\),/) ||
			publisher.match(/\([0-9]{4}\/[0-9]{2}\),/);
		//			publisher.match(/ [0-9]{4}\)/);

		if (!year) throw new Error("Year not found!!");
		// year = year[0].replace(/[^0-9.]/g, "").trim();
		year = year[0].replace(/[^0-9]/g, "").trim();

		let pages =
			publisher.match(/pp\. [0-9]{1,}-[0-9]{1,}/) ||
			publisher.match(/p\. [0-9]{1,}/);
		if (!pages) throw new Error("No pages found!!");
		pages = pages[0].replace("-", "–");

		const name = `${author} [${year}]. ${new nstring(
			title
		).validFileName()}. ${journal}${num ? " " + num : ""}, ${pages}`;
		console.log({
			title: title,
			author: author,
			publisher: publisher,
			journal: journal,
			num: num,
			year: year,
			pages: pages,
			name: name,
		});

		$title.after(`
			<button class="nbutton">Copy: ${name}</button>
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
			new nstring(name).copy2();
			console.log(name);
			$(this).css({ backgroundColor: "black", color: "white" });
		});
	}

	$(document).ready(function () {
		setInterval(start, 1000);
	});
})();

// Javascript program to validate
// ROMAN NUMERAL using Regular Expression

// Function to validate the
// ROMAN NUMERAL
function isRomanNumber(str) {
	str = str.toUpperCase();
	// Regex to check valid
	// ROMAN NUMERAL
	let regex = new RegExp(
		/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/
	);

	// str
	// is empty return false
	if (str == null) {
		return "false";
	}

	// Return true if the str
	// matched the ReGex
	// if (regex.test(str) == true) {
	// 	return "true";
	// }
	// else {
	// 	return "false";
	// }

	return regex.test(str);
}

function romanToInt(s) {
	s = s.toUpperCase();
	const romanHash = {
		I: 1,
		V: 5,
		X: 10,
		L: 50,
		C: 100,
		D: 500,
		M: 1000,
	};

	let accumulator = 0;
	for (let i = 0; i < s.length; i++) {
		if (s[i] === "I" && s[i + 1] === "V") {
			accumulator += 4;
			i++;
		} else if (s[i] === "I" && s[i + 1] === "X") {
			accumulator += 9;
			i++;
		} else if (s[i] === "X" && s[i + 1] === "L") {
			accumulator += 40;
			i++;
		} else if (s[i] === "X" && s[i + 1] === "C") {
			accumulator += 90;
			i++;
		} else if (s[i] === "C" && s[i + 1] === "D") {
			accumulator += 400;
			i++;
		} else if (s[i] === "C" && s[i + 1] === "M") {
			accumulator += 900;
			i++;
		} else {
			accumulator += romanHash[s[i]];
		}
	}
	return accumulator;
}
