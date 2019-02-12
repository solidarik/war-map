"use strict";

window.app = {};
var app = window.app;

var loadedData = [];
loadedData.push({ "id": "10", "EngName": "Submarines", "RusName": "Подводные лодки", "url": "data/number_submarines.json", "jsonType": "UFA" });
loadedData.push({ "id": "11", "EngName": "Ships", "RusName": "Корабли", "url": "data/number_ships.json", "jsonType": "UFA" });
loadedData.push({ "id": "12", "EngName": "Aircraft", "RusName": "Самолеты", "": "data/number_military_aircraft.json", "jsonType": "UFA" });
loadedData.push({ "id": "13", "EngName": "Large ships", "RusName": "Большие корабли", "url": "data/number_large_ships.json", "jsonType": "UFA" });
loadedData.push({ "id": "14", "EngName": "Fighters", "RusName": "Истребители", "url": "data/number_fighters.json", "jsonType": "UFA" });
loadedData.push({ "id": "15", "EngName": "Military", "RusName": "Войска", "url": "data/military_strength.json", "jsonType": "UFA" });
loadedData.push({ "id": "16", "EngName": "Ground forses", "RusName": "Сухопутные войска", "url": "data/ground_forses.json", "jsonType": "UFA" });

loadedData.push({ "id": "1", "EngName": "Agriculture, forestry, and fishing, value added (current US$)", "RusName": "Агропромышленность", "url": "data/DTO/Agriculture, forestry, and fishing, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "2", "EngName": "Cereal production (metric tons)", "RusName": "Зерно", "url": "data/DTO/Cereal production (metric tons).json", "jsonType": "UFA" });
loadedData.push({ "id": "3", "EngName": "GDP (Merged data)", "RusName": "ВВП объединенные", "url": "data/DTO/GDP (Merged data).json", "jsonType": "UFA" });
loadedData.push({ "id": "4", "EngName": "Industry (including construction), value added (current US$)", "RusName": "Промышленность", "url": "data/DTO/Industry (including construction), value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "5", "EngName": "Manufacturing, value added (current US$)", "RusName": "Производство", "url": "data/DTO/Manufacturing, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "6", "EngName": "PerCapita GDP", "RusName": "ВВП на душу", "url": "data/DTO/PerCapita GDP.json", "jsonType": "UFA" });
loadedData.push({ "id": "7", "EngName": "Population (Merged data)", "RusName": "Население", "url": "data/DTO/Population (Merged data).json", "jsonType": "UFA" });
loadedData.push({ "id": "8", "EngName": "Services, value added (current US$)", "RusName": "Услуги", "url": "data/DTO/Services, value added (current US$).json", "jsonType": "UFA" });
loadedData.push({ "id": "9", "EngName": "GDP", "RusName": "ВВП", "url": "data/data_new.json", "jsonType": "SAMARA" });



// function downloadObjectAsJson(exportObj, exportName) {
// 	var dataStr = "data:text/json;charset:utf-8," + encodeURIComponent(JSON.stringify(exportObj));
// 	var downloadAnchorNode = document.createElement('a');
// 	downloadAnchorNode.setAttribute("href", dataStr);
// 	downloadAnchorNode.setAttribute("download", exportName + ".json");
// 	document.body.appendChild(downloadAnchorNode); // required for firefox
// 	downloadAnchorNode.click();
// 	downloadAnchorNode.remove();
// }

// function download(content, fileName, contentType) {
// 	var a = document.createElement("a");
// 	var file = new Blob([content], { type: contentType });
// 	a.href = URL.createObjectURL(file);
// 	a.download = fileName;
// 	a.click();
// }

// loadedData.forEach(element => {
// 	if (element.id < 9) {
// 		var filteredYearData = [];
// 		d3.json(element.url, function (error, dataFromFile) {
// 			if (error) console.log(error);
// 			var changedData = dataFromFile.filter(function (el) {
// 				return parseInt(el.date) >= 1900;
// 			  });
// 			download(JSON.stringify(changedData), element.url.substring(element.url.lastIndexOf('/') + 1, element.url.lastIndexOf('.')) + '_small_1900.json', 'text/json');
// 		});
// 	}

// 	// d3.json(element.url, function (error, dataFromFile) {
// 	// 	if (error) console.log(error);
// 	// 	var changedData = dataFromFile;
// 	// 	changedData.forEach(element => {
// 	// 		delete element.engCountry;  // or delete person["age"];
// 	// 		delete element.rusCity;  // or delete person["age"];
// 	// 		delete element.engCity;  // or delete person["age"];
// 	// 		delete element.code;  // or delete person["age"];
// 	// 		delete element.rusIndicator;  // or delete person["age"];
// 	// 		delete element.engIndicator;  // or delete person["age"];
// 	// 		delete element.engUnit;  // or delete person["age"];
// 	// 		delete element.rusSource;  // or delete person["age"];
// 	// 		delete element.engSource;  // or delete person["age"];
// 	// 		delete element.sourceURL;  // or delete person["age"];
// 	// 		delete element.rusComment;  // or delete person["age"];
// 	// 		delete element.engComment;  // or delete person["age"];
// 	// 	});
// 	//	download(JSON.stringify(changedData), element.url.substring(element.url.lastIndexOf('/') + 1, element.url.lastIndexOf('.')) + '_small.json', 'text/json');
// 	//});
// });

// console.time implementation for IE
if (window.console && typeof (window.console.time) == "undefined") {
	console.time = function (name, reset) {
		if (!name) { return; }
		var time = new Date().getTime();
		if (!console.timeCounters) { console.timeCounters = {}; }
		var key = "KEY" + name.toString();
		if (!reset && console.timeCounters[key]) { return; }
		console.timeCounters[key] = time;
	};

	console.timeEnd = function (name) {
		var time = new Date().getTime();
		if (!console.timeCounters) { return; }
		var key = "KEY" + name.toString();
		var timeCounter = console.timeCounters[key];
		var diff;
		if (timeCounter) {
			diff = time - timeCounter;
			var label = name + ": " + diff + "ms";
			console.info(label);
			delete console.timeCounters[key];
		}
		return diff;
	};
}

var svg;
var projection;
var width;
var height;

var onClickDropDown = function (d) {
	buildBubble(d, svg, projection, width);
};

function loadJSON(url, callback) {

	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}


$(document).ready(function () {
	addComboBoxFromJson.addBootstrapDropDown(loadedData, "dropDownList", "id", "RusName", onClickDropDown);
});


function buildBubble(ldata, svg, projection, width) {
	document.getElementById("nameContainer").innerHTML = "";
	document.getElementById("nameContainer").innerHTML = "<h4>" + ldata.RusName + "</h4>";
	if (typeof (ldata.listYear) === "undefined") {

		// console.time("fast load oboe data " + ldata.RusName);

		// oboe({
		// 	'url': ldata.url,
		// 	'method': 'GET',   //optional
		// 	//'body': data    //no need to encode, the library will JSON stringify it automatically
		// }).on('done', function (things) {
		// 	var oboe_actual_JSON = things;
		// 	console.timeEnd("fast load oboe data " + ldata.RusName);
		// });


		// console.time("fast load jqery data " + ldata.RusName);
		// $.getJSON(ldata.url, function (data) {
		// 	var jqery_actual_JSON = data;
		// 	console.timeEnd("fast load jqery data " + ldata.RusName);
		// });

		// console.time("fast load data " + ldata.RusName);
		// loadJSON(ldata.url, function (response) {
		// 	// Parse JSON string into object
		// 	var actual_JSON = JSON.parse(response);
		// 	console.timeEnd("fast load data " + ldata.RusName);
		// });


		console.time("load data " + ldata.RusName);
		d3.json(ldata.url, function (error, dataFromFile) {
			console.timeEnd("load data " + ldata.RusName);
			console.time("build list year");
			if (error) console.log(error);
			ldata.dataFromFile = dataFromFile;
			var listYear;
			if (ldata.jsonType == "UFA") {
				listYear = addSlider.getListYearNew(ldata.dataFromFile);
			} else if (ldata.jsonType == "SAMARA") {
				console.log("ldata.dataFromFile=" + JSON.stringify(ldata.dataFromFile));
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
		var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", 0, width);
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
				var flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_", 0, width);
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

			var ldata = loadedData[5];
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

//window.addEventListener('load', () => {startApp()})

function addEvent(evnt, elem, func) {
	if (elem.addEventListener)  // W3C DOM
	{
	   elem.addEventListener(evnt, func, false);
	   console.log('addeventlistener');
	}
	else if (elem.attachEvent) { // IE DOM
	   elem.attachEvent("on"+evnt, func);
	   console.log('attackEvent');
	}
	else { // No much to do
	   elem["on"+evnt] = func;
	}
}

addEvent('load', window, startApp);