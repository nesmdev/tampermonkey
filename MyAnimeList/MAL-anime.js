// ==UserScript==
// @name         MAL Anime Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://myanimelist.net/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js
// @require      https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	const firebaseConfig = {
		apiKey: "AIzaSyD9U9NJ_yyjOqYtOCndZ93_eLfeSODX1WU",
		authDomain: "joldmanproject.firebaseapp.com",
		projectId: "joldmanproject",
		storageBucket: "joldmanproject.appspot.com",
		messagingSenderId: "374482065711",
		appId: "1:374482065711:web:08c949604dd3eece35e9da",
	};

	// Initialize Firebase
	const app = firebase.initializeApp(firebaseConfig);
	const db = firebase.firestore();
	const path = window.location.pathname;
	const animeId = path.match(/\/[0-9]{1,}\//)[0].replaceAll("/", "");
	console.log("animeId", animeId);
	//  const animeId = https://myanimelist.net/anime/50265/Spy_x_Family

	$(document).ready(function () {
		//db.collection("lista").add({ foo: "bar" });
		updateLinksView();
		$("h2:contains(Synopsis)").before(`
           <textarea name="" id="nMyLink" cols="30" rows="5"></textarea>
           <br/>
           <button id="nAddLink">Add</button>
           <hr/>
           <div id="nMyLinks"></div>
           `);

		$("#nAddLink").on("click", function () {
			const link = $("#nMyLink").val().replaceAll("\n", "<br/>");
			db.collection("myAnimes")
				.doc(animeId)
				.collection("links")
				.add({ link: link, created: new Date() })
				.then((res) => {
					$("#nMyLink").val("");
					console.log(link);
					updateLinksView();
				});
			//db.collection("myAnimeLinks").doc
		});

		function isUrl(url) {
			let sw = false;
			try {
				new URL(url);
				sw = true;
			} catch (e) {
				console.log(e);
			}
			return sw;
		}

		async function updateLinksView() {
			const allLinks = await db
				.collection("myAnimes")
				.doc(animeId)
				.collection("links")
				.orderBy("created", "desc")
				.get()
				.then((querySnapshot) =>
					querySnapshot.docs.map((doc) => {
						let link = doc.data().link;
						let date = doc
							.data()
							.created.toDate()
							.toLocaleDateString();
						link = link
							.split("<br/>")
							.map((word) =>
								isUrl(word)
									? `<a target="_blank" href="${word}">${word}</a>`
									: word
							)
							.join("<br/>");

						return `
							<tr>

								<td><button name="delete-link" data-id="${doc.id}" title="${doc.id}">x</button></td>
                                <td> <p>${link}</p></td>
                                <td> <p>${date}</p></td>
							</tr>`;
					})
				);

			console.log("allLinks", allLinks);

			$("#nMyLinks").html(
				"<table border=1>" + allLinks.join("") + "</table>"
			);

			$("button[name=delete-link]").on("click", function () {
				console.log(new Date());
				if (!window.confirm("Delete link?")) return false;
				const id = $(this).data("id");

				db.collection("myAnimes")
					.doc(animeId)
					.collection("links")
					.doc(id)
					.delete()
					.then(() => updateLinksView());
			});
		}
	});
})();
