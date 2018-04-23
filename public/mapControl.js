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

        this.map = map;
        this.vectorSource = vectorSource;
        this.draw = null;
        this.snap = null;
        this.addFeatureEnabled = true;
        this.clearDb = undefined;

        setTimeout(() => {this._addButtons();}, 10);        
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
                    
                    cb(event.feature);
                });
                break;
            case("clearMap"):
                this.clearDb = cb;
                break;
        }        
    }    

    addObjectsToMap(data) {
        this.addFeatureEnabled = false;
        data.mapObjects.forEach( ft => {
            let geom;
            switch(ft.kind) {
                case 'Point':
                    geom = new ol.geom.Point(ft.coords);
                    break;
                case 'Polygon':
                    geom = new ol.geom.Polygon(ft.coords);
                    break;
            }
            this.vectorSource.addFeature(new ol.Feature({geometry: geom}));
        });
        this.addFeatureEnabled = true;        
    }

    clearMap() {
        this.vectorSource.clear();
    }

    _addButtons() {
        this.map.addControl(new CustomControl({
            caption: "Связанные отрезки",
            class: "polyline-control",
            icon: "mdi mdi-vector-polyline",
            handler: () => { this._addInteraction("Polygon"); },
        }));
        
        this.map.addControl(new CustomControl({
            caption: "Точки",        
            class: "point-control",
            icon: "mdi mdi-circle-outline",
            handler: () => { this._addInteraction("Point"); },
        }));
    
        this.map.addControl(new CustomControl({
            caption: "Разработка",
            class: "debug-control",
            icon: "mdi mdi-developer-board",
            handler: () => { this.clearDb(); },
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