var WINDOW_IS_READY = false;
var WIR = (function() {

	var Arr_Fn = [];

	window.addEventListener('load', function() {

		WINDOW_IS_READY = true;

		for (var i = 0, l = Arr_Fn.length; i < l; i++) {
			Arr_Fn[i]();
		}
	});

	return {

		addReadyToRun: function(FN) {

			if (WINDOW_IS_READY) {
				FN();
			} else {
				Arr_Fn.push(FN);
			}

			return this;
		}
	};
}());