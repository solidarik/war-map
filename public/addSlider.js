'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addSlider = function () {
	function addSlider() {
		_classCallCheck(this, addSlider);
	}

	_createClass(addSlider, null, [{
		key: 'getListYear',
		value: function getListYear(data) {
			var listYear = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var d = _step.value;

					d.dataCountries.forEach(function (d1) {
						var elem = d1.year;
						while (elem.length < 4) {
							elem = '0' + elem;
						}
						listYear.push(elem);
					});
					if (listYear.length > 0) {
						break;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			;
			return listYear;
		}
	}, {
		key: 'getListYearNew',
		value: function getListYearNew(data) {
			var listYear = [];

			// let fdata = data.filter(function (n) {
			// 	return n.iso3 === "RUS";
			// });
			// console.log("fdata=" + fdata);
			// for (let index = 0; index < data.length; index++) {
			// 	const element = data[index].date;
			// 	if(element == "1945"){
			// 		console.log("(element == 1945");
			// 		console.log("listYear="+listYear);
			// 		console.log("listYear.includes(element)="+listYear.includes(element));
			// 		if(!listYear.includes(element)){
			// 			listYear.push(element);
			// 		}
			// 	}else{
			// 		if(!listYear.includes(element)){
			// 			listYear.push(element);
			// 		}
			// 	}

			// }

			data.forEach(function (d) {
				var elem = d.date;
				while (elem.length < 4) {
					elem = '0' + elem;
				}
				//if (!listYear.includes(elem)) {
				if (listYear.indexOf(elem) == -1) {
					listYear.push(elem);
				}
			});

			listYear.sort();

			return listYear;
		}
	}, {
		key: 'getListYearNewArray',
		value: function getListYearNewArray(data) {
			var listYear = [];
			data.forEach(function (d) {
				d.forEach(function (d1) {
					var elem = d1.date;
					while (elem.length < 4) {
						elem = '0' + elem;
					}
					//if (!listYear.includes(elem)) {
					if (listYear.indexOf(elem) == -1) {
						listYear.push(elem);
					}
				});
			});

			listYear.sort();

			return listYear;
		}
	}, {
		key: 'filterByYear',
		value: function filterByYear(data, yearFilter) {
			var dataYearFilter = [];
			data.forEach(function (d) {
				var curElemnt = {};
				curElemnt.id = d.id;
				curElemnt.name = d.name;
				curElemnt.name_ru = d.name_ru;
				curElemnt.fips = d.fips;
				curElemnt.iso2 = d.iso2;
				curElemnt.iso3 = d.iso3;
				curElemnt.centroid = d.centroid;
				curElemnt.dataCountries = d.dataCountries.filter(function (object) {
					var year = object.year;
					return year == yearFilter;
				});
				dataYearFilter.push(curElemnt);
			});
			return dataYearFilter;
		}
	}, {
		key: 'filterByYearNew',
		value: function filterByYearNew(data, yearFilter) {
			var dataYearFilter = data.filter(function (object) {
				var year = object.date;
				return year == yearFilter;
			});
			return dataYearFilter;
		}
	}, {
		key: 'addSlider',
		value: function addSlider(idElemForSvg, width, listYear, updateFunction) {
			var margin = { top: 75, right: 50, bottom: 0, left: 50 };
			var widthSlider = width - margin.left - margin.right,
			    heightSlider = 150;

			var xScale = d3.scaleLinear().domain([0, listYear.length - 1]).range([0, widthSlider]).clamp(true);

			d3.select("#" + idElemForSvg).selectAll("svg").remove();

			var svg = d3.select("#" + idElemForSvg).append("svg").attr("width", widthSlider + margin.left + margin.right).attr("height", heightSlider);

			var slider = svg.append("g").attr("class", "slider").attr("transform", "translate(" + margin.left + "," + heightSlider / 4 + ")");

			slider.append("line").attr("class", "track").attr("x1", function () {
				return xScale.range()[0];
			}).attr("x2", function () {
				return xScale.range()[1];
			}).select(function () {
				return this.parentNode.appendChild(this.cloneNode(true));
			}).attr("class", "track-inset").select(function () {
				return this.parentNode.appendChild(this.cloneNode(true));
			}).attr("class", "track-overlay").call(d3.drag().on("start.interrupt", function () {
				slider.interrupt();
			}).on("start drag", function () {
				updateFunction(xScale.invert(d3.event.x), handle, label, xScale);
			}));

			var yearCount = listYear.length;
			if (yearCount > Math.abs(widthSlider / 40)) {
				yearCount = Math.abs(widthSlider / 40);
			}
			slider.insert("g", ".track-overlay").attr("class", "ticks").attr("transform", "translate(0," + 18 + ")").selectAll("text").data(xScale.ticks(yearCount)).enter().append("text").attr("x", xScale).attr("y", 10).attr("text-anchor", "middle").text(function (d) {
				return listYear[d];
			});

			var handle = slider.insert("circle", ".track-overlay").attr("class", "handle").attr("r", 9);

			var label = slider.append("text").attr("class", "label").attr("text-anchor", "middle").text(listYear[0]).attr("transform", "translate(0," + -15 + ")");
		}
	}]);

	return addSlider;
}();