
"use strict";

window.app = {};
var app = window.app;
//////////////////////////////////////////////////
console.log('1');
function startApp() {
    console.log('2');
    var persons = new addPersons("persons-table", "data/persons.json");
    persons.clearTable();
    console.log('3');
    persons.fillTable();
}

/////////////////////////////////////////////////
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