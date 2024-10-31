// ==UserScript==
// @name         Scribd Register Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://es.scribd.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scribd.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.8/dayjs.min.js
// @require      file:///E:/Teampermonkey/scribd/scribd-register.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	function llenarForm() {
		const user = document.getElementById("word_user[name]");
		if (!user) return;
		if (user.value) return;
		const email = document.getElementById("email_address[email]");
		const password = document.getElementById("word_user[password]");
		console.log(user, email, password);

		user.value = "Olestar " + dayjs().format("YYYY-MM-DD");
		email.value =
			"olestar-" + dayjs().format("YYYY-MM-DD") + "@olestar.com";
		password.value = "Olestar " + dayjs().format("YYYY-MM-DD");
	}
	window.onload = function () {
		setInterval(llenarForm, 1000);
	};
})();
