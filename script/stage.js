var Stage = (function() {

	var Dom_Canvas = (function() {

		var canvas = document.createElement('canvas');

		canvas.style.cssText =
			'will-change: -webkit-transform;' +
			'-webkit-transform: translate3d(0, 0, 0);';

		return canvas; }());
	var Mtd_Ctx = Dom_Canvas.getContext('2d');
	var Val_ProgressSpeed = 1;
	var Col_Sprite = [];
	var Tim_LastUpdate = 0;
	var Tok_OnUpdate;
	var Tok_OnRender;
	var Col_ProgressTime = (function() {

		var arr = [];

		for (var i = 0; i < 60 * 5; i++) {
			arr.push(1000 / 60 * 4);
		}

		return arr; }());
	
	var Fn_Updater = function() {

		requestAnimationFrame(Fn_Updater);

		Fn_Update();
		Fn_Render();
	};

	var Fn_Update = function() {

		var now = performance.now();
		var elapsed = now - Tim_LastUpdate;
		var progress = elapsed / (1000 / 60) * Val_ProgressSpeed;

		Tim_LastUpdate = now;
		Col_ProgressTime.squash(elapsed);

		var spriteNum = Col_Sprite.length;
		var i;

		for (i = 0; i < spriteNum; i++) {
			Col_Sprite[i].updateProp(progress);
		}

		for (i = 0; i < spriteNum; i++) {
			Col_Sprite[i].update(progress);
		}
	};
	var Num_FPS = 60;
	var Num_leftTimeToRender = 1000 / Num_FPS;
	var Tim_lastRender = 0;
	var Fn_Render = function() {

		// register next render
		Tok_OnRender = requestAnimationFrame(Fn_Render);
		
		var now = performance.now();
		var elapsed = now - Tim_lastRender;

		if (Num_leftTimeToRender - elapsed > 0) {
			return;
		}

		Num_leftTimeToRender += -elapsed + 1000 / Num_FPS;
		Tim_lastRender = now;

		// rest ctx and clear canvas
		Mtd_Ctx.setTransform(1, 0, 0, 1, 0, 0);
		Mtd_Ctx.globalAlpha = 1;
		Mtd_Ctx.clearRect(0, 0, Dom_Canvas.width, Dom_Canvas.height);

		// render sprite
		for (var i = 0, l = Col_Sprite.length; i < l; i++) {
			Col_Sprite[i].render(Mtd_Ctx);
		}

		Fn_DrawFPS();
	};
	var Fn_DrawFPS = (function() {

		var vh = innerHeight / 100;
		var cst_FPSStringRefreshTime = 1000;
		var val_FPSStringRefreshCount = 0;
		var val_lastTime = 0;
		var val_frameTime = 0;
		var cst_filter = 10;
		var val_FPS = 0;
		var cst_maxFPS = 144;
		var cst_showNumber = 60 * 5;
		var arr_fps = (function() {

			var arr = [];

			for (var i = 0; i < cst_showNumber; i++) {
				arr.push(1);
			}

			return arr; }());
		var cst_fontRatio = 2;
		var cst_fontSize = cst_fontRatio * vh;
		var cst_paddingRatio = 0.5;
		var cst_padding = cst_paddingRatio * vh;
		var cst_chartHeightRatio = 10;
		var cst_chartHeight = cst_chartHeightRatio * vh;
		var cst_panelWidth = (cst_fontRatio * 10 + cst_paddingRatio * 2) * vh;
		var cst_panelHeight = (cst_fontRatio + cst_paddingRatio * 2 + cst_chartHeightRatio) * vh;
		var cst_chartY = cst_panelHeight - cst_chartHeight;
		var cst_fpsTextWidth;
		var img_panel = (function() {

			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');

			canvas.width = cst_panelWidth;
			canvas.height = cst_panelHeight;
			ctx.globalAlpha = 0.25;
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, cst_panelWidth, cst_panelHeight);

			ctx.globalAlpha = 0.5;
			ctx.fillStyle =
			ctx.strokeStyle = 'yellow';
			ctx.font = cst_fontSize + 'px monospace';
			
			// text 'FPS'
			ctx.textAlign = 'start';
			ctx.textBaseline = 'hanging';
			ctx.fillText('FPS ', cst_padding, cst_padding);
			cst_fpsTextWidth = ctx.measureText('FPS ').width;

			// line chart
			var fpsYMax = cst_chartY;
			var fpsY60 = (1 - 60 / cst_maxFPS) * cst_chartHeight + cst_chartY;

			ctx.textAlign = 'end';
			ctx.textBaseline = 'middle';
			ctx.fillText(cst_maxFPS, cst_panelWidth - cst_padding, fpsYMax);
			ctx.fillText('60', cst_panelWidth - cst_padding, fpsY60);
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0, fpsYMax);
			ctx.lineTo(cst_panelWidth - cst_padding * 2 - ctx.measureText(cst_maxFPS).width, fpsYMax);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(0, fpsY60);
			ctx.lineTo(cst_panelWidth - cst_padding * 2 - ctx.measureText('60').width, fpsY60);
			ctx.stroke();

			return canvas;
		})();

		function Fn_DrawFPS(CANVAS, DRAWN_NUMBER) {

			// count fps
			var frameTime = Col_ProgressTime.getLast(1);

			val_frameTime += (frameTime - val_frameTime) / cst_filter;

			var fpsNow = Math.round(1000 / val_frameTime * 10) / 10;

			arr_fps.squash(fpsNow);

			var now = performance.now();

			val_FPSStringRefreshCount += now - val_lastTime;
			val_lastTime = now;
			// refresh fps string
			if (val_FPSStringRefreshCount > cst_FPSStringRefreshTime) {
				val_FPS = fpsNow;

				if (val_FPS % 1 === 0) {
					val_FPS = val_FPS.toString() + '.0';
				}

				val_FPSStringRefreshCount = 0;
			}

			var ctx = Mtd_Ctx;

			// restore ctx
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.globalAlpha = 1;

			// panel background
			ctx.drawImage(img_panel, 0, 0);

			ctx.globalAlpha = 0.75;
			ctx.strokeStyle =
			ctx.fillStyle = 'lime';

			// text fps
			ctx.font = cst_fontSize + 'px monospace';
			ctx.textAlign = 'start';
			ctx.textBaseline = 'hanging';
			ctx.fillText(val_FPS, cst_padding + cst_fpsTextWidth, cst_padding);

			// fps line chart
			ctx.lineWidth = 1;
			ctx.beginPath();

			for (var i = 0; i < cst_showNumber; i++) {
				var fps = arr_fps[i];
				var x = i / cst_showNumber * cst_panelWidth;
				var y = Math.max(cst_chartY, (1 - fps / cst_maxFPS) * cst_chartHeight + cst_chartY);

				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}

			ctx.stroke();
		}

		return Fn_DrawFPS;
	})();

	var Method = {

		width: 0,
		height: 0,

		init: function(W, H, MOUNT_TARGET) {

			Dom_Canvas.width = W;
			Dom_Canvas.height = H;

			this.width = W;
			this.height = H;

			// launch
			Tim_LastUpdate = performance.now();
			Tok_OnUpdate = setInterval(Fn_Update, 0);
			Tim_lastRender = performance.now();
			Tok_OnRender = requestAnimationFrame(Fn_Render);
			//requestAnimationFrame(Fn_Updater);

			// mount
			MOUNT_TARGET.appendChild(Dom_Canvas);

			return this;
		},

		setProgressSpeed: function(SPEED) {
			console.log('Stage progress speed is set to ' + Math.round(SPEED * 100) + '%');
			Val_ProgressSpeed = SPEED;

			return this;
		},

		append: function(SPRITE) {

			Col_Sprite.add(SPRITE);

			return this;
		},

		getEntity: function() {

			return Dom_Canvas;
		}
	};

	return Method;
}());