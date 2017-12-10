var BindEvent = (function() {

	var Fn_Bind = function(TARGET, EVENT_TYPE, CALLBACK) {

		if (EVENT_TYPE === '') {

		}
	};

	var Method = {

		bind: function(TARGET, EVENT_TYPE, CALLBACK) {

			if (typeof EVENT_TYPE === 'object') { // an array
				for (var i = 0, l = EVENT_TYPE.length; i < l; i++) {
					TARGET.addEventListener(EVENT_TYPE[i], CALLBACK);
				}
			} else {
				TARGET.addEventListener(EVENT_TYPE, CALLBACK);
			}
		}
	};

	return function bindEvent(TARGET, EVENT_TYPE, CALLBACK) {

		if (typeof EVENT_TYPE === 'object') { // an array
			for (var i = 0, l = EVENT_TYPE.length; i < l; i++) {
				TARGET.addEventListener(EVENT_TYPE[i], CALLBACK);
			}
		} else {
			TARGET.addEventListener(EVENT_TYPE, CALLBACK);
		}
	};
}());

BindEvent(window, ['click', 'touch'], function() {


});