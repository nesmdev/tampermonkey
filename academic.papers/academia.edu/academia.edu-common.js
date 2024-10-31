function clearTitle(titleRaw) {
	let title = titleRaw.replace(/\[(ISSN|ISBN)\: [0-9\-]{8,}]/, ""); // remove ISSN, ISBN

	return title;
}

function getTitle(titleRaw, author) {
	title = titleRaw.replace(/\([0-9]{4}\)/g, ""); // remove year
	title = title.replace(/[0-9]{4}\,/g, ""); // remove year
	title = title.replace(/ [0-9]{1,}(-|–)[0-9]{1,}/g, ""); // remove pages
	title = title.replace(/[“”]/g, "");
	title = title.replace(", vol. ", " ").replace(", no. ", ".");
	if (author) {
		title = title.replace(author, "");
	}

	title = title.replace(/\((.*)\)/g, "");

	return title.trim();
}

function getYear(titleRaw, publishRaw) {
	let yearT = titleRaw.match(/\([0-9]{4}\)/g)?.[0] || "";

	yearT = yearT.replace(/[\(\)]/g, "");

	const yearP = publishRaw.match(/[0-9]{4}/)?.[0] || "";

	let yearT2 = titleRaw.match(/[0-9]{4}/g)?.[0] || "";

	return yearT || yearP || yearT2;
}

function getPages(titleRaw) {
	let pages = titleRaw.match(/ [0-9]{1,}(-|–)[0-9]{1,}/g)?.[0] || "";
	pages = pages.replace("-", "–").trim();

	return (pages && "pp. " + pages) || "pp. –";
}

function getJournal(publisherRaw) {
	return publisherRaw.split(/[,\n]/)[0].trim();
}