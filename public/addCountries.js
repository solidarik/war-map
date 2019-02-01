"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addCountries = function () {
				function addCountries() {
								_classCallCheck(this, addCountries);
				}

				_createClass(addCountries, null, [{
								key: "addContries",
								value: function addContries(data, svg, projection) {
												var path = d3.geoPath().projection(projection);

												svg.selectAll("path").data(data).enter().append("path").attr("d", path)
												// .on("mouseover",function(d) {
												// 	//console.log("just had a mouseover", d3.select(d));
												// 	d3.select(this)
												//   	.classed("active",true)
												// })
												// .on("mouseout",function(d){
												// 	d3.select(this)
												//   	.classed("active",false)
												// })
												;
								}
				}]);

				return addCountries;
}();