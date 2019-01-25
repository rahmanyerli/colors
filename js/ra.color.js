/**
 * Ra Color Generator JS
 */

function changeResultType() {
	var resultType = document.querySelector("input[type=radio][name=type]:checked").value;
	var colorPalette = document.getElementById("colorPalette");
	var colorCells = colorPalette.querySelectorAll("textarea");
	if (colorCells) {
		for (const colorCell of colorCells) {
			var color = colorCell.value;
			if (isHex(color)) {
				switch (resultType) {
					case "rgb":
						rgb = hexToRgb(color);
						colorCell.value = toRgbString(rgb.r, rgb.g, rgb.b);
						break;
					case "hsl":
						rgb = hexToRgb(color);
						hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
						colorCell.value = toHslString(hsl.h, hsl.s, hsl.l);
						break;
				}
			}
			else if (isRgb(color)) {
				rgb = toRgbObject(color);
				switch (resultType) {
					case "hex":
						hex = rgbToHex(rgb.r, rgb.g, rgb.b);
						colorCell.value = hex;
						break;
					case "hsl":
						hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
						colorCell.value = toHslString(hsl.h, hsl.s, hsl.l);
						break;
				}
			}
			else if (isHsl(color)) {
				var hsl = toHslObject(color);
				switch (resultType) {
					case "hex":
						var rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
						hex = rgbToHex(rgb.r, rgb.g, rgb.b);
						colorCell.value = hex;
						break;
					case "rgb":
						var rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
						colorCell.value = toRgbString(rgb.r, rgb.g, rgb.b);
						break;
				}
			}
		}
	}
}

function createColorCell() {
	var colorCell = document.createElement("textarea");
	colorCell.classList.add("color");
	colorCell.classList.add("span-2");
	colorCell.setAttribute("readonly", "readonly");
	colorCell.addEventListener("click", copyToClipboard);
	return colorCell;
}

function generateAll() {
	var iconGear = document.getElementById("iconGear");
	iconGear.classList.add("rotate");
	var colorPalette = document.getElementById("colorPalette");
	var colorTone = document.querySelector("input[type=radio][name=tone]:checked").value;
	var resultType = document.querySelector("input[type=radio][name=type]:checked").value;
	colorPalette.innerHTML = "";
	for (let i = 0; i < 18; i++) {
		var colorCell = createColorCell();
		var color = generate(colorTone, resultType);
		colorCell.style.backgroundColor = color;
		colorCell.value = color;
		colorPalette.appendChild(colorCell);
	}
	setTimeout(() => {
		iconGear.classList.remove("rotate");
	}, 600);
}

function createPalette() {
	var iconGear = document.getElementById("iconGear");
	iconGear.classList.add("rotate");
	var colorPalette = document.getElementById("colorPalette");
	colorPalette.innerHTML = "";
	var r = randomColor(0, 255);
	var g = randomColor(0, 255);
	var b = randomColor(0, 255);
	var resultType = document.querySelector("input[type=radio][name=type]:checked").value;

	for (let i = 1; i < 20; i++) {
		var colorCell = document.createElement("textarea");
		colorCell.classList.add("color");
		colorCell.classList.add("span-2");
		colorCell.setAttribute("readonly", "readonly");
		var hsl = rgbToHsl(r, g, b);
		var l = i * 0.05;
		var rgb = hslToRgb(hsl.h, hsl.s, l);
		let color = "";
		switch (resultType) {
			case "hex":
				color = rgbToHex(rgb.r, rgb.g, rgb.b);
				break;
			case "rgb":
				color = toRgbString(rgb.r, rgb.g, rgb.b);
				break;
			case "hsl":
				color = toHslString(hsl.h, hsl.s, l);
				break;
		}
		colorCell.style.backgroundColor = color;
		colorCell.value = color;
		colorCell.addEventListener("click", copyToClipboard);
		colorPalette.appendChild(colorCell);
	}
	setTimeout(() => {
		iconGear.classList.remove("rotate");
	}, 600);
}

