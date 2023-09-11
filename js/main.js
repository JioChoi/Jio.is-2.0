window.onload = function () {
	initTypeWriter();
	initItems();
	
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

	var pageHeight = (height * 4);
	var page = Math.floor(scroll / pageHeight);
	var transition = (scroll % pageHeight) / pageHeight;

	var transitionEase = Math.pow(transition, 2);

	// Intro
	if (page == 0) {
		document.getElementById("intro").style.opacity = 1 - transition;
		document.getElementById("intro").style.transform = "translateY(" + (transition * -10) + "vh)";
	}
	else {
		document.getElementById("intro").style.opacity = 0;
		document.getElementById("intro").style.transform = "translateY(-10vh)";
	}

	// Type Projects
	if (page == 1) {
		document.getElementById("projects").style.opacity = transition * 4;
		type(document.getElementById("projects"), transition * 150);
	}
	else {
		document.getElementById("projects").style.opacity = 0;
	}

	// Projects
	if (page == 2) {
		document.getElementById("projects").style.opacity = 1;
		type(document.getElementById("projects"), 100);

		document.getElementById("info").style.filter = "blur(" + Math.max((5 - (transition * 3) * 5), 0) + "px)";
		document.getElementById("info").style.opacity = transition * 3;
		document.getElementById("info").style.transform = "scale(" + (1 + Math.max(1 - (transition * 3) * 1, 0)) + ")";
	}
	else {
		document.getElementById("info").style.opacity = 0;
	}

	// Hide Projects
	if (page == 3) {
		document.getElementById("info").style.filter = "blur(" + (5 - Math.max((5 - (transition * 3) * 5), 0)) + "px)";
		document.getElementById("info").style.opacity = 1 - transition * 3;
		document.getElementById("info").style.transform = "scale(" + (1 + (Math.min((transition * 3), 1)) * 1) + ")";
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