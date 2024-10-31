// ==UserScript==
// @name         repositorio.uahurtado.cl Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://repositorio.uahurtado.cl/handle/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uahurtado.cl
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/teampermonkey/academic.papers/repositorio.uahurtado.cl.js
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...

    $(document).ready(function () {
        const link = Array.from($(".simple-item-view-uri a")).filter((a) =>
            a.href.endsWith("pdf")
        )[0];
        const title_ = $(".page-header").text().trim();
        const title = new nstring(title_).validFileName().value();
        const author = $(".simple-item-view-authors")
            .text()
            .replace("Autor", "")
            .trim()
            // .split("\n")
            // .reverse()[0]
            // .trim()
            .split(",")
            .reverse()
            .join(" ")
            .trim();

        const year = $(".simple-item-view-date")
            .text()
            .replace("Fecha", "")
            .trim();

        const ref = $(".ds-referenceSet-list").text().trim();

        const journal = ref.split("Vol.")[0].trim();

        const number = ref
            .split("Vol.")[1]
            .replace(", No. ", ".")
            .split("(")[0]
            .trim();

        const pp = link.href
            .match(/_[0-9]{1,}\.pdf/)[0]
            .replace("_", "")
            .replace(".pdf", "");

        console.log(author, year, ref, journal, number, pp);

        const name = `${author} [${year}]. ${title}. ${journal} ${number}, pp. ${pp}–`;

        console.log(name);

        $(".ds-referenceSet-list").after(
            `<button id="ncopy">copy: ${name}</button>`
        );

        $("#ncopy").on("click", function () {
            $(this).toggleClass("ncopied");

            new nstring(name).copy2();
        });

        $(link).attr("target", "_blank");
        setTimeout(() => {
            // link.click();
        }, 15000);
        $("body").append(`
            <style>
                .ncopied {

                    background-color: gray;
                    color: white;
                }

            </style>`);
    });
})();
