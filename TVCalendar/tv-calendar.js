// ==UserScript==
// @name         TV Calendar v2 Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.pogdesign.co.uk/cat/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pogdesign.co.uk
// @require      https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.6/handlebars.min.js
// @require      file:///E:/Teampermonkey/TVCalendar/tv-calendar.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
})();

const $ = jQuery;
var _whiteblue = "#66bbff";
var _darkblue = "darkblue";
//"#66bbff";

$(document).ready(() => {
  $("hea").append(`<style>
.day, .today{
font-weight:bold;
}

.day .white{
  color: white !important;
}

.day .whiteblue{
  color: #66bbff !important;
}

.today .whiteblue {
  color: black !important;
}

.today .white {
  color: darkblue !important;
}
</style>`);

  $("div.ep.info").each((i, ep) => {
    var whiteblue = _whiteblue;
    const $parent = $(ep).parents(".today:first");
    console.log($parent.length);
    if ($parent.length) {
      whiteblue = _darkblue;
    }
    const $ep = $(ep);
    const $a = $ep.find("a");
    const $p = $ep.find("p");
    const title = $a
      .eq(0)
      .text()
      .trim()
      .replace("Agents of SHIELD", "Agents of S.H.I.E.L.D.")
      .replaceAll("&", "")
      .replaceAll("  ", " ");

    const number = $a.eq(1).text().trim();
    const episode = encodeURIComponent(title) + " " + number;
    // console.log(title,episode)

    const aTmpl = Handlebars.compile(`
          <a
              href="{{url}}"
              target="_blank"
              style="display:inline-block; color: {{color}} !important; font-weight: bold">
              {{order}}
            </a>`);
    const mainTmpl = Handlebars.compile(
      `<span style="font-weight: bold !important">{{name}}<br/>{{{title}}} {{{seed}}} {{{down}}} {{{date}}}</span><hr/>`,
    );

    function rarbg() {
      const urlTmpl = Handlebars.compile(
        `https://rarbgweb.org/torrents.php?category=18;41;49&search={{episode}}&order={{order}}&by=DESC`,
      );
      const urlDate = urlTmpl({ episode: episode, order: "data" });
      const urlSeed = urlTmpl({ episode: episode, order: "seeders" });

      const aDate = aTmpl({ url: urlDate, color: "white", order: "date" });
      const aSeed = aTmpl({ url: urlSeed, color: whiteblue, order: "seed" });

      return $(mainTmpl({ seed: aSeed, date: aDate, name: "RARBG" }));
    }

    function kickass() {
      const urlTmpl = Handlebars.compile(
        `https://katcr.to/search/{{episode}}/category/tv/?sortby={{order}}&sort=desc`,
      );
      const urlDate = urlTmpl({
        episode: episode.toLowerCase(),
        order: "time",
      });
      const urlSeed = urlTmpl({
        episode: episode.toLowerCase(),
        order: "seeders",
      });

      const aDate = aTmpl({ url: urlDate, color: "white", order: "date" });
      const aSeed = aTmpl({ url: urlSeed, color: whiteblue, order: "seed" });

      return $(mainTmpl({ seed: aSeed, date: aDate, name: "Kickass" }));
    }

    function f1337x() {
      const urlTmpl = Handlebars.compile(
        `https://1337x.to/sort-search/{{episode}}/{{order}}/desc/1/`,
      );
      const urlDate = urlTmpl({
        episode: episode.toLowerCase(),
        order: "time",
      });
      const urlSeed = urlTmpl({
        episode: episode.toLowerCase(),
        order: "seeders",
      });

      const aDate = aTmpl({ url: urlDate, color: "white", order: "date" });
      const aSeed = aTmpl({ url: urlSeed, color: whiteblue, order: "seed" });

      return $(mainTmpl({ seed: aSeed, date: aDate, name: "1337x" }));
    }

    function thepiratebay() {
      const urlTmpl = Handlebars.compile(
        `https://thepiratebay.org/search.php?q={{episode}}&all=on&search=Pirate+Search&page=0&orderby=`,
      );
      const urlDate = urlTmpl({
        episode: episode.toLowerCase(),
        order: "time",
      });
      const urlSeed = urlTmpl({
        episode: episode.toLowerCase(),
        order: "seeders",
      });

      const aDate = aTmpl({ url: urlDate, color: "white", order: "date" });
      const aSeed = aTmpl({ url: urlSeed, color: whiteblue, order: "seed" });

      return $(mainTmpl({ seed: aSeed, date: aDate, name: "ThePirateBay" }));
    }

    function limetorrents() {
      const urlTmpl = Handlebars.compile(
        `https://www.limetorrents.lol/search/all/{{episode}}/{{order}}/1/`,
      );

      console.log("epp", episode.toLowerCase().replaceAll(" ", "-"));
      const urlDate = urlTmpl({
        episode: episode
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("%20", "-"),
        order: "time",
      });
      const urlSeed = urlTmpl({
        episode: episode
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("%20", "-"),
        order: "seeds",
      });

      const aDate = aTmpl({ url: urlDate, color: "white", order: "date" });
      const aSeed = aTmpl({ url: urlSeed, color: whiteblue, order: "seeds" });

      return $(mainTmpl({ seed: aSeed, date: aDate, name: "LimeTorrents" }));
    }

    function torrentdownload() {
      const urlTmpl = Handlebars.compile(
        `https://www.torrentdownload.info/search{{order}}?q={{episode}}`,
      );

      console.log("epp", episode.toLowerCase().replaceAll(" ", "-"));
      const urlDate = urlTmpl({
        episode: episode
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("%20", "-"),
        order: "d",
      });
      const urlSeed = urlTmpl({
        episode: episode
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("%20", "-"),
        order: "",
      });

      const aDate = aTmpl({ url: urlDate, color: "white", order: "date" });
      const aSeed = aTmpl({ url: urlSeed, color: whiteblue, order: "seeds" });

      return $(mainTmpl({ seed: aSeed, date: aDate, name: "Torrentdownload" }));
    }

    function bt4g() {
      const urlTmpl = Handlebars.compile(
        `https://bt4gprx.com/search?q={{episode}}&orderby={{order}}&p=1`,
      );

      console.log("epp", episode.toLowerCase().replaceAll(" ", "-"));
      const urlDate = urlTmpl({
        episode: episode
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("%20", "-"),
        order: "time",
      });
      const urlSeed = urlTmpl({
        episode: episode
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("%20", "-"),
        order: "seeders",
      });

      const aDate = aTmpl({ url: urlDate, color: "white", order: "date" });
      const aSeed = aTmpl({ url: urlSeed, color: whiteblue, order: "seeds" });

      return $(mainTmpl({ seed: aSeed, date: aDate, name: "Bt4g" }));
    }

    function torrentgalaxy() {
      //snowfl
      const urlTmpl = Handlebars.compile(
        `https://torrentgalaxy.to/torrents.php?search={{episode}}&sort={{order}}&order=desc`,
      );

      console.log("epp", episode.toLowerCase().replaceAll(" ", "-"));
      const urlDate = urlTmpl({
        episode: episode
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("%20", "-"),
        order: "id",
      });
      const urlSeed = urlTmpl({
        episode: episode
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("%20", "-"),
        order: "seeders",
      });

      const aDate = aTmpl({ url: urlDate, color: "white", order: "date" });
      const aSeed = aTmpl({ url: urlSeed, color: whiteblue, order: "seeds" });

      return $(mainTmpl({ seed: aSeed, date: aDate, name: "torrentgalaxy" }));
    }

    function subdivx() {
      const urlTmpl = Handlebars.compile(
        `http://subdivx.com/index.php?buscar2={{episode}}&accion=5&{{{order}}}`,
      );

      const urlTitle = urlTmpl({ episode: episode });
      const urlDate = urlTmpl({ episode: episode, order: "oxfecha=2" });
      const urlDown = urlTmpl({ episode: episode, order: "oxdown=1" });
      console.log(urlDate, urlDown);

      const aTitle = aTmpl({ url: urlTitle, color: whiteblue, order: "title" });
      const aDown = aTmpl({ url: urlDown, color: "white", order: "down" });
      const aDate = aTmpl({ url: urlDate, color: whiteblue, order: "date" });

      return $(
        mainTmpl({
          title: aTitle,
          date: aDate,
          down: aDown,
          name: "SUBDIVX",
        }),
      );
    }

    $a.last().after(subdivx()).after(torrentdownload()).after(bt4g()).after(torrentgalaxy());
    // .after(kickass())
    // .after(f1337x())
    // .after(thepiratebay())
    // .after(limetorrents());
  });
});
