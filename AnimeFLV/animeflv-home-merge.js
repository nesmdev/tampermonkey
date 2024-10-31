// ==UserScript==
// @name         AnimeFlvHome
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www3.animeflv.net/
// @require 	https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require 	https://nesmdev.github.io/ndev/dist/ndev.1.0.1.js
// @grant        none
// ==/UserScript==

// https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// https://nesmdev.github.io/ndev/ndev.1.0.1.js

var anime_info, episodes, last_seen;
async function getAnimeData(url) {
	return $.get(url).then((html) => {
		var nextChapter = getNextChapter(html);
		const title = $(html).find("h1").text().trim();
		const image = $(html).find(".Image img").prop("src");
		const description = $(html).find(".Description p").text().trim();
		const followers = $(html).find(".Top > .Title > span").text();
		const rating = $(html).find(".Votes #votes_prmd").text();
		const votes = $(html).find(".Votes #votes_nmbr").text();
		const info = getAnime_Info(html);

		return {
			nextChapter: nextChapter,
			days:
				nextChapter && typeof nextChapter.days == "number"
					? nextChapter.days
					: null,
			title: title,
			image: image,
			description: description,
			followers: followers && parseInt(followers),
			rating:
				rating &&
				parseFloat(rating) &&
				Math.round(parseFloat(rating) * 20),
			votes: votes && parseInt(votes),
			episodes: info && info.episodes && info.episodes.length,
			last_seen: info && info.last_seen,
		};
	});
}

function getAnime_Info(html) {
	var $scripts = $(html).filter("script");
	var script = Array.from($scripts).find((script) =>
		$(script).text().includes("anime_info"),
	);

	if (!script) return false;
	var fn = $(script).text().trim().split("\n\n")[0];
	eval(fn);
	// console.log("anime_info", anime_info);
	return {
		anime_info: anime_info,
		episodes: episodes,
		last_seen: last_seen,
	};
}

function getNextChapter(html) {
	const info = getAnime_Info(html);
	if (!info) return false;
	let anime_info = info.anime_info;
	var date_ = anime_info.pop();
	// console.log("date", date_);
	var date = new ndate(date_).getDate();
	var valid = moment(date_, "YYYY-MM-DD", true).isValid();
	// console.log("valid", valid);
	if (!valid) return false;

	const Days = moment
		.duration(moment(date).diff(moment(new ndate().getDate())))
		.as("days");

	const week = new ndate().week();
	const months = new ndate().months();

	const Fecha = `${week[date.getDay()]}, ${date.getDate()} de ${
		months[date.getMonth()]
	} de ${date.getFullYear()}`;

	return {
		days: Days,
		fecha: Fecha,
		unix: date.getTime(),
		date: date.toLocaleDateString(),
	};
}

// https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// https://nesmdev.github.io/ndev/ndev.1.0.1.js
// https://nesmdev.github.io/teampermonkey/animeflv/common/anime-data.js

// const followingAnimesUrl =
// 	"https://www3.animeflv.net/perfil/makinaface/siguiendo";
// $(document).ready(function () {
// 	getFollowingAnimesData(followingAnimesUrl, { solo_estrenos: true }).then(
// 		(animes) => (ANIMES = animes)
// 	);
// });

async function getFollowingAnimesData(username, options) {
	//options => solo_estrenos:boolean, max:number
	const url = `https://www3.animeflv.net/perfil/${username}/siguiendo`;
	//?page=1

	async function response(html) {
		var animes = [];
		const $animes = Array.from($(html).find(".ListAnimes li"));

		for (let anime of $animes) {
			var estreno = $(anime).find(".Estreno").length;
			var title = $(anime).find(".Title:first").text().trim();
			var img = $(anime).find("img").prop("src");
			var desc = $(anime).find(".Description p").text().trim();
			var vts = $(anime).find(".Vts").text();
			var link = $(anime).find("a").prop("href");

			var animeData = {
				title: title,
				image: img,
				estreno: (estreno && true) || false,
				description: desc,
				vts: vts && parseInt(vts),
				link: link,
			};

			if (options && options.max && options.max <= animes.length) {
				break;
			}

			if (
				!options ||
				!options.solo_estrenos ||
				(options.solo_estrenos && animeData.estreno)
			) {
				await new Promise((solve) => {
					getAnimeData(link).then((data) => {
						var Anime = { ...animeData, ...data };
						// var Anime = data;
						animes.push(Anime);
						solve();
					});
				});
			}
		}
		return animes;
	}
	let Animes = [];
	for (var i = 3; i >= 1; i--) {
		const animes = await $.get(url + "?page=" + i).then((html) =>
			response(html),
		);
		Animes = [...Animes, ...animes];
	}

	//return $.get(url).then((html) => response(html));
	return Animes;
}

