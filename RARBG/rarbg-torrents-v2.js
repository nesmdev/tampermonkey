// ==UserScript==
// @name RarbgTorrents
// @namespace RarbgTorrents Script
// @match *://rargb.to/search/?search=*
// @grant none
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
// @require file:///E:/teampermonkey/rarbg/rarbg-torrents-v2.js
// ==/UserScript==
const debug =true;
const $tableTr = $(".lista2t tr");

$(document).ready(function () {
	htmlTable();
});

function htmlTable() {
	$tableTr.each((i, tr) => {
		const torrent = $(tr).find("td:eq(1)")[0];
		console.log(extractThumbnailSrc(torrent));
		$(tr).find("td:first").after("<td>No lo c Rick</td>");
	});
}

/** @Return returns the extracted source url from the 'onmouseover' attribute */
function extractThumbnailSrc(torrentAnchor) {
	if (!torrentAnchor) console.warn("null torrent anchor:", torrentAnchor);
	let thumbnailSrc = "";
	try {
		// thumbnailSrc = thumbnailSrc.match(/(?<=(return overlib('\<img src\=\')))(.*?)(?=(\' border\=0\>\'))/i)[0];
		thumbnailSrc = torrentAnchor.getAttribute("onmouseover") || "";
		thumbnailSrc = thumbnailSrc.substring(
			"return overlib('<img src='".length + 1,
			thumbnailSrc.length - "' border=0>'".length - 2,
		);
	} catch (r) {
		thumbnailSrc = MAGNET_ICO;
		console.error("extractThumbnailSrc error:", r);
	}
	if (debug)
		console.debug(
			"extractThumbnailSrc(",
			torrentAnchor,
			")->",
			thumbnailSrc,
		);
	return thumbnailSrc;
}
