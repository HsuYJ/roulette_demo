var ImgToCanvas = (function() {

	return function (IMG, WIDTH, HEIGHT) {
	
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var imgWidth = IMG.width;
		var imgHeight = IMG.height;
		var drawWidth = WIDTH || imgWidth;
		var drawHeight = HEIGHT || imgHeight;

		canvas.width = drawWidth;
		canvas.height = drawHeight;
		ctx.drawImage(IMG,
			0, 0, imgWidth, imgHeight,
			0, 0, drawWidth, drawHeight
		);

		return canvas;
	};
}());