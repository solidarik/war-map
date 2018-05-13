"use strict";

window.app = {};
var app = window.app;

function startApp() {
    let mapControl = MapControl.create();
    let mapInfo = MapInfo.create();
    let objControl = ObjControl.create();

    mapControl.on("addFeature", (ft) => {
        mapInfo.addFeature(ft);
        objControl.showInfo(ft, mapInfo.getCount());
        
    });

    mapControl.on("getCurrentCountry", () => { return objControl.getCurrentCountry();});
    mapControl.on("changeFeatures", (ft) => mapInfo.changeFeatures(ft));
    mapControl.on("clearMap", () => mapInfo.clearDb());
    mapControl.on("selectFeature", (ft) => objControl.showInfo(ft, mapInfo.getCount()));

    var tryOnce = false;

    mapInfo.on("addObject", (obj) => {
        mapControl.addObjectToMap(obj);
        objControl.changeCount(mapInfo.getCount());

        if ((0 < mapInfo.getCount()) && !tryOnce) {
            objControl.showInfo(mapInfo.getFirstObject());
            tryOnce = true;
        }
    });

    objControl.on("getObjectPosition", (uid) => mapInfo.getObjectPosition(uid));
    objControl.on("getPrevObject", (uid) => mapInfo.getPrevObject(uid));
    objControl.on("getNextObject", (uid) => mapInfo.getNextObject(uid));
    objControl.on("prev", (uid) => objControl.showInfo(mapInfo.getPrevObject(uid)));
    objControl.on("next", (uid) => objControl.showInfo(mapInfo.getNextObject(uid)));
    objControl.on("changeObject", (obj) => mapInfo.changeObjectFromClient(obj));
    objControl.on("selectObject", (obj) => mapControl.selectObject(obj));
    objControl.on("deleteObject", (obj => mapInfo.deleteFromClient(obj)));
    
    objControl.on("delete", (obj) => {});

    mapInfo.on("changeObject", (obj) => mapControl.changeObjectInMap(obj));
    mapInfo.on("clearDb", () => mapControl.clearMap());  
    
    //objInfo.on("saveObj", (obj) => mapInfo.saveObject(obj));
    //mapInfo.on("getKindTroops", (troops) => objInfo.addTroops(troops));

    $(document.getElementsByClassName('ol-attribution ol-unselectable ol-control ol-collapsed')).remove();
}

function addToDebug(text) {
    console.log("add to debug " + text);
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