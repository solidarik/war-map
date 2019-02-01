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
	buildBubble(d,svg,projection,width);
};


$( document ).ready(function() {
    addComboBoxFromJson.addBootstrapDropDown(loadedData, "dropDownList", "id", "RusName", onClickDropDown);
});


function buildBubble(ldata,svg,projection,width) {
	document.getElementById("nameContainer").innerHTML = "";
	document.getElementById("nameContainer").innerHTML = "<h4>"+ldata.RusName+"</h4>";
	if (typeof (ldata.listYear) === "undefined") {
		d3.json(ldata.url, function (error, dataFromFile) {
			if (error) console.log(error);
			ldata.dataFromFile = dataFromFile;
			let listYear;
			if (ldata.jsonType == "UFA") {
				listYear = addSlider.getListYearNew(ldata.dataFromFile);
			} else if (ldata.jsonType == "SAMARA") {
				listYear = addSlider.getListYear(ldata.dataFromFile);
			}
			ldata.listYear = listYear;
			let curDataYearFilter;
			if (ldata.jsonType == "UFA") {
				curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[0]);
			} else if (ldata.jsonType == "SAMARA") {
				curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[0]);
			}
			let mxval;
			if (ldata.jsonType == "UFA") {
				mxval = flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
			} else if (ldata.jsonType == "SAMARA") {
				mxval = flagCircleInMap.getMaxValue(ldata.dataFromFile);
			}
			let flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_",mxval,width);
			if (ldata.jsonType == "UFA") {
				flagCircleInMapLoc.addFlagCircleInMapNew();
			} else if (ldata.jsonType == "SAMARA") {
				flagCircleInMapLOc.addFlagCircleInMap();
			}
			let updateFunction;
			if (ldata.jsonType == "UFA") {
				updateFunction = function (h, handle, label, xScale) {
					// update position and text of label according to slider scale
					let h2 = Number((h).toFixed(0));
					handle.attr("cx", xScale(h));

					label.attr("x", xScale(h)).text(listYear[h2]);

					let curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, listYear[h2]);
					let mxval;
					if (ldata.jsonType == "UFA") {
						mxval = flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
					} else if (ldata.jsonType == "SAMARA") {
						mxval = flagCircleInMap.getMaxValue(ldata.dataFromFile);
					}
					let flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_",mxval,width);
					flagCircleInMapLoc.addFlagCircleInMapNew();
				}
			} else if (ldata.jsonType == "SAMARA") {
				updateFunction = function (h, handle, label, xScale) {
					// update position and text of label according to slider scale
					let h2 = Number((h).toFixed(0));
					handle.attr("cx", xScale(h));

					label.attr("x", xScale(h)).text(listYear[h2]);
					let mxval;
					if (ldata.jsonType == "UFA") {
						mxval = flagCircleInMap.getMaxValueNew(ldata.dataFromFile);
					} else if (ldata.jsonType == "SAMARA") {
						mxval = flagCircleInMap.getMaxValue(ldata.dataFromFile);
					}
					let curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, listYear[h2]);
					let flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_",mxval,width,width);
					flagCircleInMapLoc.addFlagCircleInMap();
				}
			}
			addSlider.addSlider("vis", width, listYear, updateFunction);
		});
	} else {
		let curDataYearFilter;
		if (ldata.jsonType == "UFA") {
			curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[0]);
		} else if (ldata.jsonType == "SAMARA") {
			curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[0]);
		}
		let flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_",width);
		if (ldata.jsonType == "UFA") {
			flagCircleInMapLoc.addFlagCircleInMapNew();
		} else if (ldata.jsonType == "SAMARA") {
			flagCircleInMapLoc.addFlagCircleInMap();
		}
		let updateFunction;
		if (ldata.jsonType == "UFA") {
			updateFunction = function (h, handle, label, xScale) {
				// update position and text of label according to slider scale
				let h2 = Number((h).toFixed(0));
				handle.attr("cx", xScale(h));

				label.attr("x", xScale(h)).text(ldata.listYear[h2]);

				let curDataYearFilter = addSlider.filterByYearNew(ldata.dataFromFile, ldata.listYear[h2]);
				let flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_",width);
				flagCircleInMapLoc.addFlagCircleInMapNew();
			}
		} else if (ldata.jsonType == "SAMARA") {
			updateFunction = function (h, handle, label, xScale) {
				// update position and text of label according to slider scale
				let h2 = Number((h).toFixed(0));
				handle.attr("cx", xScale(h));

				label.attr("x", xScale(h)).text(ldata.listYear[h2]);

				let curDataYearFilter = addSlider.filterByYear(ldata.dataFromFile, ldata.listYear[h2]);
				let flagCircleInMapLoc = new flagCircleInMap(curDataYearFilter, svg, projection, "img_",width);
				flagCircleInMapLoc.addFlagCircleInMap();
			}
		}
		addSlider.addSlider("vis", width, ldata.listYear, updateFunction);
	}
}

var url = "data/countries.json";
var url2 = "data/data_new.json";

function startApp() {
    d3.json(url, function (error, countries) {
        if (error) console.log(error);
        d3.json(url2, function (error, places) {
            if (error) console.log(error);
    
    
            width = parseInt(d3.select("#mapContainer").style("width")),
                height =  Math.round(width * 5 / 12);//parseInt(d3.select("#mapContainer").style("height"));
            let scale0 = (width - 1) / 2 / Math.PI;
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
    
            let addImageInPage = new AddImageInPage(svg, places, "iso2", "img_", "img/flags/", ".png");
            addImageInPage.addImageInPage();
    
            let ldata = loadedData[7];
    
            buildBubble(ldata,svg,projection,width);
    
    
            // let listYear = addSlider.getListYear(places);
    
            // let curDataYearFilter = addSlider.filterByYear(places, listYear[0]);
            // let flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
            // flagCircleInMap.addFlagCircleInMap();
    
            // let updateFunction = function (h, handle, label, xScale) {
            // 	// update position and text of label according to slider scale
            // 	let h2 = Number((h).toFixed(0));
            // 	handle.attr("cx", xScale(h));
    
            // 	label.attr("x", xScale(h)).text(listYear[h2]);
    
            // 	let curDataYearFilter = addSlider.filterByYear(places, listYear[h2]);
            // 	let flagCircleInMap = new flCInMap.flagCircleInMap(curDataYearFilter, svg, projection, "img_");
            // 	flagCircleInMap.addFlagCircleInMap();
            // }
    
            // addSlider.addSlider("vis", width, listYear, updateFunction);
    
    
            // let playButton = d3.select("#play-button");
            // playButton.on("click", function () {
    
            // });
        })
    
    });
 
}

