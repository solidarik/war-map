"use strict";

window.app = {};
var app = window.app;

var loadedData = [{}];
loadedData.push({ "id": "1", "EngName": "Agriculture, forestry, and fishing, value added (current US$)", "RusName": "Агропромышленность", "url": "data/DTO/Agriculture, forestry, and fishing, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "2", "EngName": "Cereal production (metric tons)", "RusName": "Зерно", "url": "data/DTO/Cereal production (metric tons).json", "jsonType": "UFA" });
loadedData.push({ "id": "3", "EngName": "GDP (Merged data)", "RusName": "ВВП объединенные", "url": "data/DTO/GDP (Merged data).json", "jsonType": "UFA" });
loadedData.push({ "id": "4", "EngName": "Industry (including construction), value added (current US$)", "RusName": "Промышленность", "url": "data/DTO/Industry (including construction), value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "5", "EngName": "Manufacturing, value added (current US$)", "RusName": "Производство", "url": "data/DTO/Manufacturing, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "6", "EngName": "PerCapita GDP", "RusName": "ВВП на душу", "url": "data/DTO/PerCapita GDP.json", "jsonType": "UFA" });
loadedData.push({ "id": "7", "EngName": "Population (Merged data)", "RusName": "Население", "url": "data/DTO/Population (Merged data).json", "jsonType": "UFA" });
loadedData.push({ "id": "8", "EngName": "Services, value added (current US$)", "RusName": "Услуги", "url": "data/DTO/Services, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "9", "EngName": "GDP", "RusName": "ВВП", "url": "data/data_new.json", "jsonType": "SAMARA" });

var svg;
var projection;
var width;
var height;

var onClickDropDown = function (d) {
	buildBubble(d, svg, projection, width);
};


$(document).ready(function () {
	addComboBoxFromJson.addBootstrapDropDown(loadedData, "dropDownList", "id", "RusName", onClickDropDown);
});


function buildBubble(ldata, svg, projection, width) {
	document.getElementById("nameContainer").innerHTML = "";
	document.getElementById("nameContainer").innerHTML = "<h4>" + ldata.RusName + "</h4>";
	if (typeof (ldata.listYear) === "undefined") {
		console.time("load data "+ldata.RusName);
		d3.json(ldata.url, function (error, dataFromFile) {
			console.timeEnd("load data "+ldata.RusName);
			console.time("build list year");
			if (error) console.log(error);
			ldata.dataFromFile = dataFromFile;
			var listYear;
			if (ldata.jsonType == "UFA") {
				listYear = addSlider.getListYearNew(ldata.dataFromFile);
			} else if (ldata.jsonType == "SAMARA") {
				listYear = addSlider.getListYear(ldata.dataFromFile);
			}
			ldata.listYear = listYear;
			console.timeEnd("build list year");
			console.time("filte by year");
			var curDataYearFilter;
			if (ldata.jsonType == "UFA") {
				curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[0]);
			} else if (ldata.jsonType == "SAMARA") {
				curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[0]);
			}
			console.timeEnd("filte by year");
			console.time("max val");
			var mxval = 0;
			// if (ldata.jsonType == "UFA") {
			// 	mxval = flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
			// } else if (ldata.jsonType == "SAMARA") {
			// 	mxval = flagCircleInMap.getMaxValue(ldata.dataFromFile);
			// }
			console.timeEnd("max val");
			console.time("addFlagCircleInMap");
			var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", mxval, width);
			if (ldata.jsonType == "UFA") {
				flagCircleInMapLoc.addFlagCircleInMapNew();
			} else if (ldata.jsonType == "SAMARA") {
				flagCircleInMapLOc.addFlagCircleInMap();
			}
			console.timeEnd("addFlagCircleInMap");
			var updateFunction;
			if (ldata.jsonType == "UFA") {
				updateFunction = function (h, handle, label, xScale) {
					// update position and text of label according to slider scale
					var h2 = Number((h).toFixed(0));
					handle.attr("cx", xScale(h));

					label.attr("x", xScale(h)).text(listYear[h2]);

					var curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, listYear[h2]);
					var mxval = 0;
					// if (ldata.jsonType == "UFA") {
					// 	mxval = flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
					// } else if (ldata.jsonType == "SAMARA") {
					// 	mxval = flagCircleInMap.getMaxValue(ldata.dataFromFile);
					// }
					var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", mxval, width);
					flagCircleInMapLoc.addFlagCircleInMapNew();
				}
			} else if (ldata.jsonType == "SAMARA") {
				updateFunction = function (h, handle, label, xScale) {
					// update position and text of label according to slider scale
					var h2 = Number((h).toFixed(0));
					handle.attr("cx", xScale(h));

					label.attr("x", xScale(h)).text(listYear[h2]);
					var mxval = 0;
					// if (ldata.jsonType == "UFA") {
					// 	mxval = flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
					// } else if (ldata.jsonType == "SAMARA") {
					// 	mxval = flagCircleInMap.getMaxValue(ldata.dataFromFile);
					// }
					var curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, listYear[h2]);
					var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", mxval, width);
					flagCircleInMapLoc.addFlagCircleInMap();
				}
			}
			console.time("addSlider");
			addSlider.addSlider("vis", width, listYear, updateFunction);
			console.timeEnd("addSlider");
		});
	} else {
		console.time("filte by year");
		var curDataYearFilter;
		if (ldata.jsonType == "UFA") {
			curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[0]);
		} else if (ldata.jsonType == "SAMARA") {
			curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[0]);
		}
		console.timeEnd("filte by year");
		console.time("addFlagCircleInMap");
		var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", 0,width);
		if (ldata.jsonType == "UFA") {
			flagCircleInMapLoc.addFlagCircleInMapNew();
		} else if (ldata.jsonType == "SAMARA") {
			flagCircleInMapLoc.addFlagCircleInMap();
		}
		console.timeEnd("addFlagCircleInMap");
		var updateFunction;
		if (ldata.jsonType == "UFA") {
			updateFunction = function (h, handle, label, xScale) {
				// update position and text of label according to slider scale
				var h2 = Number((h).toFixed(0));
				handle.attr("cx", xScale(h));

				label.attr("x", xScale(h)).text(ldata.listYear[h2]);

				var curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[h2]);
				var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_",0, width);
				flagCircleInMapLoc.addFlagCircleInMapNew();
			}
		} else if (ldata.jsonType == "SAMARA") {
			updateFunction = function (h, handle, label, xScale) {
				// update position and text of label according to slider scale
				var h2 = Number((h).toFixed(0));
				handle.attr("cx", xScale(h));

				label.attr("x", xScale(h)).text(ldata.listYear[h2]);

				var curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[h2]);
				var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", 0, width);
				flagCircleInMapLoc.addFlagCircleInMap();
			}
		}
		console.time("addSlider");
		addSlider.addSlider("vis", width, ldata.listYear, updateFunction);
		console.timeEnd("addSlider");
	}
}

