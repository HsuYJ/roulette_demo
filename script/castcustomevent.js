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


var castCustomEvent = function(el, name, details) { // details: Object
	//console.log(el, 'Cast custom event:', name);
	var customEvent = new CustomEvent(name, details);

	el.dispatchEvent(customEvent);
};