function generate(colorTone, resultType) {
	var min = 0;
	var max = 255;

	switch (colorTone) {
		case "matt":
			var min = 51;
			var max = 204;
			break;
		case "pastel":
			var min = 153
			var max = 255;
			break;
	}
	var r = randomColor(min, max);
	var g = randomColor(min, max);
	var b = randomColor(min, max);
	var color;
	switch (resultType) {
		case "hex":
			color = rgbToHex(r, g, b);
			break;
		case "rgb":
			color = toRgbString(r, g, b);
			break;
		case "hsl":
			var hsl = rgbToHsl(r, g, b);
			color = toHslString(hsl.h, hsl.s, hsl.l);
			break;
	}
	return color;
}

function shadeAll() {
	var colorPalette = document.getElementById("colorPalette");
	colorPalette.innerHTML = "";
	var resultType = document.querySelector("input[type=radio]:checked").value;
	var color = document.getElementById("colorText").value;
	var rgb;
	var hsl = { h: 0, s: 0, l: 0 };
	if (isHex(color)) {
		rgb = hexToRgb(color);
		hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
	}
	else if (isRgb(color)) {
		rgb = toRgbObject(color);
		hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
	}
	else if (isHsl(color)) {
		var hslArray = color.substring(4, color.length - 1).replace(/\s/g, "").split(",");
		hsl.h = hslArray[0];
		hsl.s = parseFloat(hslArray[1].replace(/%/g, "")) / 100;
		hsl.l = parseFloat(hslArray[2].replace(/%/g, "")) / 100;
	}
	else {
		return false;
	}
	for (let i = 1; i < 20; i++) {
		var l = i / 20;
		var colorCell = shade(hsl, l, resultType);
		colorPalette.appendChild(colorCell);
		if (hsl.l > l && hsl.l < l + 0.049) {
			var originalColor = shade(hsl, hsl.l, resultType);
			originalColor.style.animation = "wiggle 1s ease";
			colorPalette.appendChild(originalColor);
			setTempText(originalColor, 2000, "your shade is here!");
		}
		else if (hsl.l == l) {
			colorCell.style.animation = "wiggle 1s ease";
			setTempText(colorCell, 2000, "your shade is here!");
		}
	}
}

function shade(hsl, l, resultType) {
	var colorCell = createColorCell();
	var rgb = hslToRgb(hsl.h, hsl.s, l);
	var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
	colorCell.style.backgroundColor = hex;

	switch (resultType) {
		case "hex":
			colorCell.value = hex;
			break;
		case "rgb":
			colorCell.value = toRgbString(rgb.r, rgb.g, rgb.b);
			break;
		case "hsl":
			colorCell.value = toHslString(hsl.h, hsl.s, l);
			break;
	}
	return colorCell;
}


