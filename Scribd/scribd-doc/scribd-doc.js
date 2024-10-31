// ==UserScript==
// @name         Scribd Doc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://es.scribd.com/document/*/*
// @match        https://es.scribd.com/doc/*/*
// @match        https://es.scribd.com/presentation/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scribd.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      file:///E:/Teampermonkey/scribd/scribd-doc/scribd-doc.database.js
// @require      file:///E:/Teampermonkey/scribd/scribd-doc/scribd-doc.html.js
// @require      file:///E:/Teampermonkey/scribd/scribd-doc/scribd-doc.history.js
// @require      file:///E:/Teampermonkey/scribd/scribd-doc/scribd-doc.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	function getRandomNumberBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	//usage example: getRandomNumberBetween(20,400);

	$(document).ready(() => {
		//Get DATA from document
		const url = window.location.href;
		const id = url.match(/\/[0-9]{1,}\//g)[0].replaceAll("/", "");
		const title = $("h1:first").text();
		console.log({ url: url, id: id, title: title });

		createHTML(id, title, url);

		const user = Array.from(
			$(".auto__app_page_body_metadata_publisher a[href]")
		).filter(
			(a) => a.href.includes("/user/") || a.href.includes("/publisher/")
		)[0];

		const User = {};
		User.userName = user.innerText.trim();
		User.userUrl = user.href;
		User.userId = user.href.match(/\/[0-9]{4,}\//g)[0].replaceAll("/", "");
		console.log("User", User);

		const doc$ = documents$.doc(id);
		const user$ = users$.doc(User.userId);

		const randomSeconds = getRandomNumberBetween(30 * 1000, 60 * 1000);
		const randomMinutes = getRandomNumberBetween(
			3 * 60 * 1000,
			4 * 60 * 1000
		);
		// const randomSeconds = getRandomNumberBetween(15 * 1000, 30 * 1000);
		// const randomMinutes = getRandomNumberBetween(
		// 	1.5 * 60 * 1000,
		// 	2 * 60 * 1000
		// );
		console.log(
			"randomSeconds",
			randomSeconds / 1000,
			"randomMinutes",
			randomMinutes / (60 * 1000)
		);

		if (params.get("ndown")) {
			function saveDoc() {
				user$.get().then((user_) => {
					console.log("we are in user...");
					if (!user_.exists) {
						user$
							.set({
								...User,
								date: new Date(),
								documentsCount: 0,
							})
							.then(() => console.log("User created!!"));
					}
				});

				doc$.get().then((doc) => {
					if (!doc.exists) {
						const Doc = {
							docName: title,
							_id: id,
							url: url,
							date: new Date(),
							downloaded: false,
							user: User,
						};
						doc$.set(Doc).then((done) =>
							setTimeout(location.reload, 5000)
						);

						user$
							.collection("documents")
							.doc(id)
							.set(Doc)
							.then(() => {
								console.log("getting snap...");
								user$
									.collection("documents")
									.get()
									.then((snap) => {
										console.log("snap size", snap.size);
										user$.update({
											documentsCount: snap.size,
											date: new Date(),
										});
									});
							});
					} else if (!doc.data().downloaded) {
						doc$.update({ date: new Date() }).then((done) =>
							setTimeout(location.reload, 5000)
						);
					} else {
						console.log("Already downloaded....");
						setTimeout(window.close, 15000);
					}

					console.log("doc.data", doc.data());
				});
			}
			setTimeout(() => {
				saveDoc();
				// db.collection(collectionId)
				// 	.doc(id)
				// 	.get()
				// 	.then((doc) => {
				// 		const Doc = {
				// 			docName: title,
				// 			_id: id,
				// 			url: url,
				// 			date: new Date(),
				// 			downloaded: false,
				// 			user: User,
				// 		};
				// 		if (!doc.exists) {
				// 			db.collection(collectionId).doc(id).set(Doc);

				// 			db.collection(usersId)
				// 				.doc(User.userId)
				// 				.collection("documents")
				// 				.doc(id)
				// 				.set(Doc)
				// 				.then(() => {
				// 					db.collection(usersId)
				// 						.doc(User.userId)
				// 						.collection("documents")
				// 						.get((snap) => {
				// 							db.collection(usersId)
				// 								.doc(User.userId)
				// 								.update({ documentsCount: snap.size });
				// 						});
				// 				});
				// 		} else {
				// 			db.collection(collectionId).doc(id).update({ date: new Date() });
				// 		}
				// 	});
				$("#compress-pdf")[0].click();
				$("button:contains(Guardar)")[0] &&
					$("button:contains(Guardar)")[0].click();

				console.log(new Date());

				const interval = setInterval(saveDoc, randomMinutes);
			}, randomSeconds);
		}

		if (params.get("history")) getHistory();
	});
})();
