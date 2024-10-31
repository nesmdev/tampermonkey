// ==UserScript==
// @name         dialnet.unirioja.es Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://dialnet.unirioja.es/servlet/autor?codigo=*
// @match        https://dialnet.unirioja.es/buscar/documentos?querysDismax.DOCUMENTAL_TODO=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unirioja.es
// @require      https://nesmdev.github.io/ndev/dist/ndev.1.0.9.js
// @require 	 file:///E:/Teampermonkey/Dialnet/dialnet-autor.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	function formatHtml() {
		$("li.articulo").each((i, art) => {
			let titulo = $(art).find("p.titulo").text();
			// titulo = new nstring(titulo).validFileName();
			titulo = titulo
				.split(": ")
				.map((word) => {
					if (word === word.toUpperCase()) return word;
					return word[0].toUpperCase() + word.substr(1);
				})
				.join(": ");

			const autor = $(art).find(".autores").text();
			const pdf = $(art).find("a:contains(Texto completo)")[0];
			const journal = $(art)
				.find(".localizacion a:first")
				.text()
				.split(/[:\.]/)[0]
				.replace("Ilu. Revista de ciencias de las religiones", "'Ilu, RCR")
				.trim();
			const nums = $(art).find(".localizacion a:eq(1)").text().split(",");

			let num = "";
			let year = "";

			console.log("nums", nums);

			if (nums.length === 3) {
				num = nums[0].trim() + "||" + nums[1].trim();
				//  year = nums[2].trim();
			} else if (nums.length === 2) {
				num = nums[0].trim();
				//  year = nums[1].trim();
			}

			// year = $(art)
			// 	.find(".localizacion")
			// 	.text()
			// 	.match(/(, [0-9]{4},)/g);
			year =
				$(art)
					.find(".localizacion")
					.text()
					.match(/(, [0-9]{4},)/g) ||
				$(art)
					.find(".localizacion")
					.text()
					.match(/, [0-9]{4} [\/(]/g) ||
				$(art)
					.find(".localizacion")
					.text()
					.match(/(, [0-9]{4}-[0-9]{4},)/g);
			// year = year && year[0] && year[0].replace(/\D/g, "");
			year = year && year[0] && year[0].replace(/[ ,()]/g, "");

			num = num
				.replace(/[a-zA-Zº(). ]/g, "")
				.replace("||", ".")
				.trim();

			let pags = "";

			pags = $(art)
				.find(".localizacion")
				.text()
				.match(/(págs.) [0-9]{1,}-[0-9]{1,}/);

			if (!pags)
				pags = $(art)
					.find(".localizacion")
					.text()
					.match(/pág. [0-9]{1,}/);

			pags =
				pags &&
				pags[0]
					.replace("págs.", "")
					.replace("pág.", "")
					.replace("-", "–")
					.trim();
			console.log(`ab${num}cd`);

			let name = `${autor} [${year}]. ${titulo}. ${journal}${
				num ? " " + num : ""
			}, pp. ${pags}`;
			name = new nstring(name).validFileName().replaceAll("..", ".");
			console.log("name", name);
			console.log("loc... ", $(art).find(".localizacion").text());

			let google = `${titulo} ${autor}`;
			google = new nstring(google).validFileName();

			$(art).append(
				`<button data-copy="${name}" class="btn-copy">copy name</button>
					<br/>
					<button data-copy="${name}.pdf" class="btn-copy">copy name.pdf</button>
					<br/>
				<button><a 
					target="_blank" 
					href="https://www.google.com/search?q=${google}">
						Google
				</button>`
			);

			if (pdf) {
				console.log(name);
				$(art).addClass("npdf");
			}
		});

		$(".btn-copy").on("click", function () {
			const name = $(this).data("copy");
			console.log(name);
			new nstring(name).copy2();
			$(this).css({ backgroundColor: "black", color: "white" });
		});
	}

	function addStyles() {
		$("body").append(`
     <style>

        .npdf{

          border: 2px solid blue;
          border-radius: 10px;
        }
     </style>`);
	}

	$(document).ready(() => {
		formatHtml();

		addStyles();
	});
})();
