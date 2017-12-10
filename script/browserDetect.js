var BrowserDetect = (function() {

	var Str_UserAgent = window.navigator.userAgent;
	var Str_DocumentMode = document.documentMode; // IE family

	var Method = {

		isiOS: Str_UserAgent.indexOf('iPad') !== -1 || Str_UserAgent.indexOf('iPhone') !== -1,

		isEdge: Str_UserAgent.indexOf('Edge') !== -1,

		isIE: !!Str_DocumentMode,

		IE: {
			version: Str_DocumentMode,

			is11: Str_DocumentMode === 11,

			is10: Str_DocumentMode === 10,

			is9: Str_DocumentMode === 9,

			is8: Str_DocumentMode === 8
		}
	};

	return Method;
}());