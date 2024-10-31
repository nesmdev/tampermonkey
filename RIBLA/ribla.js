// ==UserScript==
// @name         RIBLA Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.centrobiblicoquito.org/ribla/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=centrobiblicoquito.org
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	const volumes = {
		1: {
			title: "Lectura popular de la Biblia en América Latina. Una hermenéutica de la liberación",
			year: "1988",
		},
		2: { title: "Violencia. Poder y opresión", year: "1988" },
		3: {
			title: "La opción por los pobres como criterio de interpretación",
			year: "",
		},
		4: { title: "Reconstruyendo la historia", year: "" },
		"5-6": { title: "Perdónanos nuestras deudas", year: "" },
		7: { title: "Apocalíptica. Esperanza de los pobres", year: "" },

		8: { title: "Militarismo y defensa del pueblo", year: "" },
		9: { title: "Opresión y liberación", year: "" },
		10: { title: "Misericordia quiero, no sacrificios", year: "" },
		11: { title: "Biblia, 500 años. Conquista o evangelización", year: "" },
		12: { title: "Biblia, 500 años. Conquista o inclusión", year: "" },
		13: { title: "Espiritualidad de la resistencia", year: "" },
		14: { title: "Vida cotidiana. Resistencia y esperanza", year: "" },
		15: { title: "Por manos de mujer", year: "" },
		16: { title: "Urge la solidaridad", year: "" },
		17: {
			title: "La tradición del discípulo amado, cuarto evangelio y cartas de Juan",
			year: "",
		},
		18: { title: "Goel, solidaridad y redención", year: "" },
		19: { title: "Mundo negro y lectura bíblica", year: "" },
		20: { title: "Pablo de Tarso, militante de la fe", year: "" },
		21: { title: "Toda la creación gime", year: "" },
		22: { title: "Cristianismos originarios (30-70 d.C.)", year: "" },
		23: { title: "Pentateuco", year: "" },
		24: { title: "Por una tierra sin lágrimas", year: "" },
		25: { title: "Pero nosotras decimos", year: "" },
		26: { title: "La palabra se hizo india", year: "" },
		27: {
			title: "El evangelio de Mateo. La iglesia de Jesús, utopía de una iglesia nueva",
			year: "",
		},
		28: {
			title: "Hermenéutica y exégesis a propósito de la carta de Filemón",
			year: "",
		},
		29: {
			title: "Cristianismos originarios extrapalestinos (35-138 d.C.)",
			year: "",
		},
		30: { title: "Economía y vida plena", year: "" },
		31: { title: "", year: "" },
		32: { title: "", year: "" },
		33: { title: "", year: "" },
		34: { title: "", year: "" },
		35: { title: "", year: "" },
		36: { title: "", year: "" },
		37: { title: "", year: "" },
		38: { title: "", year: "" },
		39: { title: "", year: "" },
		40: { title: "", year: "" },
	};

	function downloadFile(url, fileName) {
		var link = document.createElement("a");
		link.target = "_blank";
		link.download = fileName + ".pdf";
		link.href = url;
		document.body.append(link);
		link.click();
	}

	window.onload = function () {};
})();
