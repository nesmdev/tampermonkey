// ==UserScript==
// @name         Ixtheo Index Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ixtheo.de/Search/Results?lookfor=superior_ppn:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ixtheo.de
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/Teampermonkey/academic.papers/ixtheo.de/ixtheo.de-search.js
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...
    const params = new URLSearchParams(window.location.search);
    $(document).ready(function () {
        $(".row.result").each((i, chapter) => {
            const title = $(chapter).find(".title.getFull").text().trim();

            const name = new nstring(title).validFileName().value();

            const author = $(chapter)
                .find("span:contains(Autor)")
                .text()
                .split(/([0-9]|\()/)[0]
                .split(",")
                .map((w) => w.trim())
                .reverse()
                .join(" ")
                .trim();

            const book = $(chapter)
                .find("a:contains(Seite)")
                .text()
                .split(", (")[0]
                .trim();

            const year = $(chapter)
                .find("a:contains(Seite)")
                .text()
                .match(/\([0-9]{4}\)/)[0]
                .replace(/[\(\)]/g, "");

            const pages = $(chapter)
                .find("a:contains(Seite)")
                .text()
                .match(/[0-9]{1,}-[0-9]{1,}/)[0]
                .replace("-", "–");

            const file = `${author} [${year}]. ${name}. '${book}', pp. ${pages}`;

            console.log("file", file);

            $(chapter).find(".result-formats").append("<hr/>");

            const pp1 = +pages.split("–")[0].trim();

            const pp2 = +pages.split("–")[1].trim();
            const start = +params.get("start");

            if (params.get("start")) {
                $(chapter)
                    .find(".result-formats")
                    .append(
                        `<br/><span>=> (${pp1 + start}-${pp2 + start})</span>`,
                    );
            }

            $(chapter)
                .find(".result-formats")
                .append(
                    `<button data-file="${file}" class="ncopy">${file}</button>`,
                );
        });

        $(".ncopy").on("click", function () {
            const file = $(this).data("file");
            new nstring(file).copy2();
            $(this).toggleClass("nclicked");
        });

        $("body").append(`
        <style>
            .nchapter {
                border: 2px solid #007596;

            }

            .nclicked{
                background-color:gray;
                color:white;
            }
        </style>`);
    });
})();
