var RADjs = {

	rad45 : Math.PI * 0.25,
	rad90 : Math.PI * 0.50,
	rad135: Math.PI * 0.75,
	rad180: Math.PI,

	reverseX: function(RAD) {

		return Math.sign(RAD) * Math.PI - RAD;
	},

	reverseY: function(RAD) {

		return -RAD;
	},

	turn180: function(RAD) {

		RAD += Math.PI;

		if (RAD > Math.PI) {
			RAD = -Math.PI + (RAD - Math.PI);
		}

		return RAD;
	},

	rebound: function(IMPACT_RAD, SURFACE_RAD) {

		var rad = IMPACT_RAD;

		if (SURFACE_RAD === 0 || SURFACE_RAD === Math.PI) { // horizontal
			rad = Math.sign(rad) * Math.PI - rad; // reverse x
		} else if (SURFACE_RAD === Math.PI * 0.5 || SURFACE_RAD === Math.PI * -0.5) { // vertical
			rad *= -1; // reverse y
		} else { // surface has angle
			var deg = rad / Math.PI * 180;
			var surDeg = SURFACE_RAD / Math.PI * 180;
			var surDeg_abs = Math.abs(surDeg);
			var surDeg_fix, surRot;

			if (surDeg_abs < 45 || surDeg_abs > 135) { // horizontal
				surDeg_fix = surDeg_abs < 90 ? 0 : 180;
				surRot = surDeg_fix + surDeg;
				deg = Math.sign(deg) * 180 - deg; // reverse x
			} else { // vertical
				surDeg_fix = surDeg > 0 ? 90 : -90;
				surRot = surDeg - surDeg_fix;
				deg *= -1; // reverse y
			}

			rad = (deg + surRot * 2) * Math.PI / 180;
		}

		return rad;
	},

	trim: function(RAD) {

		RAD %= (Math.PI * 2);

		if (RAD < 0) {
			RAD += Math.PI * 2;
		}

		if (RAD > Math.PI) {
			RAD = -Math.PI + (RAD - Math.PI);
		}

		return RAD;
	},

	turn: function(RAD, DEGREE) {

		return RAD + DEGREE * Math.PI / 180;
	},

	convertTo360System: function(RAD) {

		if (RAD < 0) {
			RAD += Math.PI * 2;
		}

		return RAD;
	},

	turnPointByRadian: function(PX, PY, RADIAN, OX, OY) {

		var gapX = PX - OX;
		var gapY = PY - OY;
		var hypLen = Math.sqrt(gapX * gapX + gapY * gapY); // hypotenuse length
		var basRad = Math.atan2(gapY, gapX);
		var rotRad = basRad - RADIAN;
		var rotPX = OX + hypLen * Math.cos(rotRad);
		var rotPY = OY + hypLen * Math.sin(rotRad);

		return [rotPX, rotPY];
	}
};