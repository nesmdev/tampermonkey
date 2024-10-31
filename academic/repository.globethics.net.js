// ==UserScript==
// @name         repository.globethics.net Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://repository.globethics.net/handle/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=globethics.net
// @require      file:///E:/Teampermonkey/academic/repository.globethics.net.js
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...

    let file = "";

    $(document).ready(function () {
        $(".file-download-button").on("contextmenu", copyFileName);

        fetch(window.location.href + "?show=full")
            .then((res) => res.text())
            .then((html) => getData(html));
    });
})();

function copyFileName() {
    new nstring(file).copy2();
    console.log(file);
}

function getData(html) {
    let raw = {};
    const connectors = ["a", "al", "de", "del", "el", "la", "los", "en", "y"];

    Array.from($(html).find("table").find("tr")).forEach((tr) => {
        const key = $(tr).find("td:eq(0)").text().trim();
        const value = $(tr).find("td:eq(1)").text().trim();

        raw[key] = value;
    });

    let data = [
        raw["dc.contributor.author"].split(",").reverse().join(" ").trim(),
        raw["dc.date.issued"],
        raw["dc.title"].split("[")[0].trim(),
        raw["ge.subtitle"] ? raw["ge.subtitle"].split("[")[0].trim() : "",
        raw["dc.source.journaltitle"].split("(")[0].split("[")[0].trim(),
        raw["dc.source.volume"] || raw["dc.source.issue"]
            ? " " + (raw["dc.source.volume"] || raw["dc.source.issue"])
            : "",
        raw["dc.source.beginpage"] || raw["dc.source.endpage"]
            ? `, pp. ${raw["dc.source.beginpage"] ||""}–${raw["dc.source.endpage"]||""}`
            : "",
    ];

    let [author, year, title, subtitle, journal, volume, pages] = data;

    // if (title.toUpperCase() === title)
    //     title = new nstring(title).lower().capitalize().value();

    // if (subtitle.toUpperCase() === subtitle)
    //     subtitle = new nstring(subtitle).lower().capitalize().value();

    title = title
        .split(" ")
        .map((word) =>
            word !== word.toUpperCase()
                ? word
                : connectors.indexOf(word.toLowerCase()) !== -1
                ? word.toLowerCase()
                : new nstring(word).lower().capitalize().value()
        )
        .join(" ");
    subtitle = subtitle
        .split(" ")
        .map((word) =>
            word !== word.toUpperCase()
                ? word
                : connectors.indexOf(word.toLowerCase()) !== -1
                ? word.toLowerCase()
                : new nstring(word).lower().capitalize().value()
        )
        .join(" ");

    let fullTitle = new nstring(subtitle ? `${title}. ${subtitle}` : title)
        .validFileName()
        .value();

    console.log(data);

    file =
        `${author} [${year}]. ${fullTitle}. ${journal}${volume}${pages}.pdf`.replaceAll(
            "  ",
            " "
        );

    $(".file-download-button")
        .css({ backgroundColor: "gray", color: "white" })
        .after(`<span>${file}</span>`);

    console.log("file", file);
}