var url = "data/countries.json";
var url2 = "data/data_new.json";

function startApp() {
	console.time("load countries");
	d3.json(url, function (error, countries) {
		console.timeEnd("load countries");
		if (error) console.log(error);

		console.time("add countries");
		width = parseInt(d3.select("#mapContainer").style("width")),
			height = Math.round(width * 5 / 12);//parseInt(d3.select("#mapContainer").style("height"));
		var scale0 = (width - 1) / 2 / Math.PI;
		projection = d3.geoEquirectangular()
			.scale([scale0]) // scale to fit group width;
			.translate([width / 2, height / 2 + 50])// ensure centred in group
			//.translate([0,0])// ensure centred in group
			;


		svg = d3.select("div#mapContainer").append("svg")
			.attr("width", width)
			.attr("height", height)
			// .call(d3.zoom().on("zoom", function () {
			// 	svg.attr("transform", d3.event.transform)
			// }))
			;

		addCountries.addContries(countries.features, svg, projection);
		console.timeEnd("add countries");
		console.time("load places");
		d3.json(url2, function (error, places) {
			console.timeEnd("load places");
			if (error) console.log(error);

			var ldata = loadedData[7];
			console.time("add buuble");
			buildBubble(ldata, svg, projection, width);
			console.timeEnd("add buuble");
			
			console.time("add image");
			var addImageInPage = new AddImageInPage(svg, places, "iso2", "img_", "img/flags/", ".png");
			addImageInPage.addImageInPage();
			console.timeEnd("add image");
			// var listYear = addSlider.getListYear(places);

			// var curDataYearFilter = addSlider.filterByYear(places, listYear[0]);
			// var flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
			// flagCircleInMap.addFlagCircleInMap();

			// var updateFunction = function (h, handle, label, xScale) {
			// 	// update position and text of label according to slider scale
			// 	var h2 = Number((h).toFixed(0));
			// 	handle.attr("cx", xScale(h));

			// 	label.attr("x", xScale(h)).text(listYear[h2]);

			// 	var curDataYearFilter = addSlider.filterByYear(places, listYear[h2]);
			// 	var flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
			// 	flagCircleInMap.addFlagCircleInMap();
			// }

			// addSlider.addSlider("vis", width, listYear, updateFunction);


			// var playButton = d3.select("#play-button");
			// playButton.on("click", function () {

			// });
		})

	});

}