function sortAnimes(animes, prop, desc, print) {
	//options => asc:boolean, prop:string

	const escape_ = (val) => {
		if (typeof val !== "number" && typeof val !== "string") {
			return Infinity;
		} else {
			return val;
		}
	};
	let animes_ = animes.sort((a, b) => {
		let escapeA = escape_(a[prop]);
		let escapeB = escape_(b[prop]);
		let res = escapeA < escapeB ? -1 : escapeA > escapeB ? 1 : 0;
		// let res = escape_(a[prop]) - escape_(b[prop]);
		if (print) {
			console.log("a", escapeA);
			console.log("b", escapeB);
			console.log("res", res);
		}
		return res;
	});
	return desc ? animes_.reverse() : [...animes_];
}

$("body").append(`
<style>
#box-thumbnails {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

#box-thumbnails li {
	border: 1px solid gray !important;
	/*padding-bottom:10px;*/
	padding-right: 0;
	padding-left: 0;
	margin: 1px;
	border-radius: 5px !important;
}

#box-thumbnails li span {
	padding-right: 10px;
	padding-left: 10px;
	padding-bottom: 5px;
	 padding-top: 0;
}

.day-past span,
.day-past small {
	color: #ff9dce !important;
	font-weight: bold;
}

.day-today,
.day-today span,
.day-today small,
.day-seven,
.day-seven span,
.day-seven small{
	color: black !important;
	font-weight: bold;
	/*background: #8db2e5 !important;*/
	background: gray !important;
}

.published-today,
.published-today span,
.published-today small{
	color: black !important;
	font-weight: bold;
	/*background: #8db2e5 !important;*/
	/*background: #93c47d !important;*/
background: #32CD32 !important;
   /* background: #d9d9d9 !important;*/
/*background: #8db2e5 !important;*/
}

.published-today a{

color: blue !important;
}

.published-today a:visited{
 font-style: italic !important;
/*color: green !important;*/
color: purple !important;
}

.day-tomorrow span,
.day-tomorrow small {
	font-weight: bold;
	color: #8db2e5 !important;
}

.day-future span,
.day-future a,
.day-future small {
 
	color: white ;
}

.day-future a:hover {

	color: gray;
}

</style>
`);

const thumbTpl = `
<li class="{{dayClass}}" style="display: list-item">
	<a href="{{link}}">
		<figure>
			<img
				src="{{image}}"
				alt="{{title}}"
				title="{{title}}\n\n{{description}}"
			/>
			<figcaption>{{title}}</figcaption>
		</figure>
	</a>	<span  title="{{fecha}}" style="float: left" class="days">{{days}}</span>

	<span style="float: right"><small>Rating: {{rating}}%</small></span>
<br/>
    <span
         style="font-size:13px; float:left;display:flex;justify-content:center;margin-right:0 !important; margin-left:0 !important">

<span><a target="_blank" href="{{episodeUrl}}">{{title}}</a>  </span> [{{episode}}]</span>



</li>


`.trim();

const $box = $(".ListAnmsTp.ClFx:first").attr("id", "box-thumbnails");
const $thumbnails = $box.children("li");

const username = $(".Login.Online strong").text().trim();

if (username) {
	getFollowingAnimesData(username, { solo_estrenos: true }).then((animes) => {
		animes.forEach(
			(anime) =>
				(anime.days2 = anime.days === 7 ? 0 : anime.nextChapter?.days),
		);
		var animes_ = sortAnimes(animes, "days2");
		console.log(animes);
		$thumbnails.remove();
		//ANIMES = animes_;
		animes_.forEach((anime, i) => {
			//const days = anime.nextChapter && anime.nextChapter.days;
			const days = anime.days2;
			const published = anime.nextChapter?.days === 7;
			const days_ =
				typeof days !== "number"
					? // ? ""
					  // : days == 0
					  // ? "Hoy"
					  // : days == 1
					  // ? "Mañana"
					  // : days == -1
					  // ? "Ayer"
					  // : days < -1
					  // ? `Hace ${days * -1} días`
					  // : `En ${days} días`;

					  ""
					: days == 0
					? "Today"
					: days == 1
					? "Tomorrow"
					: days == -1
					? "Yesterday"
					: days < -1
					? `${days * -1} days ago`
					: `In ${days} days`;

			const dayClass =
				days < 0
					? "day-past"
					: days === 0 && published
					? "published-today"
					: days === 0
					? "day-today"
					: days === 1
					? "day-tomorrow"
					: days === 7
					? "day-seven"
					: "day-future";
			const episode = published ? anime.episodes : anime.episodes + 1;
			const thumb = new nhtml(thumbTpl)
				.setVal({
					...anime,
					days: days_ === 7 ? 1 : days_,
					fecha: anime.nextChapter?.fecha,
					dayClass: dayClass,
					episode: episode,
					episodeUrl:
						anime.link.replace("/anime/", "/ver/") +
						"-" +
						anime.episodes,
				})
				.value();

			$box.append($(thumb).hide().fadeIn(3000));
			//$thumbnails.eq(i).hide().html(thumb).fadeIn(3000);
		});
	});
}