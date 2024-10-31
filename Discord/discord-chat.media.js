let title = document
	.querySelector(".headerContent-2SNbie")
	.innerText.replace(/[^A-Z0-9\._-]/gi, " ")
	.trim();

let chat = document
	.querySelector(".titleWrapper-24Kyzc")
	.innerText.replace(/[^A-Z0-9\._-]/gi, " ")
	.replace(title, "")
	.trim();

let posts = Array.from(document.querySelectorAll("li.messageListItem-ZZ7v6g"));

let cmd = posts
	.map((post) => {
		const time = post.querySelector("time").getAttribute("datetime");
		const media = Array.from(
			post.querySelectorAll(".originalLink-Azwuo9,video")
		).map((e) => e.href || e.src);

		return media.map(
			(url, i) =>
				`node E://node//ndownload.js "${url}" "D://downnode/discord/${title}/${chat}" "${time.replaceAll(
					":",
					"."
				)}_${i + 1}"`
		);
	})
	.flatMap((line) => line);

// console.log(cmd[0]);
console.log(cmd.join("\n") + "\n");
