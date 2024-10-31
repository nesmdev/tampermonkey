function addNdown(links) {
	links.forEach((a) => {
		a.target = "_blank";

		const url = new URL(a.href);
		const params = new URLSearchParams(url.search);

		params.set("ndown", true);

		url.search = params.toString();

		a.href = url.toString();
	});
}

async function autoClick(links) {
	console.log("links", links);
	let a = document.createElement("a");
	a.setAttribute("target", "_blank");
	a.id = "myNLink";

	console.log("a", a);

	document.querySelector("#myNLink") || document.body.append(a);
	let myLink = document.querySelector("#myNLink");

	console.log("myLink", myLink);
	for (let i = 0; i < links.length; i++) {
		await new Promise((done) => setTimeout(done, 10 * 1000));
		myLink.href = links[i].href;
		addNdown([myLink]);
		//links[i].click();
		myLink.click();
	}
}
autoClick(links);
// search
let links = Array.from(document.querySelectorAll("article"))
	.filter(
		(post) =>
			!post.querySelectorAll("button[data-e2e=save-button-saved]").length
	)
	.map((post) => post.querySelectorAll("a")[0]);

autoClick(links);

//////////

let links = Array.from(
	document.querySelectorAll("[data-e2e=recommendations] article")
)
	.filter(
		(post) =>
			!post.querySelectorAll("button[data-e2e=save-button-saved]").length
	)
	.slice(0, 70)
	.map((post) => post.querySelector("a"));
autoClick(links);
// user uploads

let links = Array.from($("a.doc_link "));

$("a.doc_link ").each((i, a) => {
	a.target = "_blank";

	const url = new URL(a.href);
	const params = new URLSearchParams(url.search);

	params.set("ndown", true);

	url.search = params.toString();

	a.href = url.toString();
});

//click thumbnails

async function clickLinks() {
	let links = Array.from($("a.thumbnail_and_info")).slice(0, 30);
	for (let i = 0; i < links.length; i++) {
		await new Promise((done) => setTimeout(done, 10 * 1000));

		links[i].click();
	}
}

//main

let links = Array.from(
	document.querySelectorAll("[data-e2e=recommendations] article")
)
	.filter(
		(post) =>
			!post.querySelectorAll("button[data-e2e=save-button-saved]").length
	)
	.slice(0, 67)
	.map((post) => post.querySelector("a"));

addNdown(links);

// search

let links = Array.from(document.querySelectorAll("article"))
	.filter(
		(post) =>
			!post.querySelectorAll("button[data-e2e=save-button-saved]").length
	)
	.map((post) => post.querySelectorAll("a")[0]);
