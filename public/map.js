"use strict";

window.app = {};
var app = window.app;

(function(globals){
    globals.get = function(obj, key) {
        return key.split(".").reduce(function(o, x) {
            return (typeof o == "undefined" || o === null) ? o : o[x];
        }, obj);
    }
}(this));

function loadMap() {    
    
    var raster = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    var source = new ol.source.Vector();
    
    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    
    
    const map = new ol.Map({
        controls: ol.control.defaults().extend([
            new ol.control.FullScreen()            
          ]),
        layers: [raster, vector],
        target: 'map',
        view: new ol.View({
            //center: new ol.proj.fromLonLat([56.004 , 54.6950]), //ufa park
            //zoom: 18
            center: new ol.proj.fromLonLat([37.617499, 55.752023]), //moscow kremlin
            zoom: 10
        })
    });
    app.map = map;

    var modify = new ol.interaction.Modify({ source: source });
    map.addInteraction(modify);

    var draw, snap; // global so we can remove them later
    var typeSelect = document.getElementById('type');

    function addInteractions() {
        draw = new ol.interaction.Draw({
            source: source,
            type: typeSelect.value
        });
        map.addInteraction(draw);
        snap = new ol.interaction.Snap({ source: source });
        map.addInteraction(snap);

    }

    typeSelect.onchange = function () {
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
    };

    addInteractions();

    setTimeout(addButtons, 10);
}

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
        const handler = get(inputParams, 'handler');
        if (handler) {
            button.addEventListener('click', handler, false);
            button.addEventListener('touchstart', handler, false);
        }
        let element = document.createElement('div');
        element.className = get(inputParams, 'class') + ' ol-unselectable ol-control';
        element.appendChild(button);
        this.element = element;
        
        ol.control.Control.call(this, {
            element: element,
            target: get(inputParams, "target")
        });
    }
}

function addButtons() {
    let customControl = new CustomControl({
            caption: "Зафиксировать север",
            class: "rotate-north",
            icon: "mdi mdi-vector-polyline",
            handler: () => { 
                console.log("hello from handler");
                //app.map.getMap().getView().setRotation(0);
            },
        });

    app.map.addControl(customControl);
}
