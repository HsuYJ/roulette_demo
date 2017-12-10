/*
	Polyfill for performance.now
	Rex Hsu, 2017
	rex.swijo@gmail.com

	Methods:
		window.performance.now(), return: Time(Num)
*/
(function() {

	var offset = Date.now();
	
	if (!window.performance) {
		window.performance = {
			now: function now() {

				return Date.now() - offset;
			}
		};
	} else if (!window.performance.now) {
		window.performance.now = function now() {

			return Date.now() - offset;
		};
	}
}());