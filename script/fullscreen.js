// fullscreen.js

(function() {

	var documentMode = document.documentMode;
	var userAgent = window.navigator.userAgent;
	var Is_IEUnder11 = false;
	var Is_iOS = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);

	if (!Is_iOS) {
		Is_IEUnder11 = documentMode < 11;
	}

	if (Is_IEUnder11 || Is_iOS) { // IE9, 10 does not support requestFullscreen, iOS only fullscreens video
		// set zIndex to match your needs
		var zIndex = 100;
		// bind exitFullscreen() to window when requestFullscreen;
		// remove exitFullscreen() from window when exitFullscreen;
		var exitFullscreen = function(e) {

			if (e.keyCode === 27) { // Esc
				document.exitFullscreen();
			}
		};
		// install fullscreen things
		document.fullscreenElement = void 0;
		// exitFullscreen
		document.exitFullscreen = function() {

			var element = document.fullscreenElement;

			if (element) {
				// unbind exitFullscreen from window
				window.removeEventListener('keydown', exitFullscreen);
				// remove fullscreen class from element
				var classList = element.getAttribute('class').split(' ');

				classList.splice(classList.indexOf('fullscreenElement_IE910iOS'), 1);
				element.setAttribute('class', classList.join(' '));
				// reset values
				document.fullscreenElement = void 0;
				// fire exitFullscreen event
				document.dispatchEvent(new CustomEvent('fullscreenchange'));
			}
		};
		// requestFullscreen
		Element.prototype.requestFullscreen = function() {

			if (document.fullscreenElement) {
				return;
			}
			// add class fullscreen to element
			this.setAttribute('class', this.getAttribute('class') + ' fullscreenElement_IE910iOS');
			// set values
			document.fullscreenElement = this;
			// bind exitFullscreen() to window
			window.addEventListener('keydown', exitFullscreen);
			// fire fullscreen event
			document.dispatchEvent(new CustomEvent('fullscreenchange'));
		};

		var CSS = document.createElement('style');
		var CSSProperty = document.createTextNode(
			'.fullscreenElement_IE910iOS {\n' +
			'	position: absolute!important;\n' +
			'	left: 50%!important;\n' +
			'	top: 50%!important;\n' +
			'	width: 100%!important;\n' +
			'	height: 100%!important;\n' +
			'	-ms-transform: translateX(-50%) translateY(-50%)!important;\n' +
			'}\n'
		);

		CSS.setAttribute('type', 'text/css');
		CSS.appendChild(CSSProperty);
		document.head.appendChild(CSS);
	} else { // others
		var ElementPrototype = Element.prototype;

		if (!ElementPrototype.requestFullscreen) {
			ElementPrototype.requestFullscreen =
			ElementPrototype.webkitRequestFullscreen ||
			ElementPrototype.msRequestFullscreen ||
			ElementPrototype.mozRequestFullScreen;

			document.exitFullscreen =
			document.webkitExitFullscreen ||
			document.msExitFullscreen ||
			document.mozCancelFullScreen;

			document.fullscreenEnabled =
			document.webkitFullscreenEnabled ||
			document.msFullscreenEnabled ||
			document.mozFullScreenEnabled;


			Object.defineProperty(document, 'fullscreenElement', {

				get: function() {

					var element =
					document.webkitFullscreenElement ||
					document.msFullscreenElement ||
					document.mozFullScreenElement;

					return element;
				}
			});

			var fireFullscreenchange = function(e) {
				// e.target can not dispatchEvent at Chrome..2016-12-30
				document.dispatchEvent(new CustomEvent('fullscreenchange'));
			};

			if (document.onwebkitfullscreenchange !== void 0) {
				document.addEventListener('webkitfullscreenchange', fireFullscreenchange);
			} else if (document.onmsfullscreenchange !== void 0) {
				document.addEventListener('MSFullscreenChange', fireFullscreenchange);
			} else if (document.onmozfullscreenchange !== void 0) {
				document.addEventListener('mozfullscreenchange', fireFullscreenchange);
			}
		}
	}
})();

// (polyfill)defined CustomEvent()
// original source: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {
	// if CustomEvent() is natively supported, modify nothing
	if (typeof CustomEvent === 'function') { return; }

	function customEvent(event, params) {
		
		params = params || {bubbles: false, cancelable: false, detail: undefined};

		var evt = document.createEvent('CustomEvent');

		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);

		return evt;
	}

	customEvent.prototype = window.Event.prototype;
	window.CustomEvent = customEvent;
})();