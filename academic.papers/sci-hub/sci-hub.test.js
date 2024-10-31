// ==UserScript==
// @name         Sci-Hub Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sci-hub.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sci-hub.ru
// @require      file:///E:/ndev/dist/ndev.1.0.11.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...

  function forceDownload(blob, filename) {
    var a = document.createElement("a");
    a.download = filename;
    a.href = blob;
    // For Firefox https://stackoverflow.com/a/32226068
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Current blob size limit is around 500MB for browsers
  function downloadResource(url, filename) {
    if (!filename) filename = url.split("\\").pop().split("/").pop();
    fetch(url, {
      headers: new Headers({
        Origin: location.origin,
        "content-disposition": "attachment",
      }),
      mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
      })
      .catch((e) => console.error(e));
  }

  //downloadResource('https://giant.gfycat.com/RemoteBlandBlackrussianterrier.webm');

  window.onload = function () {
    setTimeout(function () {
      //   const url =document.querySelector("pdf-viewer")
      //.shadowRoot.querySelector("embed").getAttribute("original-url")
      const url =
        "https:" +
        document
          .getElementById("buttons")
          .querySelector("button")
          .getAttribute("onclick")
          .replace("location.href='", "")
          .replace("'", "");

      console.log("url", url);
      //    new nurl(url).downloadAs("documentoooo.pdf")

      downloadResource(url, "aaaaaa.pdf");
    }, 5000);
  };
})();
