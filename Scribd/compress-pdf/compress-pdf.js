// ==UserScript==
// @name        Compress-PDF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://compress-pdf.tacz.info/
// @match        https://compress-pdf.isbac.info/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tacz.info

// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js
// @require      file:///E:/Teampermonkey/scribd/compress-pdf/compress-pdf.database.js
// @require      file:///E:/Teampermonkey/scribd/compress-pdf/compress-pdf.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let seconds = 0;

  setInterval(() => {
    seconds++;
    console.log("seconds", seconds, "minutes", seconds / 60);
  }, 1000);

  const params = new URLSearchParams(window.location.search);
  console.log("nid", params.get("nid"));
  console.log("search", window.location.search);
  // Your code here...
  $(document).ready(() => {
    setTimeout(window.close, 5 * 60 * 1000);
    setTimeout(() => {
      const $btn = $("a:contains(DOWNLOAD):not(.clicked)");
      if ($btn[0]) {
        $btn[0].click();
        $btn.addClass("clicked");
        const docName = $("h6:contains(was successfully compressed)")
          .text()
          .trim()
          .replace(/^File "/, "")
          .replace(/\" was successfully compressed\.$/, "");
        console.log("docName", docName);
        const docId = CryptoJS.MD5(docName).toString();
        const id = docName.split(" ").pop();
        if (!isNaN(id)) {
          let name = docName.split(" ");
          name.pop();

          documents$.doc(id).set({
            downloaded: true,
            _id: id,
            date: new Date(),
            docName: name.join(" "),
            url: `https://es.scribd.com/document/${id}/`,
            seconds: seconds,
            minutes: seconds / 60,
          });
        }

        // db.collection("scribd-vpdfs-documents-ero")
        //   .doc(docId)
        //   .get()
        //   .then((doc) => {
        //     if (doc.exists) {
        //       const data = doc.data();
        //       const docDate = data.date.toDate();
        //       const downloaded = data.downloaded;
        //       const diff = dayjs().diff(docDate, "minute", true);
        //       console.log("diff", diff + " minutes");
        //       if (diff < 10 && !downloaded) {
        //         const docRef = db
        //           .collection("scribd-vpdfs-documents-ero")
        //           .doc(docId);
        //         docRef.update({ downloaded: true, date: new Date() });

        //         docRef.get().then((doc) => {
        //           const docNum = doc.data().docNum;
        //           db.collection("scribd-vpdfs-nums-ero")
        //             .doc(docNum)
        //             .set({
        //               ...doc.data(),
        //               date: new Date(),
        //               downloaded: true,
        //             });
        //         });
        //       }
        //     }
        //   });

        setTimeout(window.close, 20 * 1000);
      }
    }, 1000);
  });
})();
