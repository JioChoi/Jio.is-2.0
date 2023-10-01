var previousPage = 0;
var page = 0;

var canvas;
var ctx;
var deltaEnd = 0;

var particles;
var particleSize = 5;

var spawnInterval;

const words = [
	"C",
	"C++",
	"JAVA",
	"SDL2",
	"HTML",
	"CSS",
	"JAVASCRIPT",
	"Node.js",
	"GDI+",
	"Windows API",
	"MFC",
	"MATLAB",
	"IIS",
	"Apache 2",
	"MySQL",
	"PHP",
	"OpenGL",
	"GLSL",
	"Arduino"
];

var createdParticles = [];

window.onload = function () {
	initTypeWriter();
	initItems();
	initCanvas();

	addEventListener("scroll", scrollAnimation);
	scrollAnimation();

	// Hide loading screen
	document.getElementById("loading").classList.add("hidden");

	// Begin down arrow animation
	setTimeout(() => {
		document.getElementById("down").classList.add("show");
		setTimeout(() => {
			document.getElementById("down").classList.add("animate");
		}, 500);
	}, 1000);

	addEventListener("mousedown", function (e) {
		var x = Math.floor(e.clientX / particleSize);
		var y = Math.floor(e.clientY / particleSize);

		// Circle brush
		for(var by = -10; by <= 10; by++) {
			for(var bx = -10; bx <= 10; bx++) {
				setParticle(x + bx, y + by, null);
			}
		}
	});
}

function initCanvas() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var arrayW = Math.floor(canvas.width / particleSize);
	var arrayH = Math.floor(canvas.height / particleSize);

	particles = new Array(arrayH);
	for (var y = 0; y < arrayH; y++) {
		particles[y] = new Array(arrayW);
		particles[y].fill(null);
	}
	
	setInterval(update, 1000 / 60);
	setInterval(render, 1000 / 60);
}

function update() {
	// Update Particles
	for(var y = particles.length - 1; y >= 0; y--) {
		for(var x = 0; x < particles[y].length; x++) {
			if (getParticle(x, y) != null) {
				// Gravity
				if (getParticle(x, y + 1) == null) {
					setParticle(x, y + 1, getParticle(x, y));
					setParticle(x, y, null);
				}
				else {
					if (getParticle(x - 1, y + 1) == null && getParticle(x - 1, y) == null) {
						setParticle(x - 1, y + 1, getParticle(x, y));
						setParticle(x, y, null);
					}
					if (getParticle(x + 1, y + 1) == null && getParticle(x + 1, y) == null) {
						setParticle(x + 1, y + 1, getParticle(x, y));
						setParticle(x, y, null);
					}
				}
			}
		}
	}
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var y = 0; y < particles.length; y++) {
		for(var x = 0; x < particles[y].length; x++) {
			if(getParticle(x, y) != null && getParticle(x, y) != undefined) {
				ctx.fillStyle = particles[y][x].color;
				ctx.fillRect(x * particleSize, y * particleSize, particleSize, particleSize);
			}
		}
	}
}

function setParticle(x, y, particle) {
	if(x < 0 || x >= particles[0].length || y < 0 || y >= particles.length) {
		return -1;
	}

	particles[y][x] = particle;
}

function getParticle(x, y) {
	if(x < 0 || x >= particles[0].length || y < 0 || y >= particles.length) {
		return -1;
	}

	return particles[y][x];
}

function spawnString(sx, sy, string) {
	const colors = [
		"#ff80ed",
		"#ffd700",
		"#fa8072",
		"#66cdaa",
		"#ff7f50"
	];

	if(sx + getStringWidth(string) > (canvas.width / particleSize)) {
		sx -= getStringWidth(string) + 1;
	}

	var color = colors[Math.floor(Math.random() * colors.length)];

	var width = 0;
	for(var i = 0; i < string.length; i++) {
		spawnChar(sx + width, sy + getGlyphOffset(string[i]), string[i], color);
		width += getGlyphWidth(string[i]) + 1;
	}
}

function getStringWidth(string) {
	var width = 0;
	for(var i = 0; i < string.length; i++) {
		width += getGlyphWidth(string[i]) + 1;
	}
	return width;
}

function spawnChar(sx, sy, char, color) {
	var data = fontData.glyphs[char].pixels;

	for(var y = 0; y < data.length; y++) {
		for(var x = 0; x < data[y].length; x++) {
			if(data[y][x] == 1) {
				spawn(sx + x, sy + y, color);
			}
		}
	}
}

function getGlyphWidth(char) {
	return fontData.glyphs[char].pixels[0].length;
}

function getGlyphOffset(char) {
	return fontData.glyphs[char].offset;
}

