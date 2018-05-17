const kremlinLocation = new ol.proj.fromLonLat([37.617499, 55.752023]); //moscow kremlin

class MapControl {
    constructor() {
        let rasterLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

        let vectorSource = new ol.source.Vector();
        let vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: (feature, resolution) => {               
                return this._getStyleFunction.call(this, feature, resolution);
            }
        });

        let view = new ol.View({
            //center: new ol.proj.fromLonLat([56.004 , 54.6950]), //ufa place
            //zoom: 18
            center: kremlinLocation,
            zoom: 3
        });

        const map = new ol.Map({
            controls: ol.control.defaults({ attribution: false, zoom: false }).extend([
                new ol.control.FullScreen()            
            ]),
            layers: [rasterLayer, vectorLayer],
            target: 'map',
            view: view
        });        

        this.map = map;
        this.vectorSource = vectorSource;
        this.view = view;
        this.draw = null;
        this.snap = null;
        this.addFeatureEnabled = true;
        this.clearDbFn = () => {};
        this.changeFeaturesFn = () => {};
        this.selectFn = () => {};
        this.getCurrentCountryFn = () => {};

        setTimeout(() => {
            this._addSelectInteraction();
            this._addButtons();            
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
                    event.feature.set("country", mo.country);
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
            case("getCurrentCountry"):
                this.getCurrentCountryFn = cb;
            break;        
        }        
    }

    _getMapObjectFromFeature(ft) {
        return {
            "kind": ft.getGeometry().getType(),
            "coords": ft.getGeometry().getCoordinates(),
            "uid": ft.getId(),
            "name": ft.get("name"),
            "country": ft.get("country")
        };
    }

    _createMapObjectByFeature(ft) {
        return {
            "kind": ft.getGeometry().getType(),            
            "coords": ft.getGeometry().getCoordinates(),
            "uid": this._createUid(),
            "country": this.getCurrentCountryFn()
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

    selectObject(obj) {
        this.addFeatureEnabled = false;
        let features = this.vectorSource.getFeatures();
        for (let i = 0; i < features.length; i++) {
            let ft = features[i];            
            if (obj.uid == ft.getId()) {
                this.select.getFeatures().clear();
                this.select.getFeatures().push(ft);
                this._doCenterView(ft);
                break;
            }
        };        
        this.addFeatureEnabled = true;
    }

    changeObjectInMap(mo) {
        this.addFeatureEnabled = false;
        let features = this.vectorSource.getFeatures();
        for (let i = 0; i < features.length; i++) {
            let ft = features[i];            
            if (mo.uid == ft.getId()) {
                ft.setGeometry(this._createGeom(mo));
                ft.set("name", mo.name);
                ft.set("country", mo.country);
                break;            
            }
        };
        this.addFeatureEnabled = true;
    }
    
    deleteObjectInMap(uid) {

        let ft = this.vectorSource.getFeatureById(uid);
        this.vectorSource.removeFeature(ft);        
        this.select.getFeatures().remove(ft);        
        // return;
        // let features = this.vectorSource.getFeatures();
        // for (let i = 0; i < features.length; i++) {
        //     let ft = features[i];            
        //     if (mo.uid == ft.getId()) {
        //         this.vectorSource.removeFeatures()
        //         break;            
        //     }
        // };
    }

    addObjectToMap(mo) {
        this.addFeatureEnabled = false;
        for (let i = 0; i < mo.length; i++) {
            let geom = this._createGeom(mo[i]);            
            let ft = new ol.Feature({geometry: geom});
            ft.setId(mo[i].uid);
            ft.set("name", mo[i].name);
            ft.set("country", mo[i].country);
            
            this.vectorSource.addFeature(ft);
        };
        this.addFeatureEnabled = true;        
    }

    clearMap() {
        this.vectorSource.clear();
    }

    _doCenterView(ft) {
        this.map.getView().animate({center: this._getCenterCoord(ft)});
    }

    _getCenterCoord(ft) {
        let geom = ft.getGeometry();
        switch(geom.getType()) {
            case 'Point':
                return geom.getCoordinates();
                break;
            case 'LineString':
                return this._getMedianXY(geom.getCoordinates());
                break;
            case 'Polygon':
                return this._getMedianXY(geom.getCoordinates()[0]);
                break;
        }
        return kremlinLocation;
    }

    _getMedianXY(coords) {
        var valuesX = [];
        var valuesY = [];
        coords.forEach( (coord) => {
            valuesX.push(coord[0]);
            valuesY.push(coord[1]);
        });
        return [this._getMedian(valuesX), this._getMedian(valuesY)];
    }

    _getMedian(values) {
        values.sort( function(a,b) {return a - b;} );
    
        var half = Math.floor(values.length/2);
    
        if(values.length % 2)
            return values[half];
        else
            return (values[half-1] + values[half]) / 2.0;
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
                this.map.removeInteraction(this.draw);
                this.map.removeInteraction(this.snap);
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

    _addModify() {
        let modify = new ol.interaction.Modify({ source: vectorSource });
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

        this.map.modify = modify;
    }
    
    _addInteraction(type) {
        this.map.removeInteraction(this.draw);
        this.map.removeInteraction(this.snap);
    
        this.draw = new ol.interaction.Draw({
            source: this.vectorSource,
            type: type,
            freehand: true
        });
        
        this.draw.on ('drawstart', (e) => {
            this.select.setActive(false);
        });           
            
        this.draw.on('drawend', (e) => {
            e.preventDefault();
            setTimeout(() => { 
                this.select.setActive(true); 
            }, 300);
        });

        this.map.addInteraction(this.draw);        
        
        this.snap = new ol.interaction.Snap({ source: this.vectorSource });
        this.map.addInteraction(this.snap);
    }

    _addSelectInteraction() {
        let select = new ol.interaction.Select( {
            style: (feature, resolution) => {               
                return this._getSelectStyleFunction.call(this, feature, resolution);
            }
        });
        this.select = select;
        this.map.addInteraction(select);
        
        select.on('select', (e) => {            
            if (!this.selectFn || (0 == e.selected.length)) {
                return;
            }

            let mapObjects = [];
            for(let i = 0; i < e.selected.length; i++) {
                let ft = e.selected[i];
                mapObjects.push(this._getMapObjectFromFeature(ft));
            };            

            this.selectFn(mapObjects);          
        });
    }

    _getStyleFunction(feature, resolution) {    
        
        var stroke = new ol.style.Stroke({
            color: '#ff0000',
            width: 2
        });

        var fill = new ol.style.Fill({
            color: 'rgba(255, 255, 0, 0.2)'
        });

        var imageStyle = new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: 'red'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: 1
            })
       });

       var textColor = 'red';
                    
        switch (feature.get('country')) {
            case("germany"):
                stroke = new ol.style.Stroke({
                    color: '#000000',
                    width: 2
                });

                imageStyle = new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'black'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                    })
               });

               textColor = 'black';
                    
        }
        
        return new ol.style.Style({
            fill: fill,
            stroke: stroke,
            image: imageStyle,
            text: this._createTextStyle.call(this, feature, resolution, {
                align: 'center',
                baseline: 'middle',
                size: '14px',
                offsetX: 0,
                offsetY: 15,
                weight: 'bold',
                overflow: 'true',
                rotation: 0,
                font: 'Arial',
                color: textColor,
                outline: 'black',
                outlineWidth: 0,
                maxreso: 20000,
            })
        });
    }

    _getSelectStyleFunction(feature, resolution) {        
        return new ol.style.Style({            
            stroke: new ol.style.Stroke({                
                color: 'blue',
                width: 3
            }),
            image: new ol.style.Circle({
                 radius: 5,
                 fill: new ol.style.Fill({
                     color: 'blue'
                 }),
                 stroke: new ol.style.Stroke({
                     color: 'blue',
                     width: 1
                 })
            }),
            text: this._createTextStyle.call(this, feature, resolution, {
                align: 'center',
                baseline: 'middle',
                size: '14px',
                offsetX: 0,
                offsetY: 15,
                weight: 'bold',
                overflow: 'true',
                rotation: 0,
                font: 'Arial',
                color: 'blue',
                outline: 'yellow',
                outlineWidth: 0,
                maxreso: 20000,
            })
        });
    }

    _createTextStyle(feature, resolution, dom) {                     
        let align = dom.align;
        let baseline = dom.baseline;
        let size = dom.size;
        let offsetX = parseInt(dom.offsetX, 10);
        let offsetY = parseInt(dom.offsetY, 10);
        let weight = dom.weight;
        let placement = dom.placement ? dom.placement : undefined;
        let maxAngle = dom.maxangle ? parseFloat(dom.maxangle) : undefined;
        let overflow = dom.overflow ? (dom.overflow == 'true') : undefined;
        let rotation = parseFloat(dom.rotation);
        // if (dom.font == '\'Open Sans\'' && !openSansAdded) {
        //   let openSans = document.createElement('link');
        //   openSans.href = 'https://fonts.googleapis.com/css?family=Open+Sans';
        //   openSans.rel = 'stylesheet';
        //   document.getElementsByTagName('head')[0].appendChild(openSans);
        //   openSansAdded = true;
        // }
        let font = weight + ' ' + size + ' ' + dom.font;
        let fillColor = dom.color;
        let outlineColor = dom.outline;
        let outlineWidth = parseInt(dom.outlineWidth, 10);        

        return new ol.style.Text({
            textAlign: align == '' ? undefined : align,
            textBaseline: baseline,
            font: font,
            text: this._getText(feature, resolution, dom),
            fill: new ol.style.Fill({color: fillColor}),
            stroke: outlineWidth == 0 ? undefined : new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
            offsetX: offsetX,
            offsetY: offsetY,
            placement: placement,
            maxAngle: maxAngle,
            overflow: overflow,
            rotation: rotation
        });
    }

    _getText(feature, resolution, dom) {        
        let type = dom.text;
        let maxResolution = dom.maxreso;
        
        var text = feature.get('name');
        text = text ? text : "";

        if (resolution > maxResolution) {
            text = '';
        } else if (type == 'hide') {
            text = '';
        } else if (type == 'shorten') {
            text = text.trunc(12);
        } else if (type == 'wrap' && dom.placement != 'line') {
            text = stringDivider(text, 16, '\n');
        }

        return text;
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
            label: caption,
            tipLabel: caption,
            element: parentDiv,
            target: get(inputParams, "target")
        });
    }

    getBSIconHTML(name) {
        return '<span class="' + name + '"></span>';
    }
}