"use strict";

window.app = {};
var app = window.app;

function retrieveImageFromClipboardAsBlob(pasteEvent, callback){

	if(pasteEvent.clipboardData == false){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    };

    var items = pasteEvent.clipboardData.items;

    if(items == undefined){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    };

    for (var i = 0; i < items.length; i++) {

        // Skip content if not image
        if (items[i].type.indexOf("image") == -1) continue;
        // Retrieve image on clipboard as blob
        var blob = items[i].getAsFile();

        if(typeof(callback) == "function"){
            callback(blob);
        }
    }
}

window.addEventListener("paste", function(e){

    // Handle the event
    retrieveImageFromClipboardAsBlob(e, function(imageBlob){
        // If there's an image, display it in the canvas
        if(imageBlob){
            var canvas = document.getElementById("mycanvas");
            var ctx = canvas.getContext('2d');

            // Create an image to render the blob on the canvas
            var img = new Image();

            // Once the image loads, render the img on the canvas
            img.onload = function(){
                // Update dimensions of the canvas with the dimensions of the image
                canvas.width = this.width;
                canvas.height = this.height;

                // Draw the image
                ctx.drawImage(img, 0, 0);
            };

            // Crossbrowser support for URL
            var URLObj = window.URL || window.webkitURL;

            // Creates a DOMString containing a URL representing the object given in the parameter
            // namely the original Blob
            img.src = URLObj.createObjectURL(imageBlob);
        }
    });
}, false);

function startApp() {
    let mapInfo = MapInfo.create();
    let mapControl = MapControl.create();
    let objControl = ObjControl.create();
    let dataControl = DataControl.create();

    var tryOnce = false;

    //mapInfo
    mapInfo.on("addObject", (obj) => {
        mapControl.addObjectToMap(obj);
        objControl.changeCount(mapInfo.getCount());

        if ((0 < mapInfo.getCount()) && !tryOnce) {
            objControl.showInfo({obj: mapInfo.getFirstObject()});
            tryOnce = true;
        }
    });
    mapInfo.on("changeObject", (obj) => mapControl.changeObjectInMap(obj));
    mapInfo.on("deleteObject", (obj) => {
        mapControl.deleteObjectInMap(obj);
        objControl.showInfo({obj: mapInfo.getCurrentObject(), count: mapInfo.getCount()});
    });
    mapInfo.on("clearDb", () => mapControl.clearMap());

    //mapControl
    mapControl.on("addFeature", (ft) => {
        mapInfo.addFeature(ft);
        objControl.showInfo({obj: ft, count: mapInfo.getCount(), selectOnMap: false});
    });

    mapControl.on("getCurrentCountry", () => { return objControl.getCurrentCountry();});
    mapControl.on("changeFeatures", (ft) => mapInfo.changeFeatures(ft));
    mapControl.on("clearMap", () => mapInfo.clearDb());
    mapControl.on("selectFeature", (ft) => objControl.showInfo({obj: ft, count: mapInfo.getCount(), selectOnMap: false}));

    // objControl
    objControl.on("getObjectPosition", (uid) => mapInfo.getObjectPosition(uid));
    objControl.on("getPrevObject", (uid) => mapInfo.getPrevObject(uid));
    objControl.on("getNextObject", (uid) => mapInfo.getNextObject(uid));
    objControl.on("prev", (uid) => objControl.showInfo({obj: mapInfo.getPrevObject(uid)}));
    objControl.on("next", (uid) => objControl.showInfo({obj: mapInfo.getNextObject(uid)}));
    objControl.on("changeObject", (obj) => mapInfo.changeObjectFromClient(obj));
    objControl.on("selectObject", (obj) => {
        mapControl.selectObject(obj);
        let dataObj = mapInfo.getObject(obj.uid);
        dataControl.showInfo(dataObj);
    });
    objControl.on("deleteObject", (obj => mapInfo.deleteFromClient(obj)));

    // dataControl
    dataControl.on("changeObject", (obj) => mapInfo.changeObjectFromClient(obj));

    var something = document.getElementById('content');
    something.style.cursor = 'pointer';

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