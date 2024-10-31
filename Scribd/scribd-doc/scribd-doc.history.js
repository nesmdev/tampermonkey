function getHistory() {
	documents$
		.where("downloaded", "==", false)
		.get()
		.then((querySnapshot) => {
			let docs = querySnapshot.docs
				.map((doc) => doc.data())
				.filter((doc) => doc.url && !doc.downloaded)
				.sort(
					(a, b) =>
						b.date.toDate().getTime() - a.date.toDate().getTime()
				);

			if (params.get("sort") === "name")
				docs = docs.sort((a, b) => a.docName.localeCompare(b.docName));

			const html = docs
				.map(
					(doc, i) =>
						`<a href="${
							doc.url
						}" target="_blank">.     ${i + 1}). ${
							doc.docName
						}</a> | 
							<a href="https://scribd.vpdfs.com/document/${doc._id}/" title="${doc.date
							.toDate()
							.toString()}">
							(${dayjs().diff(dayjs(doc.date.toDate()), "m")} min, ${dayjs().diff(
							dayjs(doc.date.toDate()),
							"h"
						)} hours)</a>`
				)
				.join("<br/>");

			$("#compress-pdf").after("<div>"+html+"</div>");
		});
}
