const itemAmigosEnComun =
	".x6s0dn4 x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1olyfxc x9f619 x78zum5 x1e56ztr xyamay9 x1pi30zi x1l90r2v x1swvt13 x1gefphp";
const itemGrupo =
	".x6s0dn4 x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r xeuugli x18d9i69 x1sxyh0 xurb0ha xexx8yu x1n2onr6 x1ja2u2z x1gg8mnh"
		.split(" ")
		.join(".");
const containerGrupo =
	".x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1gslohp x12nagc xzboxd6 x14l7nz5"
		.split(" ")
		.join(".");

function hide() {
	Array.from(
		document.querySelectorAll(containerGrupo + " " + itemGrupo),
	).filter((user) => {
		const cancelar = user.innerText.includes("Cancelar solicitud");
		const agregar = user.innerText.includes("Agregar");
		const vacio = !cancelar && !agregar;

console.log(user.innerText)
		if (cancelar || vacio) {
			 user.style.display = "none";
			//user.style["background-color"] = "red";
		}
	});
}

setInterval(hide, 1000);
