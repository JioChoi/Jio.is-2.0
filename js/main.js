window.onload = function () {
	initTypeWriter();
	
	// Hide loading screen
	document.getElementById("loading").classList.add("hidden");
}

function initTypeWriter() {
	var elements = document.getElementsByClassName("typewriter");
	for (var i = 0; i < elements.length; i++) {
		var text = elements[i].getAttribute("text").replace(/\n/g, "").replace(/\t/g, "").split(",");
		typeWriter(elements[i], text, 0);
	}
}

function typeWriter(element, text, textIndex) {
	const originalText = element.innerHTML;
	var index = 0;

	element.innerHTML = originalText + "▋";

	const typeInterval = setInterval(() => {
		/* Typing */
		element.innerHTML = originalText + text[textIndex].substring(0, index) + "▋";
		index++;

		/* End of typing */
		if (index > text[textIndex].length) {
			clearInterval(typeInterval);

			if (text.length != 1) {
				setTimeout(() => {
					/* Deleting */
					const deleteInterval = setInterval(() => {
						element.innerHTML = originalText + text[textIndex].substring(0, index) + "▋";
						index--;

						if (index < 0) {
							clearInterval(deleteInterval);
							element.innerHTML = originalText;
							if (text.length != 1) {
								typeWriter(element, text, (textIndex + 1) % text.length);
							}
						}
					}, 60);
				}, 1000);
			}
		}
	}, 100);
}