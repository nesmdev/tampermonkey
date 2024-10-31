// ==UserScript==
// @name RarbgTorrents
// @namespace RarbgTorrents Script
// @match *://rargb.to/search/?search=*
// @require https://jav-user.github.io/acescript/common/nes.1.0.1.js?a=1
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-database.js
// @require https://www.gstatic.com/firebasejs/7.14.4/firebase-firestore.js
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://jav-user.github.io/lockr/lockr.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js
// @require https://jav-user.github.io/scripts/fire/config.js?a=1
// @require file:///E:/teampermonkey/rarbg/rarbg-torrents-v3.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==
const $tableTr = Array.from($(".lista2t tr"));

$(document).ready(function () {
	htmlTable();
});

async function tmajax(url) {
	return await GM.xmlHttpRequest({ url: url }).then((r) => r.responseText);
}

const plugins = {
	"thotimg.xyz": function (html, source) {
		const src = $(html).find("tbody img").attr("src");

		const full_ = new URL(source);
		full_.pathname = [src, ...full_.pathname.split("/").reverse().slice(1)]
			.reverse()
			.join("/");
		const full = full_.toString();

		console.log("full", full);
		return full;
	},
	"xxxwebdlxxx.top": function (html, source) {
		return $(html).find("img.centred").attr("src");
	},
	"13xpics.space": function (html, source) {
		return $(html).find("#image-viewer-container img").attr("src").replace(".md.",".")
	},
	"37xpics.space": function (html, source) {
		return $(html).find("#image-viewer-container img").attr("src").replace(".md.",".")
	},
	"pacific.picturedent.org":function(html,source){
		return $(html).find("img.full_img").attr("src")
	}
};

function htmlTable() {
	$tableTr.forEach((tr, i) => {
		// const torrent = $(tr).find("td:eq(1)")[0];
		// console.log(extractThumbnailSrc(torrent));
		// $(tr).find("td:first").after("<td>No lo c Rick</td>");

		if (i === 0) {
			$(tr)
				.find("td:first")
				.after(
					`<td width="150" class='header6 header40' align="center" style="width:150px">Thumbnail</td>`,
				);
		} else {
			$(tr)
				.find("td:first")
				.after(
					`<td width="150" style="width:150px">
						<a href="" id="link-${i}" target="_blank">
							<img id="img-${i}" src="" alt="" width="150px"/>
						</a>
					</td>`,
				);

			$(tr).find("td:eq(2) a").attr("target", "_blank");
			const url = $(tr).find("td:eq(2) a").prop("href");
			console.log(url);
			$.get(url)
				// .then(html=>console.log("html",html))
				.then((html) => {
					const thumb = $(html).find("p img").attr("src");
					const source = $(html)
						.find("p a img")
						.parent()
						.attr("href");

					$(`#img-${i}`).attr("src", thumb) &&
						$(`#link-${i}`).attr("href", thumb);
					console.log("thumb", thumb, "source", source);

					if (source) {
						tmajax(source).then((html) => {
							const hostname = new URL(source).hostname;

							const full =
								plugins[hostname] &&
								plugins[hostname](html, source);
							if (full) {
								$(`#link-${i}`).attr("href", full);
								$(`#link-${i}`).css("border", "2px solid red");
							}
						});
					}
				});
			// .then((src) => $(`#img-${i}`).attr("src", src) && $(`#link-${i}`).attr("href", src));
			//.then(html=>$(html).find("a").prop("href")).then(href=>console.log("href",href))
		}
	});
}