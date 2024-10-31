// ==UserScript==
// @name         torrent-general Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.torrentdownload.info/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentdownload.info
// @require      file:///E://teampermonkey/torrents/torrent-general.js
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...

    $(document).ready(function () {
        Array.from($("a[href]"))
            .filter((a) => a.href.startsWith("magnet:"))[0]
            .click();
    });
})();