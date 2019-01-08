"use strict";

window.app = {};
var app = window.app;

function fixMapHeight(){
    var viewHeight = $(window).height();
    //var header = $("div[data-role='header']:visible:visible");
    var navbar = $("nav[data-role='navbar']:visible:visible");
    var mapDiv = $("div[data-role='map']:visible:visible");
    var mapHeight = viewHeight - navbar.outerHeight() - 1; // - header.outerHeight();
    mapDiv.height(mapHeight);
    if (window.map)
        window.map.fixMapHeight();
}

function changeWindowSize() {
    fixMapHeight();
}

window.onresize = changeWindowSize;

function startApp() {

    let protocol = ClientProtocol.create();

    let mapControl = MapControl.create();
    mapControl.subscribe('changeYear', (year) => {
        protocol.getHistoryEventsByYear(year);
    });

    let historyEventsControl = HistoryEventsControl.create();

    protocol.subscribe('refreshHistoryEvents', (events) => {
        historyEventsControl.showEvents(events);
    });

    historyEventsControl.subscribe('refreshedEventList', () => {
        $('table tr').click(function(){
            historyEventsControl.rowEventClick( $(this) );
            return false;
        });

        $('table tr td span').click(function(){
            historyEventsControl.mapEventClick( $(this) );
            return false;
        });
    });

    historyEventsControl.subscribe('activatedEvent', (data) => {
        mapControl.showEventOnMap(data.map);
    });

    window.map = mapControl;

    // var something = document.getElementById('content');
    // something.style.cursor = 'pointer';

    $(document.getElementsByClassName('ol-attribution ol-unselectable ol-control ol-collapsed')).remove();

    changeWindowSize();
}