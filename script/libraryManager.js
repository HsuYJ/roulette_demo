var LibraryManager = (function() {

	var Bol_IsWindowReady = false;

	window.addEventListener('load', function() {

		Bol_IsWindowReady = true;

		for (var i = 0, l = Col_Library.length; i < l; i++) {
			Fn_InstallLibrary(Col_Library.shift());
		}

		Col_Library = void 0;
	});

	var Str_FolderPath;
	var Col_Library = [];
	var Fn_InstallLibrary = function(PATH_TO_FILE) {

		var pathToFile = PATH_TO_FILE.indexOf('/') === -1 ? Str_FolderPath + PATH_TO_FILE : PATH_TO_FILE;
		var lib = document.createElement('script');

		lib.setAttribute('type', 'text/javascript');
		lib.setAttribute('src', pathToFile);

		document.head.appendChild(lib);
	};

	var Method = {

		setFolderPath: function(PATH_TO_FOLDER) {

			Str_FolderPath = PATH_TO_FOLDER;

			return this;
		},

		install: function(PATH_TO_FILE, INSTALL_AFTER_WINDOW_IS_READY) {

			if (INSTALL_AFTER_WINDOW_IS_READY && !Bol_IsWindowReady) {
				Col_Library.push(PATH_TO_FILE);
			} else {
				Fn_InstallLibrary(PATH_TO_FILE);
			}

			return this;
		}
	};

	return Method;
}());