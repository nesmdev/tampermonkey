// ==UserScript==
// @name         scribd vpdfs Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://scribd.vpdfs.com/document/*/
// @match        https://scribd.vpdfs.com/download/*/?hash=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vpdfs.com
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js
// @require 	 file:///E:/Teampermonkey/scribd/scribd.vpdfs.com.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	const firebaseConfig = {
		apiKey: "AIzaSyDn8pd1I6H2X_ZbUE6IF_MRkWAWXvqQArs",
		authDomain: "document-downloads.firebaseapp.com",
		projectId: "document-downloads",
		storageBucket: "document-downloads.appspot.com",
		messagingSenderId: "644218564903",
		appId: "1:644218564903:web:fb179ba1a34105b405f902",
		measurementId: "G-3QC6WMQ5C9",
	};

	// Initialize Firebase
	const app = firebase.initializeApp(firebaseConfig);
	const db = firebase.firestore();

	console.log("app", app);

	const url = new URL(window.location.href);
	const params = new URLSearchParams(url.search);
	const docName = $("h1").text().trim();
	const docId = CryptoJS.MD5(docName).toString();
	const docNum = window.location.href.match(/\/[0-9]{4,}\//g);
	console.log("docNum", docNum);

	setInterval(() => {
		db.collection("scribd-vpdfs-documents")
			.doc(docId)
			.get()
			.then((doc) => {
				if (!doc.exists) window.location.search = "";

				const data = doc.data();
				const date = data.date.toDate();
				const downloaded = data.downloaded;

				const diff = dayjs().diff(date, "minute", true);

				if (diff > 3 && !downloaded) window.location.search = "";

				if (diff <= 3 && !downloaded) return false;

				//	if (diff > 5 || !downloaded) window.location.search = "";
				console.log("diff", diff, "downloaded", downloaded);

				setTimeout(window.close, 3000);
			});
	}, 30 * 1000);

	if (params.get("mode") === "nodownload") return false;

	params.set("mode", "nodownload");
	url.search = params.toString();

	$(document).ready(function () {
		//db.collection("lista").add({ foo: "bar" });
		db.collection("scribd-vpdfs-documents")
			.doc(docId)
			.set({
				docName: docName,
				date: new Date(),
				downloaded: false,
				url: "https://es.scribd.com/document" + docNum[0],
				docNum: docNum[0].replaceAll("/", ""),
			});
		setInterval(() => {
			const btn = $(
				"a:contains(Download PDF):visible:not(.nclicked),button:contains(Download PDF):visible:not(.nclicked)"
			)[0];
			if (btn) {
				if (btn.href) {
					$("body").append(
						`<a id="myurl" href="${url.toString()}" target="_blank">myurl</a>`
					);
					console.log("myurl", url.toString());
					$("#myurl")[0].click();
				}

				btn.click();
				$(btn).addClass("nclicked");
				setTimeout(window.close, 3000);
			}
		}, 35 * 1000);
	});
})();
