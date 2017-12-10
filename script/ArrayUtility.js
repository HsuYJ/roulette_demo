// ArrayUtility.js
(function() {

	var Utilities = {

		getLast: function(INDEX) {

			return this[Math.max(0, this.length - (INDEX || 1))];
		},

		sum: function() {

			var sum = 0;

			for (var i = 0, l = this.length; i < l; i++) {
				var item = this[i];

				if (typeof item === 'number') {
					sum = sum + item;
				}
			}

			return sum;
		},

		squash: function(ITEM, CAP) {

			var leak;

			if (CAP) {
				var itemNumber = this.length;
				var gap = itemNumber - CAP;

				if (!gap) {
					leak = this.shift();
				} else if (gap > 0) {
					for (var i = 0; i <= gap; i++) {
						leak = this.shift();
					}
				}
			} else {
				leak = this.shift();
			}

			this.push(ITEM);

			return leak;
		},

		add: function(ITEM) { // if ITEM is not contained in Array, push ITEM to Array

			if (this.indexOf(ITEM) === -1) {
				this.push(ITEM);

				return true;
			}
		},

		removeByIndex: function(INDEX) {

			var length = this.length;

			if (length) {
				var item;

				if (INDEX) {
					var lastIndex = length - 1;

					if (INDEX < lastIndex) {
						for (var i = INDEX; i < lastIndex; i++) {
							this[i] = this[i + 1];
						}

						item = this.pop();
					} else if (INDEX === lastIndex) {
						item = this.pop();
					}
				} else { // 0
					item = this.shift();
				}

				return item;
			}
		},

		remove: function(ITEM) { // Any: ITEM; Bol: has ITEM

			var index = this.indexOf(ITEM);

			if (index !== -1) {
				var lastIndex = this.length - 1;

				if (index < lastIndex) {
					for (var i = index; i < lastIndex; i++) {
						this[i] = this[i + 1];
					}
				}

				this.pop();

				return true;
			} else {
				return false;
			}
		},

		insert: function(INDEX, ITEM) {

			var insertIndex = INDEX;

			if (insertIndex) {
				var length = this.length;

				if (insertIndex >= length) {
					this.push(ITEM);
					insertIndex = length;
				} else {
					this.length = length + 1;

					for (var i = 0, l = length - insertIndex; i < l; i++) {
						var index = length - i;

						this[index] = this[index - 1];
					}

					this[insertIndex] = ITEM;
				}
			} else { // 0
				this.unshift(ITEM);
			}

			return insertIndex;
		},

		insertLast: function(INDEX, ITEM) {

			var length = this.length;
			var insertIndex = length - INDEX + 1;

			if (insertIndex === length) {
				this.push(ITEM);
			} else {
				if (insertIndex <= 0) {
					this.unshift(ITEM);
					insertIndex = 0;
				} else {
					this.length = length + 1;

					for (var i = 0, l = length - insertIndex; i < l; i++) {
						var index = length - i;

						this[index] = this[index - 1];
					}

					this[insertIndex] = ITEM;
				}
			}

			return insertIndex;
		},

		relocate: function(ITEM, INDEX) {

			var index = this.indexOf(ITEM);

			if (index !== -1) {
				if (index !== INDEX) {
					var itemNumber = this.length;
					var lastIndex = itemNumber - 1;

					if (index < lastIndex) {
						for (var i = index; i < lastIndex; i++) {
							this[i] = this[i + 1];
						}
					}

					if (INDEX >= lastIndex) {
						INDEX = lastIndex;

						if (index !== lastIndex) {
							this.pop();
							this.push(ITEM);
						}
					} else {
						for (var j = 0, l = lastIndex - INDEX; j < l; j++) {
							var jndex = lastIndex - j;

							this[jndex] = this[jndex - 1];
						}

						this[INDEX] = ITEM;
					}
				}

				return INDEX;
			} else {
				return -1;
			}
		},

		toHead: function(ITEM) {

			var itemNumber = this.length;
			var index = this.indexOf(ITEM);

			if (index) {
				itemNumber = this.unshift(ITEM);

				if (index !== -1) {
					var lastIndex = itemNumber - 1;

					itemNumber = itemNumber - 1;
					index = index + 1;

					if (index < lastIndex) {
						for (var i = index; i < lastIndex; i++) {
							this[i] = this[i + 1];
						}
					}

					this.pop();
				}
			}

			return itemNumber;
		},

		toTail: function(ITEM) {

			var itemNumber = this.length;
			var index = this.indexOf(ITEM);

			if (index) {
				if (index === -1) {
					itemNumber = this.push(ITEM);
				} else {
					var lastIndex = itemNumber - 1;

					if (index < lastIndex) {
						for (var i = index; i < lastIndex; i++) {
							this[i] = this[i + 1];
						}

						this[lastIndex] = ITEM;
					}
				}
			} else { // 0, head to tail
				this.push(this.shift());
			}

			return itemNumber;
		},

		trim: function(REMOVE_EL) { // Any: REMOVE_EL; Num: itemNumber
			// has half performance vs create new Array
			for (var i = 0, l = this.length; i < l; i++) {
				var el = this.shift();

				if (el !== REMOVE_EL) {
					this.push(el);
				}
			}

			return this.length;
		},

		random: function() { // return a random element of array

			var length = this.length;

			if (length) {
				return this[Math.floor(Math.random() * length)];
			} else {
				return void 0;
			}
		},

		clear: function() { // none; Num: itemNum

			var itemNum = this.length;

			for (var i = 0; i < itemNum; i++) {
				this.pop();
			}

			return itemNum;
		}, // fastr then create new Array with fewer items

		become: function(ARR) { // Arr; Num: itemNum

			var itemNum = this.length;
			var itemNum_ARR = ARR.length;

			if (itemNum > itemNum_ARR) {
				for (var i = 0, l = itemNum - itemNum_ARR; i < l; i++) {
					this.pop();
				}
			}

			for (var j = 0; j < itemNum_ARR; j++) {
				this[j] = ARR[j];
			}

			return itemNum_ARR;
		},

		duplicate: function() { // none; Arr: duplicate

			var itemNum = this.length;
			var duplicate = new Array(itemNum);

			for (var i = 0; i < itemNum; i++) {
				duplicate[i] = this[i];
			}

			return duplicate;
		},

		concatOne: function(ARR) { // Arr; Arr

			var itemNum = this.length;
			var itemNum_ARR = ARR.length;
			var arr = new Array(itemNum + itemNum_ARR);
			var i;

			for (i = 0; i < itemNum; i++) {
				arr[i] = this[i];
			}

			for (i = 0; i < itemNum_ARR; i++) {
				arr[i + itemNum] = ARR[i];
			}

			return arr;
		},

		trimConcatOne: function(ARR) { // Arr; Arr

			var itemNum = this.length;
			var arr = new Array(itemNum);

			for (var i = 0; i < itemNum; i++) {
				arr[i] = this[i];
			}

			for (var j = 0, l = ARR.length; j < l; j++) {
				var item = ARR[i];

				if (arr.indexOf(item) === -1) {

					arr.push(item);
				}
			}

			return arr;
		},

		merge: function(ARR) { // Arr; Num: itemNumber

			for (var i = 0, l = ARR.length; i < l; i++) {
				this.push(ARR[i]);
			}

			return this.length;
		},

		trimMerge: function(ARR) { // Arr;  Num: itemNumber

			for (var i = 0, l = ARR.length; i < l; i++) {
				var item = ARR[i];

				if (this.indexOf(item) === -1) {

					this.push(item);
				}
			}

			return this.length;
		},

		loop: function(HANDLER) {

			for (var i = 0, l = this.length; i < l; i++) {
				if (HANDLER(this[i], i, this)) {
					break;
				}
			}

			return i;
		},

		contains: function(ITEM) { // Any; Bol

			for (var i = 0, l = this.length; i < l; i++) {
				if (this[i] === ITEM) {
					return true;
				}
			}

			return false;
		}
	};

	// install at Array.prototype(enumerable is false)
	var ArrayPrototype = Array.prototype;

	for (var name in Utilities) {
		Object.defineProperty(ArrayPrototype, name, {
			value: Utilities[name]
		});
	}
})();