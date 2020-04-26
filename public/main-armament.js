"use strict";

window.app = {};
var app = window.app;

function startApp() {

}

$(document).ready(function () {
    $('img[usemap]').rwdImageMaps();
    $('img[usemap]').maphilight(
        // {
        //     fill: true,
        //     fillColor: '00ff00',
        //     fillOpacity: 0.6,
        //     stroke: true,
        //     strokeColor: 'ff0000',
        //     strokeOpacity: 1,
        //     strokeWidth: 1,
        //     fade: true,
        //     alwaysOn: true,
        //     neverOn: false,
        //     groupBy: false,
        //     wrapClass: true,
        //     shadow: true,
        //     shadowX: 0,
        //     shadowY: 0,
        //     shadowRadius: 6,
        //     shadowColor: '000000',
        //     shadowOpacity: 0.8,
        //     shadowPosition: 'outside',
        //     shadowFrom: false
        // }
    );
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