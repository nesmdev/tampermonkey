// ==UserScript==
// @name         FBCommentsToNotion Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.facebook.com/groups/ELJESUSHISTORICO*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      file:///E:/Teampermonkey/Facebook/fb-comments-to-notion.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	$.fn.longPress = function (callback) {
		var timeout;
		var $this = this;
		for (var i = 0; i < this.length; i++) {
			$(this[i]).on("mousedown", function (e) {
				timeout = setTimeout(function () {
					callback.call($this, e);
				}, 1000);
			});
			$(this[i]).on("mouseup mouseleave", function (e) {
				clearTimeout(timeout);
			});
		}
		return this;
	};

	$.fn.findByData = function (prop, compare, val) {
		if (!val) val = compare;

		let res = $(this);

		switch (compare) {
			case "=":
				$(this).data(prop) === val;
				break;
			case "!=":
				$(this).data(prop) !== val;
				break;
			case ">":
				$(this).data(prop) > val;
				break;
			case ">=":
				$(this).data(prop) >= val;
				break;
			case "<":
				$(this).data(prop) < val;
				break;
			case "<=":
				$(this).data(prop) <= val;
				break;
		}

		return this.filter(function () {
			//return $(this).data(prop) == val;
			return res;
		});
	};

	// Your code here...

	const commentQ = "div[aria-label^='Comentario de ']";
	const replyQ = "div[aria-label^='Respuesta de ']";
	const creplyQ = commentQ + ", " + replyQ;
	const parrQ = "div[dir=auto]";
	const moreQ = "div[role=button]:contains(Ver más)";
	const authorQ = "span.xt0psk2 a";

	function openCR(cr) {
		const more = $(cr).find(moreQ);
		more && more[0] && more[0].click();
	}

	function getRepliesFromCR(cr) {}

	function getSubRepliesFromCR() {}

	function getAllRepliesFromCR(cr) {
		const level = $(cr).data("level");
		const repliesQ = replyQ + `[data-level="${level + 1}"]`;
		console.log(repliesQ);
		return $(cr)
			.parents("li:first")
			.children("div")
			.eq(1)
			.find(replyQ)
			.findByData("level", ">", level);
	}

	function setDataToCR(cr) {
		const content = Array.from($(cr).find(parrQ))
			.map((p) => p.innerText)
			.join("\n");
		const author = $(cr).find(authorQ).text();
		const level = $(cr).parents("li").length;

		$(cr).toggleClass("nselected");
		const data = {
			author: author,
			content: content,
			level: level - 1,
		};

		$(cr).data(data);

		console.log("data", data);
	}

	function startModal() {
		if (!$("#nmodal").length) {
			$("body").append(`
		 		<div id="nmodal" class="modal">
				  <div class="modal-content">
				    <span class="nclose-modal">&times;</span>
				    <p>Modal Content</p>
				  </div>
				</div>`);

			$(".nclose-modal").on("click", closeModal);
		}
	}

	function openModal() {
		$("#nmodal").show();
	}

	function closeModal() {
		$("#nmodal").hide();
	}

	function main() {
		addModalStyles();
		startModal();
		$(creplyQ)
			.not(".ndata")
			.each((i, cr) => {
				setDataToCR(cr);
				$(cr).addClass("ndata");
			});

		$(creplyQ)
			.not(".nclick")
			.on("click", function () {
				openModal();
				openCR(this);
				setDataToCR(this);
				const $replies = getAllRepliesFromCR(this);

				$replies.each((i, r) => {
					const more = $(r).find(moreQ)[0];
					more && more.click();
				});
				//.each((i,r)=>console.log("replies",$(r).data()))
			});

		$(creplyQ)
			.not(".nclick")
			.longPress(function () {
				console.log("longpress");
			});
		$(creplyQ).addClass("nclick");
	}

	function getComments() {
		$(commentQ + ", " + replyQ)
			.not(".ndev")
			.each((i, c) => {});
		$(commentQ + ", " + replyQ).addClass("ndev");
	}

	$(document).ready(function () {
		setInterval(main, 1000);
	});

	function addModalStyles() {
		$("body").append(`<style>
.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

.close-btn {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close-btn:hover,
.close-btn:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
			</style>`);
	}
})();
