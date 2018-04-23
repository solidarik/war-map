"use strict";

window.app = {};
var app = window.app;
app.addFeatureEnabled = false;

(function(globals){
    globals.get = function(obj, key) {
        return key.split(".").reduce(function(o, x) {
            return (typeof o == "undefined" || o === null) ? o : o[x];
        }, obj);
    }
}(this));

function startApp() {
    let mapControl = MapControl.create();
    let mapInfo = MapInfo.create();

    mapControl.on("addFeature", (ft) => mapInfo.addFeature(ft));
    mapControl.on("clearMap", () => mapInfo.clearDb());

    mapInfo.on("getObjectsFromServer", (data) => mapControl.addObjectsToMap(data));
    mapInfo.on("clearDb", () => mapControl.clearMap());
}

$.fn.exists = function () {
    return this.length !== 0;
}