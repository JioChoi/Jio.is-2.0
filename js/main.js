var previousPage = 0;
var page = 0;

const skills = [
	{type: "plang", word: "C++", size: 1},
	{type: "lang", word: "English", size: 1},
	{ type: "prog", word: "Photoshop", size: 1 },
	
	
	{type: "plang", word: "JAVA", size: 2},
	{type: "plang", word: "SDL2", size: 2},
	{type: "plang", word: "C", size: 2},
	{type: "plang", word: "HTML", size: 2},
	{type: "plang", word: "CSS", size: 2},
	{type: "plang", word: "JAVASCRIPT", size: 2},
	{type: "plang", word: "Node.js", size: 2},
	{type: "plang", word: "GDI+", size: 2},
	{type: "plang", word: "Windows API", size: 2},
	{type: "plang", word: "MFC", size: 2},
	{type: "plang", word: "MATLAB", size: 2},
	{type: "lang", word: "Japanese", size: 2},
	{type: "lang", word: "Chinese", size: 2},
	{type: "lang", word: "Korean", size: 2},
	
	{type: "plang", word: "IIS", size: 3},
	{type: "plang", word: "Apache 2", size: 3},
	{type: "plang", word: "MySQL", size: 3},
	{type: "plang", word: "PHP", size: 3},
	{type: "plang", word: "OpenGL", size: 3},
	{type: "plang", word: "GLSL", size: 3},
	{type: "plang", word: "Arduino", size: 3},
	
	{ type: "prog", word: "After Effects", size: 3 },
	{ type: "prog", word: "Premiere Pro", size: 3 },
	{ type: "prog", word: "Adobe XD", size: 3 },
	{ type: "prog", word: "Ableton Live", size: 3 },
	{ type: "prog", word: "FL Studio", size: 3 },
];

const word_offset_same = {x: 10, y: 10};
const word_offset = {x: 10, y: 10};

window.onload = function () {
	initTypeWriter();
	initItems();

	createOrbit();

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
}

function getDistance(point1, point2) {
	return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

function createOrbit() {
	var box = document.getElementById("wordbox");
	var boxRect = box.getBoundingClientRect();

	var center = { x: boxRect.width / 2, y: boxRect.height / 2 };
	var placedWords = [];

	for (var i = 0; i < skills.length; i++) {
		var fontsize = 0;
		switch (skills[i].size) {
			case 1:
				fontsize = 60;
				break;
			case 2:
				fontsize = 40;
				break;
			case 3:
				fontsize = 20;
				break;
		}

		var x, y, distance = 0;
		var rect;
		var count = 0;

		do {
			count++;

			if (count > 1000) {
				console.log("Failed to place word");
				return;
			}

			x = Math.random() * boxRect.width;
			y = Math.random() * boxRect.height;
	
			var distance = getDistance(center, { x: x, y: y });
			rect = getRect(skills[i].word, x, y, fontsize);
			offset(rect, 10, 10);
		} while (distance > 300 || overlap(rect, placedWords, skills[i].type));
		
		placedWords.push({ rect: rect, type: skills[i].type });
		placeWord(skills[i].word, x, y, fontsize);
	}
}

var tr = 0;
function initWordbox() {
	tr++;
	if(tr > 10) {
		console.log("Failed to init wordbox");
		return;
	}
	
	var wordbox = document.getElementById("wordbox");
	wordbox.innerHTML = "";
	
	var wordboxRect = wordbox.getBoundingClientRect();
	var wordboxWidth = wordboxRect.width;
	var wordboxHeight = wordboxRect.height;

	var placedWords = [];

	var success = true;

	skills.forEach(skill => {
		var x;
		var y;

		var size;

		switch(skill.size) {
			case 1:
				size = 100;
				break;
			case 2:
				size = 40;
				break;
			case 3:
				size = 20;
				break;
		}

		var rect = getRect(skill.word, 0, 0, size);

		var count = 0;

		do {
			if (count++ > 1000) {
				wordbox.innerHTML = "";
				console.log("Failed to place word, retry");
				success = false;
				return false;
			}
			x = Math.random() * (wordboxWidth - rect.width);
			y = Math.random() * (wordboxHeight - rect.height);

			rect = getRect(skill.word, x, y, size);
		} while (overlap(rect, placedWords, skill.type));

		placedWords.push({rect: rect, type: skill.type});
		placeWord(skill.word, x, y, size);
	});

	if(!success)
		initWordbox();
}

function overlap(rect, rects, type) {
	for (var i = 0; i < rects.length; i++) {
		var other = rects[i].rect;
		
		if (rects[i].type == type) {
			other = offset(other, word_offset_same.x, word_offset_same.y);
		}
		else {
			other = offset(other, word_offset.x, word_offset.y);
		}

		if (rect.x < other.x + other.width &&
			rect.x + rect.width > other.x &&
			rect.y < other.y + other.height &&
			rect.y + rect.height > other.y) {
			return true;
		}
	}
	return false;
}

function offset(rect, x, y) {
	return {x: rect.x - x, y: rect.y - y, width: rect.width + x*2, height: rect.height + y*2};
}

function getRect(word, x, y, size) {
	var wordElement = document.createElement("h3");
	wordElement.innerHTML = word;
	wordElement.style.fontSize = size + "px";
	wordElement.style.position = "absolute";
	wordElement.style.top = "-1000px";
	wordElement.style.left = "-1000px";
	document.body.appendChild(wordElement);
	var rect = wordElement.getBoundingClientRect();
	document.body.removeChild(wordElement);
	return {x: x, y: y, width: rect.width, height: rect.height};
}

function placeWord(word, x, y, size) {
	var wordbox = document.getElementById("wordbox");
	var wordElement = document.createElement("h3");
	wordElement.innerHTML = word;
	wordElement.style.fontSize = size + "px";
	wordElement.style.top = y + "px";
	wordElement.style.left = x + "px";
	wordbox.appendChild(wordElement);
	var rect = wordElement.getBoundingClientRect();
	return {x: x, y: y, width: rect.width, height: rect.height};
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

	console.log(page, transition);

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
		document.getElementById("skills").style.opacity = transition50up;
		document.getElementById("skills").style.position = "relative";
	}
	
	if(page == 20) {
		document.getElementById("skills").style.position = "fixed";
		document.getElementById("skills").style.top = "0px";
		document.getElementById("skills").style.left = "0px";
		document.getElementById("skills").style.opacity = 1;
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