function spawn(x, y, color) {
	var particle = {
		color: color
	}

	particles[y][x] = particle;
}

function initItems() {
	var items = document.getElementsByClassName("item");
	for (var i = 0; i < items.length; i++) {
		items[i].addEventListener("mouseover", function () {
			var detail = this.getElementsByClassName("detail")[0];
			detail.style.opacity = 1;
		});
		items[i].addEventListener("mouseout", function () {
			var detail = this.getElementsByClassName("detail")[0];
			detail.style.opacity = 0;
		});
	}
}

function scrollAnimation() {
	var scroll = window.scrollY;
	var height = window.innerHeight;

	var pageHeight = (height / 2);
	page = Math.floor(scroll / pageHeight);
	var transition = (scroll % pageHeight) / pageHeight;
	var transition50up = Math.min((scroll % pageHeight) / pageHeight, 0.5) * 2;
	var transition50down = Math.max((scroll % pageHeight) / pageHeight - 0.5, 0) * 2;
	var pageChange = false;

	if (previousPage != page) {
		pageChange = true;
	}

	//console.log(page, transition);

	/* Default */
	document.getElementById("intro").style.opacity = 0;
	document.getElementById("projects-title").style.opacity = 0;
	document.getElementById("video").style.opacity = 0;
	document.getElementById("imgBG").style.opacity = 0;
	document.getElementById("skills-title").style.opacity = 0;
	document.getElementById("skills").style.opacity = 0;

	/* Hiding Intro */
	if (page == 0) {
		document.getElementById("intro").style.opacity = 1 - transition;
	}

	/* Showing Projects Title */
	if (page == 1) {
		document.getElementById("projects-title").style.opacity = transition50up;
		type(document.getElementById("projects-title"), transition * 100);

		document.getElementById("projects-title").style.transform = "translateY(" + (10 - transition * 10) + "vh)";
	}

	/* Hiding Projects Title */
	if (page == 2) {
		type(document.getElementById("projects-title"), 100);
		document.getElementById("projects-title").style.opacity = 1 - transition50down;

		document.getElementById("projects-title").style.transform = "translateY(" + (-transition * 15) + "vh)";
	}

	/* Showing Gest! */
	if (page == 3) {
		changeBackgroundVideo("videos/gest.mp4", 14.5, [3, 4]);
		document.getElementById("video").style.opacity = transition50up;
	}
	/* Hiding Gest! */
	if (page == 4) {
		changeBackgroundVideo("videos/gest.mp4", 14.5, [3, 4]);
		document.getElementById("video").style.opacity = 1 - transition50down;
	}


	/* Showing Brakey */
	if (page == 5) {
		changeBackgroundImage("images/brakey.png", [5, 6]);
		document.getElementById("imgBG").style.opacity = transition50up;
	}
	/* Hiding Brakey */
	if (page == 6) {
		changeBackgroundImage("images/brakey.png", [5, 6]);
		document.getElementById("imgBG").style.opacity = 1 - transition50down;
	}


	/* Showing Nemojump */
	if (page == 7) {
		changeBackgroundVideo("videos/nemojump.mp4", 38, [7, 8]);
		document.getElementById("video").style.opacity = transition50up;
	}
	/* Hiding Nemojump */
	if (page == 8) {
		changeBackgroundVideo("videos/nemojump.mp4", 38, [7, 8]);
		document.getElementById("video").style.opacity = 1 - transition50down;
	}


	/* Showing Nodongtime */
	if (page == 9) {
		changeBackgroundImage("images/nodong.png", [9, 10]);
		document.getElementById("imgBG").style.opacity = transition50up;
	}
	/* Hiding Nodongtime */
	if (page == 10) {
		changeBackgroundImage("images/nodong.png", [9, 10]);
		document.getElementById("imgBG").style.opacity = 1 - transition50down;
	}


	/* Showing Taglib */
	if (page == 11) {
		changeBackgroundImage("images/taglib.png", [11, 12]);
		document.getElementById("imgBG").style.opacity = transition50up;
	}
	/* Hiding Taglib */
	if (page == 12) {
		changeBackgroundImage("images/taglib.png", [11, 12]);
		document.getElementById("imgBG").style.opacity = 1 - transition50down;
	}


	/* Showing Liveboard */
	if (page == 13) {
		changeBackgroundImage("images/liveboard.png", [13, 14]);
		document.getElementById("imgBG").style.opacity = transition50up;
	}
	/* Hiding Liveboard */
	if (page == 14) {
		changeBackgroundImage("images/liveboard.png", [13, 14]);
		document.getElementById("imgBG").style.opacity = 1 - transition50down;
	}


	/* Showing Relayin' */
	if (page == 15) {
		changeBackgroundImage("images/relayin.png", [15, 16]);
		document.getElementById("imgBG").style.opacity = transition50up;
	}
	/* Hiding Relayin' */
	if (page == 16) {
		changeBackgroundImage("images/relayin.png", [15, 16]);
		document.getElementById("imgBG").style.opacity = 1 - transition50down;
	}


	/* Showing Skills Title */
	if (page == 17) {
		document.getElementById("skills-title").style.opacity = transition50up;
		type(document.getElementById("skills-title"), transition * 100);

		document.getElementById("skills-title").style.transform = "translateY(" + (10 - transition * 10) + "vh)";
	}

	/* Hiding Skills Title */
	if (page == 18) {
		type(document.getElementById("skills-title"), 100);
		document.getElementById("skills-title").style.opacity = 1 - transition50down;

		document.getElementById("skills-title").style.transform = "translateY(" + (-transition * 15) + "vh)";
	}

	/* Showing Skills */
	if (page == 19) {
		document.getElementById("skills").style.opacity = 1;

		if(spawnInterval != undefined)
			clearInterval(spawnInterval);

		var index = 0;
		spawnInterval = setInterval(() => {
			index++;
			spawnString(Math.floor(Math.random() * (canvas.width / particleSize)), 0, words[index % words.length]);
		}, 400);
	}


	/* Opacity Zero then Pause */
	if (document.getElementById("video").style.opacity == 0) {
		document.getElementById("video").pause();
	}

	previousPage = page;
}

