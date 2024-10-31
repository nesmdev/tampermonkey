function addStyles(styles) {
	const tag = document.createElement("style");
	tag.textContent = styles;
	document.body.appendChild(tag);
}
function addStylesURL(url) {
	const tag = document.createElement("link");
	tag.href = url;
	tag.rel = "stylesheet";
	document.body.appendChild(tag);
}

setInterval(function () {
	$(".ncopy:not(.nfun)").on("click", function () {
		const copy = $(this).data("copy");
		new nstring(copy).copy2();
		$(this).toggleClass("nclicked");
	});

	$(".ncopy:not(.nfun)").addClass("nfun");
	console.log("Copied:\n" + copy);
}, 1000);
