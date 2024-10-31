// ==UserScript==
// @name         Libgen Papers Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1 backup
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

	function getCitations() {
		$(".catalog tbody tr").each((i, tr) => {
			const qq = $("input[name=q]")
				.val()
				.toLowerCase()
				.split(" ")
				.map((w) => w.trim());
			const ww = $(tr)
				.find("td:eq(0)")
				.text()
				.toLowerCase()
				.split(/[ .;]/)
				.map((w) => w.trim());
			const matches = qq.every((q) => ww.indexOf(q) !== -1);
			//if(matches) $(tr).find("td:eq(0)").css("backgroundColor","yellow");

			let author = $(tr).find("td:eq(0)").text();
			author = (author.split(",")[1] || "") + " " + author.split(",")[0];

			let title = $(tr).find("td:eq(1) p:first").text();

			let journal = $(tr)
				.find("td:eq(2)")
				.text()
				.replace("volume", "")
				.replace(`, issue `, ".")
				.replace(/([0-9]{4})/g, "")
				.replace("()", "");

			let year_ = $(tr)
				.find("td:eq(2)")
				.text()
				.match(/([0-9]{4})/);
			let year = (year_ && year_[0]) || "";

			const title2 = new nstring(title).validFileName();
			const article = `${author} [${year}]. ${title2}. ${journal.trim()}, pp. `;

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
