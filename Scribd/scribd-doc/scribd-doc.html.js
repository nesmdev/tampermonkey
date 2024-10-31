function createHTML(id, title, url) {
  // Add down buttons
  $("body").append(`
        <style>
          .button {
            border-radius:5px;
            font-weight:bold;
          }
          .button-blue {
            background-color: darkblue;
            color: white;
          }
          .button-black {
            background-color: black;
            color: white;
          }

           .button-red {
            background-color: red;
            color: white;
          }
        </style>

        `);
  $(".doc_actions").append(`
         <a href="https://scribddown.com/document/${id}/" target="_blank" >
             <button class="button button-blue">ScribdDown</button>
         </a>`);

  $(".doc_actions").append(`
         <a href="https://downscribd.com/download/${id}/" target="_blank" id="downscribd">
             <button class="button button-black">DownScribd</button>
         </a>`);

  //Creates compressPDF link

  const compressPDF = `https://compress-pdf.${
    Math.random() > 0.5 ? "tacz" : "isbac"
  }.info/?fileurl=https://dlscribd.vpdfs.com/pdownload/${id}/&title=${title
    .replaceAll("#", "")
    .replaceAll(`"`, "'")
    .replaceAll(
      "&",
      "y"
    )} ${id}&utm_source=downscr&utm_medium=queue&utm_campaign=dl`;

  $(".doc_actions").append(`
         <a href="${compressPDF}" target="_blank" id="compress-pdf">
             <button class="button button-red">CompressPDF</button>
         </a>`);

  //Adds ndown to thumbnails

  setTimeout(function () {
    console.log("here...");
    if (params.get("ndown") || params.get("history")) {
      console.log("history...", params.get("history"));
      $("a.thumbnail_and_info").each((i, a) => {
        a.target = "_blank";
        let url = new URL(a.href);
        let params_ = new URLSearchParams(url.search);
        params_.set("ndown", true);

        url.search = params_.toString();
        console.log(url);
        a.href = url.toString();
      });
    }
  },3000);
}
