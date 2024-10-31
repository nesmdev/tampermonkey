// ==UserScript==
// @name         Oxford Book Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://academic.oup.com/edited-volume/*
// @exclude      https://academic.oup.com/edited-volume/*/chapter-abstract/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oup.com
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/teampermonkey/academic.editorials/oxford/academic.oup.com.js
// @require      file:///E:/teampermonkey/academic.common/academic.common.js
// @resource css file:///E:/teampermonkey/academic.common/academic.common.css
// @grant        GM_getResourceURL
// ==/UserScript==

const url = GM_getResourceURL("css");
addStylesURL(url);

(function () {
    "use strict";

    // Your code here...
    const book = $("h1.book-info__title:first").text().trim();
    $(document).ready(function () {
        //chapter-pagerange-value

        const $chapters = Array.from($("li.headings"));
        getChapters($chapters);
    });

    async function getChapters($chapters) {
        for (const item of $chapters) {
            $(item).addClass("nchapter");
            const url = $(item).find("a.tocLink").prop("href");
            const title = $(item)
                .find("span.access-title")
                .text()
                .trim()
                .replaceAll("\n", " ");
            const year = $("div.book-info__publication-date")
                .text()
                .trim()
                .match(/[0-9]{4}/)?.[0];

            const authors = Array.from($(item).find("span.not-linked-name"))
                .map((author) => $(author).text().trim())
                .join(", ");

            const pages = await $.get(url).then((res) =>
                $(res)
                    .find(".chapter-pagerange-value")
                    .text().trim()
                    .replace("-", "–"),
            );

            const file = `${authors} [${year}]. ${title}. '${book}', pp. ${pages}`;

            $(item).append(`
                <button 
                    class="ncopy" 
                    data-copy="${file}">${file}
                </button>`);
        }
    }
})();
