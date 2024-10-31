// ==UserScript==
// @name         FBCommentsNotion Userscript
// @namespace    http://tampermonkey.net/
// @version      1.22.11.13
// @description  try to take over the world!
// @author       You
// @match        https://www.facebook.com/groups/ELJESUSHISTORICO*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @require      file:///E:/Teampermonkey/Notion/FB-Comments/fb-comments.js
// @require      https://nesmdev.github.io/ndev/dist/ndev.1.0.9.js
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

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
    //const authorQ = "span.xt0psk2 a";
    const adminQ =
        "span x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1j85h84"
            .split(" ")
            .join(".");
    const authorQ =
        "a x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv"
            .split(" ")
            .join(".");

    const linkQ =
        "a x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xt0b8zv xi81zsa x1fcty0u"
            .split(" ")
            .join(".");
    const dateQ =
        linkQ +
        ">" +
        "span.x4k7w5x.x1h91t0o.x1h9r5lt.x1jfb8zj.xv2umb2.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1qrby5j";

    $(document).ready(function () {
        setInterval(main, 1000);
    });

    ////////////////////////////////////
    ////////////////////////////////////
    ////////////////////////////////////

    function main() {
        $(creplyQ)
            .not(".ndata")
            .each((i, cr) => {
                setDataToCR(cr);
                $(cr).addClass("ndata");
                // console.log("data", $(cr).data());
            });

        // return false;

        $(creplyQ)
            .not(".nclick")
            .on("click", async function () {
                openCR(this);
                await new Promise((d) => setTimeout(d, 100));
                setDataToCR(this);
                const $replies = getAllRepliesFromCR(this);
                console.log("this reply...", $(this).data());
                console.log("it has " + $replies.length + " replies");

                for (const i in Array.from($replies)) {
                    const r = $replies[i];
                    openCR(r);
                    await new Promise((d) => setTimeout(d, 100));
                    setDataToCR(r);
                    console.log("replies.... " + i, $(r).data());
                }

                const replies = Array.from($replies)
                    .map((r) => $(r).data("format"))
                    .join("\n\n");

                const result = $(this).data("format") + "\n" + replies;
                console.log(result);
                new nstring(result).copy2();
                // $replies.each((i, r) => {
                //     // const more = $(r).find(moreQ)[0];
                //     // more && more.click();

                // });
                //.each((i,r)=>console.log("replies",$(r).data()))
            });
        $(creplyQ).addClass("nclick");
    }

    function setDataToCR(cr) {
        //const more = $(cr).find(moreQ)[0];
        //more && more.click();

        const content = Array.from($(cr).find(parrQ))
            .map((p) => p.innerText)
            .join("\n");
        const author = $(cr).find(authorQ).text();
        const admin = $(cr).find(adminQ).text();
        const authorLink = $(cr).find(authorQ).prop("href");
        const level = $(cr).parents("li").length;
        const [num, time] = $(cr).find(dateQ).text().split(" ");
        const times = { h: "hour", min: "minute", d: "day" };
        const url = new URL($(cr).find(linkQ).prop("href"));
        const params = new URLSearchParams(url.search);
        params.delete("__cft__[0]");
        url.search = params.toString();

        //  $(cr).toggleClass("nselected");
        const data = {
            author: author,
            authorLink: authorLink.split("?")[0],
            content: content,
            level: level - 1,
            dateStr: num + " " + time,
            date: dayjs()
                .subtract(+num, times[time] || time)
                .format("YYYY-MM-DD hh:mm:ss a"),
            link: url,
            admin:admin,
        };

        const spaces = ["", "", "> ", ">> "];

        const space = spaces[level - 1];

        //         const format = `${level} ### ${data.author}
        // ${level} ${data.content}`;

        const format =
            space +
            `      
[${data.author}${data.admin && " ("+data.admin +")"}](${data.authorLink})

---

${data.content}
[${data.dateStr}](${data.link})
`
                .split("\n")
                .join("\n" + space);

        $(cr).data({ ...data, format: format });
        // console.log("setDataToCR", data);
    }

    function openCR(cr) {
        const more = $(cr).find(moreQ);
        more && more[0] && more[0].click();

        if (more && more[0]) console.log("opened...");
    }
    function getAllRepliesFromCR(cr) {
        const level = $(cr).data("level");
        // const repliesQ = replyQ + `[data-level="${level + 1}"]`;
        // console.log("repliesQ", repliesQ);
        return $(cr)
            .parents("li:first")
            .children("div")
            .eq(1)
            .find(replyQ)
            .findByData("level", ">", level);
    }
    ////////////////////////////////////
    ////////////////////////////////////
    ////////////////////////////////////

    function getRepliesFromCR(cr) {}

    function getSubRepliesFromCR() {}

    function getComments() {
        $(commentQ + ", " + replyQ)
            .not(".ndev")
            .each((i, c) => {});
        $(commentQ + ", " + replyQ).addClass("ndev");
    }
})();
