"use strict";

window.app = {};
var app = window.app;

function startApp() {
    let mapControl = MapControl.create();
    let mapInfo = MapInfo.create();
    let objControl = ObjControl.create();

    mapControl.on("addFeature", (ft) => {
        mapInfo.addFeature(ft);
        objControl.showInfo({obj: ft, count: mapInfo.getCount(), selectOnMap: false});
        
    });

    mapControl.on("getCurrentCountry", () => { return objControl.getCurrentCountry();});
    mapControl.on("changeFeatures", (ft) => mapInfo.changeFeatures(ft));
    mapControl.on("clearMap", () => mapInfo.clearDb());
    mapControl.on("selectFeature", (ft) => objControl.showInfo({obj: ft,  count: mapInfo.getCount()}));

    var tryOnce = false;

    mapInfo.on("addObject", (obj) => {
        mapControl.addObjectToMap(obj);
        objControl.changeCount(mapInfo.getCount());

        if ((0 < mapInfo.getCount()) && !tryOnce) {
            objControl.showInfo({obj: mapInfo.getFirstObject()});
            tryOnce = true;
        }
    });

    objControl.on("getObjectPosition", (uid) => mapInfo.getObjectPosition(uid));
    objControl.on("getPrevObject", (uid) => mapInfo.getPrevObject(uid));
    objControl.on("getNextObject", (uid) => mapInfo.getNextObject(uid));
    objControl.on("prev", (uid) => objControl.showInfo({obj: mapInfo.getPrevObject(uid)}));
    objControl.on("next", (uid) => objControl.showInfo({obj: mapInfo.getNextObject(uid)}));
    objControl.on("changeObject", (obj) => mapInfo.changeObjectFromClient(obj));
    objControl.on("selectObject", (obj) => mapControl.selectObject(obj));
    objControl.on("deleteObject", (obj => mapInfo.deleteFromClient(obj)));

    mapInfo.on("changeObject", (obj) => mapControl.changeObjectInMap(obj));
    mapInfo.on("deleteObject", (obj) => {  
        console.log(mapInfo.getCount());      
        mapControl.deleteObjectInMap(obj);        
        objControl.showInfo({obj: mapInfo.getFirstObject(), count: mapInfo.getCount()});
    });
    mapInfo.on("clearDb", () => mapControl.clearMap());

    $(document.getElementsByClassName('ol-attribution ol-unselectable ol-control ol-collapsed')).remove();


    var data = [
        ["", "Ford", "Tesla", "Toyota", "Honda"],
        ["2017", 10, 11, 12, 13],
        ["2018", 20, 11, 14, 13],
        ["2019", 30, 15, 12, 13]
      ];
      
      var container = document.getElementById('handsontable-example');
      console.log(container);
      var hot = new Handsontable(container, {
        data: data,
        rowHeaders: true,
        colHeaders: true,
        filters: true,
        language: 'ru-RU',
        contextMenu: true,
        dropdownMenu: true
      });
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