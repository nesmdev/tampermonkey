// ==UserScript==
// @name         Libgen Papers Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://libgen.is/scimag/?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://nesmdev.github.io/ndev/dist/ndev.1.0.9.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	function capitalize(str) {
		const exceptions = "the,of,and,in".split(",");
		return str
			.split(" ")
			.map((s, i) =>
				exceptions.indexOf(s.toLowerCase()) !== -1 && i !== 0
					? s.toLowerCase()
					: s[0].toUpperCase() + s.substring(1).toLowerCase()
			)
			.join(" ");
	}
	function getCitations() {
		$(".catalog tbody tr").each((i, tr) => {
			let author = $(tr).find("td:eq(0)").text();

			let title = $(tr).find("td:eq(1) p:first").text();

			let journal = $(tr)
				.find("td:eq(2)")
				.text()
				.replace("volume", "")
				.replace(", issue ", ".")
				.replace(/([0-9]{4})/g, "")
				.replace("()", "")
				.trim();

			let year_ = $(tr)
				.find("td:eq(2)")
				.text()
				.match(/([0-9]{4})/);
			let year = (year_ && year_[0]) || "";

			const title2 = new nstring(title).validFileName();
			const article = `${capitalize(author)} [${year}]. ${capitalize(
				title2
			)}. ${journal}, pp. `;

			console.log(article);

			$(tr)
				.find("td:eq(1)")
				.append(
					$(`<button>Copy citation</button>`).on(
						"click",
						function () {
							new nstring(article).copy2();
							console.log(article);
							$(this).css({
								backgroundColor: "gray",
								color: "white",
							});
						}
					)
				);
		});
	}

	$(document).ready(function () {
		getCitations();
	});
})();
