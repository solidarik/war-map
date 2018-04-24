"use strict";

window.app = {};
var app = window.app;


function startApp() {
    let mapControl = MapControl.create();
    let mapInfo = MapInfo.create();

    mapControl.on("addFeature", (ft) => mapInfo.addFeature(ft));
    mapControl.on("changeFeatures", (ft) => mapInfo.changeFeatures(ft));
    mapControl.on("clearMap", () => mapInfo.clearDb());

    mapInfo.on("addObject", (obj) => mapControl.addObjectToMap(obj));
    mapInfo.on("changeObject", (obj) => mapControl.changeObjectInMap(obj));
    mapInfo.on("clearDb", () => mapControl.clearMap());
}

$.fn.exists = function () {
    return this.length !== 0;
}