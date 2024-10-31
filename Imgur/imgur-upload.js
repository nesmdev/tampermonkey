const markdown = Array.from(document.querySelectorAll("img"))
	.filter((img) => img.src.startsWith("https://i.imgur.com"))
	.map((img) => img.src)
	.map(
		(url, i, a) => `
[![Chelsea](${url} "Chelsea, ${i + 1} of ${a.length}")](${url})
`
	)
	.join("\n\n");

	
console.log(markdown);
