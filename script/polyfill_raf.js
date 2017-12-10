/*
	Polyfill for requestAnimationFrame
	Rex Hsu, 2017
	rex.swijo@gmail.com

	Methods:
		window.requestAnimationFrame(CALLBACK), return: ID(Num)
		window.calcelAnimationFrame(ID)
*/
(function() {

	var vendors = ['ms', 'moz', 'webkit'];
	// redirect method with vender-head to no-head name
	for (var i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {
		window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i]+'CancelRequestAnimationFrame'];
	}
	// if the raf method is still empty, use setTimeout to define methods
	if (!window.requestAnimationFrame) {
		var FrameTime = 1000 / 60;
		var LastCall = 0;

		window.requestAnimationFrame = function(CALLBACK) {

			var current = Date.now();
			var elapsed = current - LastCall;
			var timeToCall = Math.max(0, FrameTime - elapsed); // execute all RAF at the same time

			LastCall = current + timeToCall;

			return setTimeout(CALLBACK, timeToCall);
		};
		window.cancelAnimationFrame = clearTimeout;
	}
}());