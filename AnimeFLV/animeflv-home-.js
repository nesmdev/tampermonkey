// ==UserScript==
// @name         AnimeFlvHome
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www3.animeflv.net/
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require https://nesmdev.github.io/ndev/dist/ndev.1.0.1.js
// @require https://nesmdev.github.io/teampermonkey/animeflv/common/anime-data.js?v=3
// @require https://nesmdev.github.io/teampermonkey/animeflv/common/animes-data.js?v=4
// @grant        none
// ==/UserScript==

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
.day-tomorrow a,
.day-tomorrow small {
	font-weight: bold;
	color: #8db2e5 !important;
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
				(anime.days2 = anime.days === 7 ? 0 : anime.nextChapter?.days)
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
					// ? ""
					// : days == 0
					// ? "Hoy"
					// : days == 1
					// ? "Mañana"
					// : days == -1
					// ? "Ayer"
					// : days < -1
					// ? `Hace ${days * -1} días`
					// : `En ${days} días`;

					? ""
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

/*

$("ul.pagination a:not(:contains(»)):not(:contains(«))").each((i,a)=>{
console.log($(a).prop("href"));

})
*/
