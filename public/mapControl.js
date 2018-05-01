class MapControl {
    constructor() {
        let rasterLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

        let vectorSource = new ol.source.Vector();
        let vectorLayer = new ol.layer.Vector({
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
                zoom: 3
            })
        });    

        var modify = new ol.interaction.Modify({ source: vectorSource });
        map.addInteraction(modify);
        
        modify.on('modifyend',  function(e) {
            if (!this.changeFeaturesFn || (0 == e.features.getArray().length)) {
                return;
            }

            let mapObjects = [];
            for(let i = 0; i < e.features.getArray().length; i++) {
                let ft = e.features.getArray()[i];
                mapObjects.push(this._getMapObjectFromFeature(ft));
            };            

            this.changeFeaturesFn(mapObjects);
        }, this);

        this.map = map;
        this.vectorSource = vectorSource;
        this.draw = null;
        this.snap = null;
        this.addFeatureEnabled = true;
        this.clearDbFn = undefined;
        this.changeFeaturesFn = undefined;
        this.selectFn = undefined;

        setTimeout(() => {
            this._addButtons();
            //this._addSelectInteraction();
        }, 10);        
    }

    static create() {
        return new MapControl();
    }

    on(event, cb) {        
        switch(event) {
            case("addFeature"):
                this.vectorSource.on('addfeature', (event) => {                    
                    if (!this.addFeatureEnabled)
                        return;
                            
                    let mo = this._createMapObjectByFeature(event.feature);
                    event.feature.setId(mo.uid);
                    cb( mo );
                });
            break;
            case("selectFeature"):
                this.selectFn = cb;
            break;
            case("clearMap"):
                this.clearDbFn = cb;
            break;
            case("changeFeatures"):
                this.changeFeaturesFn = cb;
            break;            
        }        
    }

    _getMapObjectFromFeature(ft) {
        return {
            "kind": ft.getGeometry().getType(),
            "coords": ft.getGeometry().getCoordinates(),
            "uid": ft.getId()
        };
    }

    _createMapObjectByFeature(ft) {
        return {
            "kind": ft.getGeometry().getType(),            
            "coords": ft.getGeometry().getCoordinates(),
            "uid": this._createUid()
        };
    }

    _createUid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    changeObjectInMap(mo) {
        this.addFeatureEnabled = false;
        let features = this.vectorSource.getFeatures();
        for (let i = 0; i < features.length; i++) {
            let ft = features[i];            
            if (mo.uid == ft.getId()) {
                ft.setGeometry(this._createGeom(mo));
                break;            
            }
        };
        this.addFeatureEnabled = true;
    }

    addObjectToMap(mapObj) {
        this.addFeatureEnabled = false;
        //data.mapObjects.forEach( mapObj => {
            let geom = this._createGeom(mapObj);            
            let ft = new ol.Feature({geometry: geom});
            ft.setId(mapObj.uid);
            
            this.vectorSource.addFeature(ft);
        //});
        this.addFeatureEnabled = true;        
    }

    clearMap() {
        this.vectorSource.clear();
    }

    _createGeom(mo) {
        let geom;
        switch(mo.kind) {
            case 'Point':
                geom = new ol.geom.Point(mo.coords);
                break;
            case 'LineString':
                geom = new ol.geom.LineString(mo.coords);
                break;
            case 'Polygon':
                geom = new ol.geom.Polygon(mo.coords);
                break;
        }
        return geom;
    }

    _addButtons() {
        this.map.addControl(new CustomControl({
            caption: "Выбрать объект",
            class: "select-control",
            icon: "mdi mdi-cursor-default-outline",
            handler: () => { 
                console.log("select control");
            },
        }));

        this.map.addControl(new CustomControl({
            caption: "Связанные отрезки",
            class: "polyline-control",
            icon: "mdi mdi-vector-polyline",
            handler: () => { this._addInteraction("LineString"); },
        }));

        this.map.addControl(new CustomControl({
            caption: "Замкнутый контур",
            class: "polygon-control",
            icon: "mdi mdi-vector-polygon",
            handler: () => { this._addInteraction("Polygon"); },
        }));
        
        this.map.addControl(new CustomControl({
            caption: "Точки",        
            class: "point-control",
            icon: "mdi mdi-circle-outline",
            handler: () => { this._addInteraction("Point"); },
        }));        
    }
    
    _addInteraction(type) {
        this.map.removeInteraction(this.draw);
        this.map.removeInteraction(this.snap);
    
        this.draw = new ol.interaction.Draw({
            source: this.vectorSource,
            type: type
        });
        this.map.addInteraction(this.draw);
        this.snap = new ol.interaction.Snap({ source: this.vectorSource });
        this.map.addInteraction(this.snap);
    }

    _addSelectInteraction() {
        let select = new ol.interaction.Select();
        this.map.addInteraction(select);
        select.on('select', (e) => {
            if (!this.selectFn || (0 == e.features.getArray().length)) {
                return;
            }

            let mapObjects = [];
            for(let i = 0; i < e.features.getArray().length; i++) {
                let ft = e.features.getArray()[i];
                mapObjects.push(this._getMapObjectFromFeature(ft));
            };            

            this.selectFn(mapObjects);          
        });
    }
}

class CustomControl extends ol.control.Control {
    
    constructor(inputParams) {        
        
        super(inputParams);

        const caption = get(inputParams, 'caption');
        const hint = get(inputParams, 'hint') || caption;
        let button = document.createElement('button');
        button.innerHTML = this.getBSIconHTML(get(inputParams, 'icon'));
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

    getBSIconHTML(name) {
        return '<span class="' + name + '"></span>';
    }
}