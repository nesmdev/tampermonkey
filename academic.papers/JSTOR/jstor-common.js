const connectors = [
	"a",
	"and",
	"at",
	"between",
	"by",
	"in",
	"from",
	"of",
	"on",
	"or",
	"the",
	"to",
	"with",
].map((w) => w.toUpperCase());

function getTitle(titleRaw) {
	console.log("titleRaw:", titleRaw);
	title = titleRaw
		.split(" ")
		.map((word) =>
			word !== word.toUpperCase()
				? word
				: connectors.indexOf(word) !== -1
				? word.toLowerCase()
				: _(word).capitalize(),
		)
		.map((word) => (isRomanNumber(word) ? romanToInt(word) : word))
		.join(" ");

	console.log("title:", title);
	return title;
}

function getAuthor(authorRaw) {
	console.log("authorRaw:", authorRaw);
	const author = authorRaw
		.split(" ")
		.map((w) => _(w).capitalize())
		.join(" ");
	console.log("author:", author);
	return author;
}

function getJournal(publisher) {
	const journal = publisher
		.split("\n")[0]
		.trim()
		.split(/(Vol\.|\n)/)[0]
		.trim()
		.replaceAll(":", ",")
		.split("(")[0]
		.trim()
		.split("\n")[0]
		.trim()
		.split(",")[0]
		.trim();
	// journal = journal[0].trim();
	console.log("journal", journal);

	return journal;
}

function getNum(publisher) {
	let num =
		publisher.match(/Vol\. [0-9]{1,}, No\. [0-9]{1,}/) ||
		publisher.match(/Vol\. [0-9]{1,}, Fasc\. [0-9]{1,}/) ||
		publisher.match(/Vol\. [0-9]{1,}/) ||
		publisher.match(/No\. [0-9]{1,}\:[0-9]{1,}/) ||
		publisher.match(/No\. [0-9]{1,}, Fasc\. [0-9]{1,}/) ||
		publisher.match(/No\. [0-9]{1,}/) ||
		publisher.match(/T\. [0-9]{1,}, Fasc\. [0-9]{1,}/);

	console.log("num_:", num);

	//if (!num) throw new Error("Num not found!!!");
	if (num) {
		num = num[0]
			.replace("Vol. ", "")
			.replace(", No. ", ".")
			.replace("No. ", "")
			.replace(":", ".")
			.replace("T. ", "")
			.replace(", Fasc. ", ".")
			.trim();
		console.log("num2:", num);
	} else {
		num = "";

		console.log("Num not found....");
	}
	console.log("num", num);

	return num ? " " + num : "";
}

function getYear(publisher) {
	let year =
		publisher.match(/\([0-9]{4}\)/) ||
		publisher.match(/\([A-Za-z]{3,} [0-9]{4}\)/) ||
		publisher.match(/\([A-Za-z]{3,}, [0-9]{4}\)/) ||
		publisher.match(/\([A-Za-z]{3,}\., [0-9]{4}\)/) ||
		publisher.match(/[0-9]{4}\),/) ||
		publisher.match(/\([0-9]{4}\/[0-9]{2}\),/);
	//			publisher.match(/ [0-9]{4}\)/);

	console.log("year0", year);
	if (!year) return year;
	// year = year[0].replace(/[^0-9.]/g, "").trim();
	year = year[0].replace(/[^0-9]/g, "").trim();
	console.log("year", year);
	return year;
}

function getPages(publisher) {
	let pages =
		publisher.match(/pp\. [0-9]{1,}-[0-9]{1,}/) ||
		publisher.match(/p\. [0-9]{1,}/);
	console.log("pages0", pages);
	if (!pages) return pages;
	pages = pages[0].replace("-", "–");
	console.log("pages", pages);
	return pages;
}

// Javascript program to validate
// ROMAN NUMERAL using Regular Expression

// Function to validate the
// ROMAN NUMERAL
function isRomanNumber(str) {
	str = str.toUpperCase();
	// Regex to check valid
	// ROMAN NUMERAL
	let regex = new RegExp(
		/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,
	);

	// str
	// is empty return false
	if (str == null) {
		return "false";
	}

	// Return true if the str
	// matched the ReGex
	// if (regex.test(str) == true) {
	// 	return "true";
	// }
	// else {
	// 	return "false";
	// }

	return regex.test(str);
}

function romanToInt(s) {
	s = s.toUpperCase();
	const romanHash = {
		I: 1,
		V: 5,
		X: 10,
		L: 50,
		C: 100,
		D: 500,
		M: 1000,
	};

	let accumulator = 0;
	for (let i = 0; i < s.length; i++) {
		if (s[i] === "I" && s[i + 1] === "V") {
			accumulator += 4;
			i++;
		} else if (s[i] === "I" && s[i + 1] === "X") {
			accumulator += 9;
			i++;
		} else if (s[i] === "X" && s[i + 1] === "L") {
			accumulator += 40;
			i++;
		} else if (s[i] === "X" && s[i + 1] === "C") {
			accumulator += 90;
			i++;
		} else if (s[i] === "C" && s[i + 1] === "D") {
			accumulator += 400;
			i++;
		} else if (s[i] === "C" && s[i + 1] === "M") {
			accumulator += 900;
			i++;
		} else {
			accumulator += romanHash[s[i]];
		}
	}
	return accumulator;
}
