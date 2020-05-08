"use strict";

window.app = {};
var app = window.app;

function startApp() {

}

var onClickDropDownFirst = function(d) {
    addAircrafts.addAircraft("firstElement",d);
    var b = document.getElementById("firstDropDown").getElementsByTagName("button")[0];
    b.innerHTML=d.Brand;
}
var onClickDropDownSecond = function(d) {
    addAircrafts.addAircraft("secondElement",d);
    var b = document.getElementById("secondDropDown").getElementsByTagName("button")[0];
    b.innerHTML=d.Brand;    
}

$(document).ready(function () {

    var url = "data/aircrafts.json";

    d3.json(url, function(error, data) {
        if (error) console.log(error);
        addComboBoxFromJson.addBootstrapDropDown(
          data,
          'dropDownListSubMenuFirst',
          'ID',
          'Brand',
          onClickDropDownFirst
        );
        addComboBoxFromJson.addBootstrapDropDown(
            data,
            'dropDownListSubMenuSecond',
            'ID',
            'Brand',
            onClickDropDownSecond
          );
          onClickDropDownFirst(data[0]);
          onClickDropDownSecond(data[0]);
    });
    
});

function addEvent(evnt, elem, func) {
    if (elem.addEventListener)  // W3C DOM
    {
        elem.addEventListener(evnt, func, false);
        //console.log('addeventlistener');
    }
    else if (elem.attachEvent) { // IE DOM
        elem.attachEvent("on" + evnt, func);
        //console.log('attackEvent');
    }
    else { // No much to do
        elem["on" + evnt] = func;
    }
}

addEvent('load', window, startApp);