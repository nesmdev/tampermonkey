// ==UserScript==
// @name         journals.sagepub Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://journals.sagepub.com/doi/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sagepub.com
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @require      file:///E:/teampermonkey/academic.papers/journals.sagepub.js
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...

    let name = "";

    function getData() {
        const citation = $("div#citationToCopy").html();
        if (
            !$("div#citationToCopy").text().trim() ||
            $("div#citationToCopy").text().trim() === "Loading ..."
        )
            return;
        if ($("div#citationToCopy").hasClass("ndev")) return;
        $("div#citationToCopy").addClass("ndev");

        console.log("citation", $("div#citationToCopy").text());

        const author = $("span[property=author] a:first").text().trim();
        const year = $("div.meta-panel__onlineDate")
            .text()
            .match(/[0-9]{4}/)[0]
            .trim();

          // const year = $(citation)
          //   .text()
          //   .match(/[0-9]{4}/)[0];

        const title_ = $("h1[property=name]").text().trim();
        const title = new nstring(title_).validFileName().value();
        const volume = $("div.core-enumeration:first")
            .text()
            .trim()
            .replace("Volume ", "")
            .replace(", Issue ", ".");

        const journal = $(citation).find("i:first").text();
        const pages = $(citation)
            .text()
            .match(/[0-9]{1,}–[0-9]{1,}/)[0];

        console.log({
            author: author,
            year: year,
            title_: title_,
            title: title,
            volume: volume,
            journal: journal,
            pages: pages,
        });

        name = `${author} [${year}]. ${title}. ${journal} ${volume}, pp. ${pages}`;
        console.log("name", name);

        $("button:contains(COPY CITATION)").after(
            `<hr/>
            <button data-copy="${name}" class="nbutton" id="nbutton-copy">copy: ${name}</button>
            <hr/>
            <button class="nbutton">
                <a 
                    target="_blank" 
                    href="https://sci-hub.mksa.top/${window.location.href}">
                        Go to Sci-Hub
                </a>
            </button>
            <hr/>
            <button class="nbutton">
                <a 
                    target="_blank" 
                    href="https://libgen.is/scimag/?q=${author} ${title}">
                        Go to LibGen
                </a>
            </button>`
        );

        $(".nbutton").on("click", function () {
            $(this).toggleClass("dark");
            const value = $(this).data("copy").trim();
            if (!value) return;
            new nstring(value).copy2();
        });
    }

    setTimeout(() => {
        $("a[data-id=article-toolbar-cite]")[0].click();
    }, 1000);

    setInterval(function () {
        getData();
    }, 1000);

    $("body").append(`
        <style>
            .nbutton {
                border-radius: 5px;
            }
            .nbutton.dark {
                color:gray;
                background-color:black;
            }
        </style>
        `);
})();
