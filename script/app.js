(function() {

	var Num_Vh = innerHeight / 100;

	function Sprite_Circle(PROPS) {

		this.x = 0;
		this.y = 0;
		this.toX = 0.5;
		this.toY = 0.5;
		this.radius = 0;
		this.rotateZ = 0;
		this.deltas = {};

		for (var i in PROPS) {
			this[i] = PROPS[i];
		}

		var radius = this.radius = this.radius >> 0;
		var diameter = radius * 2;

		this.image = ImgToCanvas(PROPS.image, diameter, diameter);
	}

	Sprite_Circle.prototype = {
		constructor: Sprite_Circle,

		updateProp: function(P) {

			var deltas = this.deltas;

			for (var i in deltas) {
				var delta = deltas[i];
				var deltaValue = delta.value;

				if (deltaValue) {
					var curValue = this[i] += deltaValue * P;
					var tarValue = delta.target;

					if (tarValue !== void 0 && (deltaValue > 0 ? curValue > tarValue : curValue < tarValue)) { // end of transform
						this[i] = tarValue;
						delta.value = void 0;
					} else {
						var fade = delta.fade;

						if (fade) {
							var curDeltaValue = delta.value += fade * P;

							if (fade > 0 ? curDeltaValue > 0 : curDeltaValue < 0) { // end of delta
								delta.value = void 0;
							}
						}
					}
				}
			}
		},

		update: function() {

			
		},

		render: function(C) {

			var diameter = this.radius * 2;
			var toX = this.toX * diameter;
			var toY = this.toY * diameter;
			var rotateZ = this.rotateZ;
			var rad, sin, cos;

			if (rotateZ) {
				rad = rotateZ * Math.PI / 180;
				sin = Math.sin(rad);
				cos = Math.cos(rad);
			} else {
				sin = 0;
				cos = 1;
			}

			C.setTransform(cos, sin, -sin, cos, this.x + toX, this.y + toY);

			var image = this.image;

			C.drawImage(image, -toX, -toY);

			if (this.render2) {
				this.render2(C);
			}
		},

		setTransformTo: function(NAME, TARGET_VALUE, DURATION) {

			var delta = this.deltas[NAME];

			if (!delta) {
				delta = this.deltas[NAME] = {
					value: void 0,
					target: void 0,
					fade: 0
				};
			}

			var curValue = this[NAME];
			var frames = DURATION / (1000 / 60) >> 0;

			delta.value = (TARGET_VALUE - curValue) / frames;
			delta.target = TARGET_VALUE;
			delta.fade = 0;

			return this;
		},

		setDelta: function(NAME, VALUE, FADE_VALUE) {

			var delta = this.deltas[NAME];

			if (!delta) {
				delta = this.deltas[NAME] = {
					value: void 0,
					target: void 0,
					fade: 0
				};
			}

			delta.value = VALUE;
			delta.target = void 0;

			if (FADE_VALUE) {
				delta.fade = FADE_VALUE;
			}

			return this;
		},

		getCX: function() {

			return this.x + this.radius;
		},

		getCY: function() {

			return this.y + this.radius;
		}
	};


	WIR.addReadyToRun(function() {

		ImgLoader
		.setFolderPath('./image/')
		.load('pan.svg', null, 'pan')
		//.load('wheel.svg', null, 'wheel')
		.load('wheel.png', null, 'wheel')
		//.load('ball.svg', null, 'ball')
		.load('ball.png', null, 'ball')
		.load('handle.svg', null, 'handle')
		.addAllReadyToDo(function(IMGS) {

			var Num_vh = innerHeight / 100;

			Stage.init(Num_vh * 30 * 2, Num_vh * 30 * 2, document.body);

			var Num_panRadius = Num_vh * 30;
			var Num_wheelRadius = Num_panRadius / 8 * 5;
			var Num_ballRadius = Num_panRadius / 8 * 0.2;
			var Num_handleRadius = Num_panRadius / 8 * 1.5;
			var Num_innerWheelRadius = Num_panRadius / 8 * 3;
			var Num_runerWheelRadius = Num_panRadius / 8 * 6.4;
			var Num_outerWheelRadius = Num_panRadius / 8 * 6.7;
			var Spr_pan = new Sprite_Circle({
				x: (Stage.width - Num_panRadius * 2) / 2,
				y: (Stage.height - Num_panRadius * 2) / 2,
				radius: Num_panRadius,
				image: IMGS.pan
			});
			var Spr_wheel = new Sprite_Circle({
				x: (Stage.width - Num_wheelRadius * 2) / 2,
				y: (Stage.height - Num_wheelRadius * 2) / 2,
				radius: Num_wheelRadius,
				image: IMGS.wheel,

				update: function() {

					Spr_handle.rotateZ = this.rotateZ;
				}
			});
			var Spr_ball = new Sprite_Circle({
				x: Spr_pan.x + Spr_pan.radius * Math.random(),
				y: Spr_pan.y + Spr_pan.radius * Math.random(),
				radius: Num_ballRadius,
				image: IMGS.ball,

				path: [],
				gravityDir: [0, 0],

				force: 0,
				moveRadian: 0,

				update: function(P) {

					var force = this.force;

					if (force) {
						var rad = this.moveRadian;
						var dX = Math.cos(rad) * force * P;
						var dY = Math.sin(rad) * force * P;

						this.x += dX;
						this.y += dY;
					}

					this.forceToCenter(P);
					this.checkCollision(P);
					this.checkOnWheel(P);
					//this.updateMoveRadian();
					this.path.squash([this.getCX(), this.getCY()], 300);
				},

				forceToCenter: function(P) {

					var ballCX = Spr_ball.getCX();
					var ballCY = Spr_ball.getCY();
					var panCX = Spr_pan.getCX();
					var panCY = Spr_pan.getCY();
					var gapX = panCX - ballCX;
					var gapY = panCY - ballCY;
					var gap = Math.sqrt(gapX * gapX, gapY * gapY);
					var radToCenter = Math.atan2(panCY - ballCY, panCX - ballCX);
					var gravity;

					// runerWheel
					if (gap > Num_runerWheelRadius) {
						gravity = Num_Vh * 0.05 * P;
					} else {
						gravity = Num_Vh * 0.5 * P;
					}

					this.x += Math.cos(radToCenter) * gravity;
					this.y += Math.sin(radToCenter) * gravity;
					this.moveRadian = RADjs.turn(Math.atan2(panCY - Spr_ball.getCY(), panCX - Spr_ball.getCX()), -135);

					//var moveRad = RADjs.turn(Math.atan2(panCY - Spr_ball.getCY(), panCX - Spr_ball.getCX()), -90);

					/*var force = this.force;

					if (force) {
						this.moveRadian += Math.atan2(gravity, force * P) * P;
					}*/

					this.gravityDir[0] = this.x + Math.cos(radToCenter) * 300;
					this.gravityDir[1] = this.y + Math.sin(radToCenter) * 300;
				},

				checkCollision: function(P) {

					var ballCX = Spr_ball.getCX();
					var ballCY = Spr_ball.getCY();
					var ballRadius = this.radius;
					var panCX = Spr_pan.getCX();
					var panCY = Spr_pan.getCY();
					var gapX = panCX - ballCX;
					var gapY = panCY - ballCY;
					var gap = Math.sqrt(gapX * gapX + gapY * gapY);
					var colRad = Math.atan2(gapY, gapX);
					var overlay;
					// innerWheel
					overlay = ballRadius + Num_innerWheelRadius - gap;

					if (overlay > 0) { // innerWheel collided
						this.x -= Math.cos(colRad) * overlay;
						this.y -= Math.sin(colRad) * overlay;
					} else {
						// outerWheel
						overlay = gap - Num_outerWheelRadius;

						if (overlay > 0) { // outerWheel collided
							this.x += Math.cos(colRad) * overlay;
							this.y += Math.sin(colRad) * overlay;

							var moveRad = RADjs.turn(Math.atan2(panCY - this.getCY(), panCX - this.getCX()), -135);

							this.moveRadian = moveRad;
						}
					}
				},

				checkOnWheel: function(P) {

					var ballCX = Spr_ball.getCX();
					var ballCY = Spr_ball.getCY();
					var wheelCX = Spr_wheel.getCX();
					var wheelCY = Spr_wheel.getCY();
					var gapX = wheelCX - ballCX;
					var gapY = wheelCY - ballCY;
					var gap = Math.sqrt(gapX * gapX + gapY * gapY);

					if (gap < Spr_wheel.radius) {
						var deltaRotateZ = Spr_wheel.deltas.rotateZ.value * P;

						if (this.force > 0) {
							var dForce = gap * 2 * Math.PI * deltaRotateZ / 360 / Math.max(1, Num_vh * 2.5 / this.force); // diameter * PI

							this.force += dForce;
						} else {
							var point = RADjs.turnPointByRadian(ballCX, ballCY, -deltaRotateZ * Math.PI / 180, wheelCX, wheelCY);

							this.force = 0;
							this.x = point[0] - this.radius;
							this.y = point[1] - this.radius;


							var radToCenter = Math.atan2(gapY, gapX);
							var surRad = RADjs.turn180(radToCenter);
						}
					}
				},

				getRadianToCenter: function() {

					var ballCX = Spr_ball.getCX();
					var ballCY = Spr_ball.getCY();
					var panCX = Spr_pan.getCX();
					var panCY = Spr_pan.getCY();
					var gapX = panCX - ballCX;
					var gapY = panCY - ballCY;
					var rad = Math.atan2(gapY, gapX);

					return rad;
				},

				render2: function(C) {

					/*var path = this.path;
					var pointNum = path.length;

					if (pointNum) {
						C.setTransform(1, 0, 0, 1, 0, 0);

						var point = path[0];

						C.beginPath();
						C.moveTo(point[0], point[1]);

						for (var i = 1, l = path.length; i < l; i++) {
							point = path[i];
							C.lineTo(point[0], point[1]);
						}

						C.strokeStyle = 'lime';
						C.stroke();
					}

					var cX = this.getCX();
					var cY = this.getCY();
					var gravityDir = this.gravityDir;

					C.beginPath();
					C.moveTo(cX, cY);
					C.lineTo(gravityDir[0], gravityDir[1]);
					C.strokeStyle = 'red';
					C.stroke();

					var moveRad = this.moveRadian;

					C.beginPath();
					C.moveTo(cX, cY);
					C.lineTo(cX + Math.cos(moveRad) * this.force * 50, cY + Math.sin(moveRad) * this.force * 50);
					C.strokeStyle = 'red';
					C.stroke();*/
				}
			});
			var Spr_handle = new Sprite_Circle({
				x: (Stage.width - Num_handleRadius * 2) / 2,
				y: (Stage.height - Num_handleRadius * 2) / 2,
				radius: Num_handleRadius,
				image: IMGS.handle
			});

			Stage
			.append(Spr_pan)
			.append(Spr_wheel)
			.append(Spr_ball)
			.append(Spr_handle)
			.append({ // number checker

				list: ['0', '28', '9', '26', '30', '11', '7', '20', '32', '17', '5', '22', '34', '15', '3', '24', '36', '13', '1', '00', '27', '10', '25', '29', '12', '8', '19', '31', '18', '6', '21', '33', '16', '4', '23', '35', '14', '2'],

				text: '',

				updateProp: function() {


				},

				update: function() {

					var list = this.list;
					var radPerSection = Math.PI * 2 / 38;
					var wheelRad = RADjs.trim(Spr_wheel.rotateZ * Math.PI / 180);

					wheelRad = RADjs.convertTo360System(wheelRad);

					var radToCenter_ball = Spr_ball.getRadianToCenter();
					var radFromCenter_ball = RADjs.turn180(radToCenter_ball);
					var radGap = 0;

					if (radFromCenter_ball > -RADjs.rad90 && radFromCenter_ball < 0) {
						radGap = Math.PI / 2 + radFromCenter_ball;
					} else {
						radGap = radFromCenter_ball + Math.PI / 2;
					}

					var ballNumberIndex = Math.floor(RADjs.convertTo360System(RADjs.trim(Math.PI * 2 - wheelRad + radGap)) / radPerSection);
					var text = 'ball at: ' + list[ballNumberIndex] + '(index: ' + ballNumberIndex + ')';

					this.text = text;
				},

				render: function(C) {

					var text = this.text;

					C.setTransform(1, 0, 0, 1, 0, 0);
					C.fillStyle = 'black';
					C.fillText(text, Num_vh, Stage.height - Num_vh * 2);
				}
			})
			/*.append({
				updateProp: function() {

				},
				update: function() {

				},
				render: function(C) {

					C.setTransform(1, 0, 0, 1, Spr_pan.getCX(), Spr_pan.getCY());
					
					C.fillStyle = 'rgba(0, 255, 0, 0.5)';
					C.beginPath();
					C.arc(0, 0, Num_outerWheelRadius, 0, Math.PI * 2);
					C.fill();
					
					C.fillStyle = 'rgba(255, 0, 0, 0.5)';
					C.beginPath();
					C.arc(0, 0, Num_innerWheelRadius, 0, Math.PI * 2);
					C.fill();
				}
			})*/;

			Spr_wheel.setDelta('rotateZ', -1);

			var Num_progressSpeed = 1;
			var Num_previousProgressSpeed = 1;

			window.addEventListener('keydown', function(e) {

				var key = e.key;

				if (key === 'ArrowUp') {
					Num_previousProgressSpeed = Num_progressSpeed;
					Stage.setProgressSpeed(Num_progressSpeed += 0.2);
				} else if (key === 'ArrowDown') {
					Num_previousProgressSpeed = Num_progressSpeed;
					Stage.setProgressSpeed(Num_progressSpeed -= 0.2);
				} else if (key === 'Escape') {
					if (Num_progressSpeed) {
						Num_previousProgressSpeed = Num_progressSpeed;
						Stage.setProgressSpeed(Num_progressSpeed = 0);
					} else {
						Stage.setProgressSpeed(Num_progressSpeed = Num_previousProgressSpeed);
					}
				}
			});

			//Stage.getEntity().addEventListener('click', function() {
			window.addEventListener('click', function() {
			//Stage.getEntity().addEventListener('touchend', function() {

				//Spr_ball.x = Spr_pan.getCX() + Num_innerWheelRadius + (Num_outerWheelRadius - Num_innerWheelRadius) - Num_ballRadius;
				//Spr_ball.y = Spr_pan.getCY() - Num_ballRadius;

				//var ballCX = Spr_ball.getCX();
				//var ballCY = Spr_ball.getCY();
				//var panCX = Spr_pan.getCX();
				//var panCY = Spr_pan.getCY();
				//var radToCenter = Math.atan2(panCY - ballCY, panCX - ballCX);
				//var moveRad = RADjs.turn(radToCenter, -90);

				Spr_ball.force = Num_vh * 3;
				Spr_ball.setTransformTo('force', 0, Spr_ball.force / (Spr_ball.force / 1200) * (1000 / 60));
				//Spr_ball.moveRadian = moveRad;
			});
		});
	});
}());