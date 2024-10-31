// ==UserScript==
// @name         AnimeFLV-Anime Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www3.animeflv.net/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animeflv.net
// @require      https://nesmdev.github.io/ndev/dist/ndev.1.0.9.js
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...

    async function formatLinks() {
        const $episodes = Array.from(
            $("#episodeList > li:not(.Next):not(.ndone)")
        );
        $("#episodeList > li:not(.Next):not(.ndone)").addClass("ndone");

        for (const ep of $episodes) {
            const url = $(ep).find("a").prop("href");
            const links = await $.get(url).then((html) =>
                Array.from($(html).find("#DwsldCn a"))
                    .map((a) => $(a).prop("href"))
                    .map((url) => ({
                        url: url,
                        domain: new URL(url).hostname
                            .split(".")
                            .slice(-2)
                            .join("."),
                    }))
            );

            console.log("links", links);
            $(ep).append(
                "<hr/>" +
                    links
                        .map(
                            (link) => `
            <small><small>
                <a  
                    class='nlink'
                    data-domain='${link.domain}'
                    href="${link.url}"
                    target="_blank">
                    ${link.domain}
                </a> |
                <a 
                    style='color: green; cursor:pointer' 
                    class='ncopy' 
                    data-copy='${link.url}'>copy</a> |
                <a 
                    style='color: blue; cursor:pointer' 
                    class='ncopy-all' 
                    data-domain='${link.domain}'>copy all (${link.domain})</a>

            </small></small>
            `
                        )
                        .join("<br/>")
            );

            $(ep).addClass("ndone");

            $(".ncopy:not(.ndone)").on("click", function () {
                const url = $(this).data("copy");
                new nstring(url).copy2();
                console.log(url);
                $(this).css({
                    fontWeight: "bold",
                    textDecoration: "underline",
                });
            });

            $(".ncopy:not(.ndone)").addClass("ndone");

            $(".ncopy-all:not(.ndone)").on("click", function () {
                const domain = $(this).data("domain");
                const urls = Array.from(
                    $(`.nlink[data-domain='${domain}']`)
                ).map((a) => $(a).prop("href"));
                console.log(urls);
                new nstring(urls.reverse().join("\n\n")).copy2();
                $(this).css({
                    fontWeight: "bold",
                    textDecoration: "underline",
                });

                $(this).text(`copy all [${domain}] (${urls.length})`);
            });

            $(".ncopy-all:not(.ndone)").addClass("ndone");
        }
    }

    $(document).ready(function () {
        $("h1.Title").on("click", function () {
            $(this).css("color", "yellow");

            const title = $(this).text();
            new nstring(title + " [animeflv.net]").copy2();
        });

        formatLinks();
        setInterval(formatLinks, 5000);
    });
})();
