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

$.fn.exists = function () {
    return this.length !== 0;
}

function loadMap() {    
    
    var rasterLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    var vectorSource = new ol.source.Vector();    
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 0, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ff0000',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({
                    color: '#0000ff'
                })
            })
        })
    });    
    
    const map = new ol.Map({
        controls: ol.control.defaults().extend([
            new ol.control.FullScreen()            
          ]),
        layers: [rasterLayer, vectorLayer],
        target: 'map',
        view: new ol.View({
            //center: new ol.proj.fromLonLat([56.004 , 54.6950]), //ufa place
            //zoom: 18
            center: new ol.proj.fromLonLat([37.617499, 55.752023]), //moscow kremlin
            zoom: 2
        })
    });    

    var modify = new ol.interaction.Modify({ source: vectorSource });
    map.addInteraction(modify);

    app.map = map;
    app.vectorSource = vectorSource;
    app.draw = null;
    app.snap = null;

    setTimeout(addButtons, 10);
    setTimeout(addDatePicker, 10);
    setTimeout(addSocketIO, 10);
}

/*
window.onresize = function(event) {
    mapResize();
};

function mapResize() {
    return; 
    var viewHeight = $(window).height();
    var navbar = $("nav[role='header']:visible:visible");
    var content = $("div[role='map']:visible:visible");
    var contentHeight = viewHeight - navbar.outerHeight() - 50;
    content.height(contentHeight);
    $("#map").updateSize();
}
*/

function getBSIconHTML(name) {
    return '<span class="' + name + '"></span>';
}

class CustomControl extends ol.control.Control {
    constructor(inputParams) {        
        super(inputParams);

        const caption = get(inputParams, 'caption');
        const hint = get(inputParams, 'hint') || caption;
        let button = document.createElement('button');
        button.innerHTML = getBSIconHTML(get(inputParams, 'icon'));
        button.className = get(inputParams, 'class');// + ' ol-unselectable ol-control';
        const handler = get(inputParams, 'handler');
        if (handler) {
            button.addEventListener('click', handler, false);
            button.addEventListener('touchstart', handler, false);
        }
        
        let parentDiv = $('#custom-control')[0];
        if (!parentDiv) {
            parentDiv = document.createElement('div');
            parentDiv.className = 'ol-unselectable ol-control';
            parentDiv.setAttribute("id", 'custom-control');
        }            
        parentDiv.appendChild(button);
        this.element = parentDiv;        
        
        ol.control.Control.call(this, {
            element: parentDiv,
            target: get(inputParams, "target")
        });
    }
}

function addButtons() {
    app.map.addControl(new CustomControl({
        caption: "Связанные отрезки",
        class: "polyline-control",
        icon: "mdi mdi-vector-polyline",
        handler: () => { addInteraction("Polygon"); },
    }));
    
    app.map.addControl(new CustomControl({
        caption: "Точки",        
        class: "point-control",
        icon: "mdi mdi-circle-outline",
        handler: () => { addInteraction("Point"); },
    }));

    app.map.addControl(new CustomControl({
        caption: "Разработка",
        class: "debug-control",
        icon: "mdi mdi-developer-board",
        handler: () => { app.socket.emit('clClearDb', 'clear'); },
    }));
}

function addDatePicker() {
    $('#datepicker').datepicker({});
}

function addInteraction(type) {
    app.map.removeInteraction(app.draw);
    app.map.removeInteraction(app.snap);

    app.draw = new ol.interaction.Draw({
        source: app.vectorSource,
        type: type
    });
    app.map.addInteraction(app.draw);
    app.snap = new ol.interaction.Snap({ source: app.vectorSource });
    app.map.addInteraction(app.snap);
}

function featureToJson(ft) {
    let json = {
        "type": ft.getGeometry().getType(),            
        "coords": ft.getGeometry().getCoordinates()
    };

    return json;
}

function getJsonOfVectorObjects() {
    let json = {};
    if (!app.vectorSource) return json;

    let features = [];
    app.vectorSource.getFeatures().forEach(feature => {
        features.push(featureToJson(feature));
    });

    app.vectorLayer.getFeatures().on()

    json = {"features": features};
    return json;
}

function debug() {
    console.log(JSON.stringify(getJsonOfVectorObjects()));
}

function addSocketIO() {
    const socket = io();

    function showStatus(status, message) {
        console.log(status, message);
    }

    socket.on('error', function(message) {
        console.error(message);
        showStatus('error', message);
      });

    socket.on('logout', function(data) {
      socket.disconnect();
      window.location.reload();
    })

    socket.on('srvFeatures', (data) => {
        app.addFeatureEnabled = false;
        let json = JSON.parse(data);
        json.features.forEach( ft => {
            let geom;
            switch(ft.kind) {
                case 'Point':
                    geom = new ol.geom.Point(ft.coords);
                    break;
                case 'Polygon':
                    geom = new ol.geom.Polygon(ft.coords);
                    break;
            }
            app.vectorSource.addFeature(new ol.Feature({geometry: geom}));
        });
        app.addFeatureEnabled = true;
    }); 

    socket.on('srvClearDb', (msg) => {
        if ('cleared' == msg) {
            app.vectorSource.clear();
        }
    });

    app.vectorSource.on('addfeature', (event) => {
        if (!app.addFeatureEnabled) return;
        socket.emit('clAddFeature', JSON.stringify(featureToJson(event.feature)));
    });

    socket.on('welcome', (msg) => console.log(msg));

    app.socket = socket;
}