function changeBackgroundVideo(src, time, pages) {
	if (pages.indexOf(page) != -1) {
		if (pages.indexOf(previousPage) == -1) {
			document.getElementById("video").src = src;
			document.getElementById("video").currentTime = time;

			document.getElementById("video").play();
		}
	}
}

function changeBackgroundImage(src, pages) {
	if (pages.indexOf(page) != -1) {
		if (pages.indexOf(previousPage) == -1) {
			document.getElementById("imgBG").style.backgroundImage = "url('" + src + "')";
		}
	}
}

function isOnScreen(element) {
	var rect = element.getBoundingClientRect();
	var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function type(element, progress) {
	var text = element.getAttribute("text").replace(/\n/g, "").replace(/\t/g, "");
	var index = Math.floor((text.length + 1) * progress / 100);
	element.innerHTML = text.substring(0, index) + "▋";
}

function initTypeWriter() {
	var elements = document.getElementsByClassName("typewriter");
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		var text = element.getAttribute("text").replace(/\n/g, "").replace(/\t/g, "").split("|");
		var originalText = element.innerHTML;

		if (text.length == 1) {
			((ele, text, originalText) => {
				waitUntilVisible(ele,
					() => {
						startTypeWriter(ele, text, 0);
						console.log(ele);
					}
					, () => {
						clearInterval(ele.interval);
						ele.innerHTML = originalText;
					}
				);
			})(element, text, originalText);
		}
		else {
			startTypeWriter(element, text, 0);
		}
	}
}

function waitUntilVisible(element, onShow, onHide) {
	if (isOnScreen(element)) {
		onShow();
		waitUntilHidden(element, function () {
			onHide();
			waitUntilVisible(element, onShow, onHide);
		});
	} else {
		setTimeout(() => {
			waitUntilVisible(element, onShow, onHide);
		}, 100);
		return;
	}
}

function waitUntilHidden(element, callback) {
	if (!isOnScreen(element)) {
		console.log("NOT ON SCREEN");
		callback();
	} else {
		setTimeout(() => {
			waitUntilHidden(element, callback);
		}, 100);
	}
}

function startTypeWriter(element, text, textIndex) {
	const originalText = element.innerHTML;
	var index = 0;

	element.innerHTML = originalText + "▋";

	element.interval = setInterval(() => {
		/* Typing */
		element.innerHTML = originalText + text[textIndex].substring(0, index) + "▋";
		index++;

		/* End of typing */
		if (index > text[textIndex].length) {
			clearInterval(element.interval);

			if (text.length != 1) {
				setTimeout(() => {
					/* Deleting */
					element.interval = setInterval(() => {
						element.innerHTML = originalText + text[textIndex].substring(0, index) + "▋";
						index--;

						if (index < 0) {
							clearInterval(element.interval);
							element.innerHTML = originalText;
							if (text.length != 1) {
								startTypeWriter(element, text, (textIndex + 1) % text.length);
							}
						}
					}, 60);
				}, 1000);
			}
			else {
				setTimeout(() => {
					element.innerHTML = originalText + text[textIndex];
				}, 300);
			}
		}
	}, 100);
}