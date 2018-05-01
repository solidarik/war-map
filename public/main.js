"use strict";

window.app = {};
var app = window.app;

function startApp() {
    let mapControl = MapControl.create();
    let mapInfo = MapInfo.create();

    mapControl.on("addFeature", (ft) => mapInfo.addFeature(ft));
    mapControl.on("changeFeatures", (ft) => mapInfo.changeFeatures(ft));
    mapControl.on("clearMap", () => mapInfo.clearDb());
    mapControl.on("selectFeature", (ft) => selectFeature(ft));

    mapInfo.on("addObject", (obj) => mapControl.addObjectToMap(obj));
    mapInfo.on("changeObject", (obj) => mapControl.changeObjectInMap(obj));
    mapInfo.on("clearDb", () => mapControl.clearMap());    
}

function selectFeature(ft) {
    addToDebug(JSON.stringify(ft));
}

function addToDebug(text) {
    //$("#debug").val('');
    $("#debug").append('\n' + text);
}

function clearDebug() {
    $("#debug").val("");
}