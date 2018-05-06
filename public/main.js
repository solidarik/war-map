"use strict";

window.app = {};
var app = window.app;

function startApp() {
    let mapControl = MapControl.create();
    let mapInfo = MapInfo.create(); //dbInfo > db
    //let objInfo = ObjInfo.create();

    mapControl.on("addFeature", (ft) => mapInfo.addFeature(ft));
    mapControl.on("changeFeatures", (ft) => mapInfo.changeFeatures(ft));
    mapControl.on("clearMap", () => mapInfo.clearDb());
    mapControl.on("selectFeature", (ft) => selectFeature(ft));

    mapInfo.on("addObject", (obj) => mapControl.addObjectToMap(obj));
    mapInfo.on("changeObject", (obj) => mapControl.changeObjectInMap(obj));
    mapInfo.on("clearDb", () => mapControl.clearMap());  
    
    //objInfo.on("saveObj", (obj) => mapInfo.saveObject(obj));
    //mapInfo.on("getKindTroops", (troops) => objInfo.addTroops(troops));

    $(document.getElementsByClassName('ol-attribution ol-unselectable ol-control ol-collapsed')).remove();
}

function selectFeature(ft) {
    addToDebug(JSON.stringify(ft));
}

function addToDebug(text) {
    $("#debug")[0].value = text;
}

function clearDebug() {
    $("#debug").val("");
}

function ChangeVisible(date, label) {
    let dateControl = $(date);
    let labelControl = $(label);
    
    dateControl.toggle();
    labelControl.toggle();
    
    if (!labelControl.is(":visible"))        
        dateControl.focus();
}

function CheckDate(date, label) {
    if ("" == $(date)[0].value) {
        ChangeVisible($(date), $(label));
    }
}