function randomColor(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toHex(c) {
	var hex = parseInt(c).toString(16).toUpperCase();
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + toHex(r) + toHex(g) + toHex(b);
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function copyToClipboard(event) {
	var element = event.target;
	element.select();
	document.execCommand("copy");
	var text = element.value;
	element.value = "copied!";
	element.setAttribute("disabled", "disabled");
	setTimeout(() => {
		element.value = text;
		element.removeAttribute("disabled");
	}, 500);
}


function hslToRgb(hue, sat, light) {
	var t1, t2, r, g, b;
	hue = hue / 60;
	if (light <= 0.5) {
		t2 = light * (sat + 1);
	} else {
		t2 = light + sat - (light * sat);
	}
	t1 = light * 2 - t2;
	r = parseFloat(hueToRgb(t1, t2, hue + 2) * 255).toFixed();
	g = parseFloat(hueToRgb(t1, t2, hue) * 255).toFixed();
	b = parseFloat(hueToRgb(t1, t2, hue - 2) * 255).toFixed();
	return { r: r, g: g, b: b };
}

function hueToRgb(t1, t2, h) {
	if (h < 0) h += 6;
	if (h >= 6) h -= 6;
	if (h < 1) return (t2 - t1) * h + t1;
	else if (h < 3) return t2;
	else if (h < 4) return (t2 - t1) * (4 - h) + t1;
	else return t1;
}

function rgbToHsl(r, g, b) {
	var min, max, i, l, s, maxcolor, h, rgb = [];
	rgb[0] = r / 255;
	rgb[1] = g / 255;
	rgb[2] = b / 255;
	min = rgb[0];
	max = rgb[0];
	maxcolor = 0;
	for (i = 0; i < rgb.length - 1; i++) {
		if (rgb[i + 1] <= min) { min = rgb[i + 1]; }
		if (rgb[i + 1] >= max) { max = rgb[i + 1]; maxcolor = i + 1; }
	}
	if (maxcolor == 0) {
		h = (rgb[1] - rgb[2]) / (max - min);
	}
	if (maxcolor == 1) {
		h = 2 + (rgb[2] - rgb[0]) / (max - min);
	}
	if (maxcolor == 2) {
		h = 4 + (rgb[0] - rgb[1]) / (max - min);
	}
	if (isNaN(h)) { h = 0; }
	h = h * 60;
	if (h < 0) { h = h + 360; }
	l = (min + max) / 2;
	if (min == max) {
		s = 0;
	} else {
		if (l < 0.5) {
			s = (max - min) / (max + min);
		} else {
			s = (max - min) / (2 - max - min);
		}
	}
	s = s;
	return { h: h, s: s, l: l };
}

function roundDown(num, precision) {
	precision = Math.pow(10, precision); // power
	return parseFloat(Math.round(num * precision) / precision);
}

function roundUp(num, precision) {
	precision = Math.pow(10, precision); // power
	return parseFloat(Math.ceil(num * precision) / precision);
}

function isHex(value) {
	var pattern = /^#(?:[0-9a-f]{3}){2}$/i;
	return pattern.test(value);
}

function isRgb(value) {
	var pattern = /([R][G][B][A]?[(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1)))?[)])/i;
	return pattern.test(value);
}

function isHsl(value) {
	var pattern = /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\)/i;
	return pattern.test(value);
}

function toHslString(h, s, l) {
	return "hsl(" + roundUp(h, 0) + ", " + parseInt(roundDown(s, 2) * 100) + "%, " + parseInt(roundDown(l, 2) * 100) + "%)";
}

function toRgbString(r, g, b) {
	return "rgb(" + r + ", " + g + ", " + b + ")";
}

function toRgbObject(rgbText) {
	var rgbArray = rgbText.substring(4, rgbText.length - 1).replace(/\s/g, "").split(",");
	return { r: rgbArray[0], g: rgbArray[1], b: rgbArray[2] };
}

function toHslObject(hslText) {
	var hslArray = hslText.substring(4, hslText.length - 1).replace(/\s/g, "").split(",");
	return { h: hslArray[0], s: parseFloat(hslArray[1].replace(/%/g, "")) / 100, l: parseFloat(hslArray[2].replace(/%/g, "")) / 100 };
}

function setTempText(element, delay, text) {
	var original = element.value;
	element.value = text;
	setTimeout(() => {
		element.value = original;
	}, delay);
}

function mix(colors) {
	let r = 0;
	let g = 0;
	let b = 0;
	if (colors && colors.length > 0) {
		for (const color of colors) {
			let rgb = color.getAttribute("data-color").split(",");
			r += parseInt(rgb[0]);
			g += parseInt(rgb[1]);
			b += parseInt(rgb[2]);
		}
		r = Math.round(r / colors.length);
		g = Math.round(g / colors.length);
		b = Math.round(b / colors.length);
	}
	return { r: r, g: g, b: b };
}

function mixall() {
	const colorMix = document.getElementById("colorMix");
	const colors = colorMix.querySelectorAll("[draggable]");
	const colorArray = [];
	let rgb = "rgb(255, 255, 255)";
	if (colors && colors.length > 0) {
		for (const color of colors) {
			colorArray.push(color.getAttribute("data-color"));
		}
		const mixed = mix(colors);
		let colorPalette = document.getElementById("colorPalette");
		rgb = toRgbString(mixed.r, mixed.g, mixed.b);
	}
	else {
		let em = document.createElement("em");
		em.textContent = "drop zone";
		em.className = "span-12 text-center color-3";
		colorMix.appendChild(em);
	}
	let colorText = document.getElementById("colorText");
	colorText.value = rgb;
	shadeAll();
}