const kremlinLocation = new ol.proj.fromLonLat([37.617499, 55.752023]); //moscow kremlin

class MapControl {

    _getYearLayerUrl (tileCoord, pixelRatio, projection) {

        let ano = this.currentYearForMap;
        var anow = "" + ano;
        anow = anow.replace("-", "B");

        let z = tileCoord[0];
        let x = tileCoord[1];
        let y = -tileCoord[2] - 1;

        if (0 == z || z > 6)
            return;

        let url = "http://cdn.geacron.com" + "/tiles/area/" + anow + "/Z" + z + "/" + y + "/" + x + ".png";
        return url;
    }

    constructor(protocol) {

        this.protocol = protocol;
        this.socket = protocol.getSocket();

        let fileImportElem = document.getElementById('fileImport');
        fileImportElem.onchange = (filePath) => {
            this._importFile(fileImportElem.files[0]);
        };

        let rasterLayer = new ol.layer.Tile({
            opacity: 1,
            zIndex: 0,
            source: new ol.source.OSM()
        });

        let vectorSource = new ol.source.Vector();
        let vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            zIndex: 2,
            style: (feature, resolution) => {
                return this._getStyleFunction.call(this, feature, resolution);
            },
            updateWhileAnimating: true,
            updateWhileInteracting: true,
        });

        let vectorSource2 = new ol.source.Vector();
        let vectorLayer2 = new ol.layer.Vector({
            source: vectorSource2,
            zIndex: 3,
            style: (feature, resolution) => {
                return this._getStyleFunction.call(this, feature, resolution);
            },
            updateWhileAnimating: true,
            updateWhileInteracting: true,
        });


        let view = new ol.View({
            center: new ol.proj.fromLonLat([56.004 , 54.6950]), //ufa place
            //zoom: 18
            //center: kremlinLocation,
            zoom: 3,
            //projection: 'EPSG:4326'
        });

        const map = new ol.Map({
            controls: ol.control.defaults({ attribution: false, zoom: false }).extend([
                new ol.control.FullScreen()
            ]),
            layers: [rasterLayer, vectorLayer, vectorLayer2],
            target: 'map',
            view: view
        });

        map.on('click', function(evt) {
            let coordinates = evt.coordinate;
            let lonLatCoords = new ol.proj.toLonLat(coordinates);
            console.log('clicked on map with coordinates: ' + coordinates + '; WGS: ' + lonLatCoords);
        });

        this.map = map;
        this.vectorSource = vectorSource;
        this.vectorSource2 = vectorSource2;
        this.firstFeature = undefined;

        this.eventComponent = $("#eventList")[0];

        this.currentYear = this.currentYearForMap = 1939;

        this.view = view;
        this.draw = undefined;
        this.snap = undefined;
        this.dragBox = {};
        this.addFeatureEnabled = true;
        this.clearDbFn = () => {};
        this.changeFeaturesFn = () => {};
        this.selectFn = () => {};
        this.changeYearFn = () => {};
        this.getCurrentCountryFn = () => {};
        this.activeButton = undefined;

        this.maxExtent = {left: -20037508.3, top: -20037508.3, right: 20037508.3, bottom: 20037508.3};
        this.maxResolution = 156543.0339;
        this.tileSize = {w: 256, h: 256};

        setTimeout(() => {
            this._addSelectInteraction();
            this._addYearLayer();
            this._addEventsLayer();
            this._addButtons();
            this._addYearControl();
            this._initSocket();
        }, 10);
    }

    static create(protocol) {
        return new MapControl(protocol);
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
            case("changeYear"):
                this.changeYearFn = cb;
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

    _initSocket() {
        this.socket.on('srvAsnwerEvents', (msg) => {
            console.log(msg);
        });
    }

    _addYearLayer() {
        var yearLayer = new ol.layer.Tile({
            preload: 5,
            opacity: 0.2,
            zIndex: 2,
            source:  new ol.source.XYZ({
                tileUrlFunction: (tileCoord, pixelRatio, projection) => { return this._getYearLayerUrl.call(this, tileCoord, pixelRatio, projection) }
            })
        });

        this.yearLayer = yearLayer;
        this.map.addLayer(yearLayer);
    }

    _addEventsLayer() {
        let eventsSource = new ol.source.Vector();
        let eventsLayer = new ol.layer.Vector({
            source: eventsSource,
            zIndex: 5,
            updateWhileAnimating: true,
            updateWhileInteracting: true,
        });
        this.eventsSource = eventsSource;
        this.map.addLayer(eventsLayer);
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

    _importFile(filePath) {
        let reader = new FileReader();
        reader.onload = (e) => {
            let contents = reader.result;
            let lines = contents.split('\n');
            let jsonFromFile = JSON.parse(lines);

            // let vectorLayer = new ol.layer.Vector({
            //     source: new ol.source.Vector({
            //       url: contents,
            //       format: new ol.format.KML()
            //     })
            // });

            for (let i = 0; i < jsonFromFile.features.length; i++) {
                let fj = jsonFromFile.features[i].geometry;
                var coords = [];
                if ('Point' === fj.type) {
                    coords = new ol.proj.fromLonLat(fj.coordinates);
                } else {
                    let srcCoords = ('Polygon' === fj.typ) ? fj.coordinates[0] : fj.coordinates;
                    for (let j = 0; j < srcCoords.length; j++) {
                        let point = new ol.proj.fromLonLat(srcCoords[j]);
                        coords.push(point);
                    }
                }
                let ft = new ol.Feature({uid: 100, name: 'test', geometry: this._createGeom({kind: fj.type, coords: coords})});
                this.vectorSource2.addFeature(ft);
            };
        }
        reader.readAsText(filePath);

        console.log(filePath);
    }

    selectObject(obj) {
        this.addFeatureEnabled = false;
        let features = this.vectorSource.getFeatures();
        for (let i = 0; i < features.length; i++) {
            let ft = features[i];
            if (obj.uid == ft.getId()) {
                this.select.getFeatures().clear();
                this.select.getFeatures().push(ft);
                //this._doCenterView(ft);
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

    deletePointsFromVS2(evt) {
        console.log('deletePointsFromVS2');
        this.vectorSource2.clear();
        this._addPointToVS2(this.firstFeature)
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
            let ft = new ol.Feature({id: mo[i].uid, geometry: this._createGeom(mo[i]), name: mo[i].name, country: mo[i].country});
            ft.setId(mo[i].uid); //засунул передачу всех свойств в верхнюю строку, в метод ol.Feature

            this.vectorSource.addFeature(ft);
        };
        this.addFeatureEnabled = true;
    }

    _addDragBoxToMap(obj) {

        let p1 = [obj.start.x, obj.start.y];
        let p2 = [obj.end.x, obj.start.y];
        let p3 = [obj.end.x, obj.end.y];
        let p4 = [obj.start.x, obj.end.y];

        this._addPointToVS2( p1 );
        this._addPointToVS2( p2 );
        this._addPointToVS2( p3 );
        this._addPointToVS2( p4 );

        this._addLineToVS2( [p1, p2, p3, p4, p1] );
    }

    _addPointToVS2(p) {
        return this.vectorSource2.addFeature( new ol.Feature({geometry: this._createGeom({kind: "Point", coords: p})}) );
    }

    _addLineToVS2(p) {
        console.log('addPolygon to VS2: ' + p )
        this.vectorSource2.addFeature( new ol.Feature({geometry: this._createGeom({kind: "Polygon", coords: [p]})}) );
    }


    clearMap() {
        this.vectorSource.clear();
    }

    _doCenterView(ft) {
        this.map.getView().animate({
            center: this._getCenterCoord(ft),
            duration: 300
        });
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

    _addYearControl() {
        this.map.addControl(new YearControl({
            caption: "Выбрать год событий",
            year: this.currentYear,
            handler: (year) => {
                this._changeYear(year);
            },
        }));
    }

    _changeYear(year) {
        this.currentYear = year;
        this.currentYearForMap = (this.currentYear == 1951) ? 1950 : this.currentYear;
        this.yearLayer.getSource().refresh();

        this.socket.emit('clQueryEvents', JSON.stringify({year: this.currentYear}), (msg) => {
            let data = JSON.parse(msg);
            console.log(JSON.stringify(data));
            this._showCurrentEvents(data);
        });
    }

    _hexToRgbA(hex, opacity){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return [(c>>16)&255, (c>>8)&255, c&255, opacity ? opacity : 0];
        }
        throw new Error(`Bad Hex ${hex}`);
    }

    _showEventsOnMap(events) {
        events.forEach((event) => {
            let features = event.features;
            for (let i = 0; i < features.length; i++) {
                let geom = features[i].geometry;
                let style_prop = features[i].properties;
                let style = {};
                if (style_prop.fill) {
                    style.fill = new ol.style.Fill({
                        color: this._hexToRgbA(style_prop.fill, style_prop['fill-opacity'])
                    });
                }
                if (style_prop.stroke) {
                    style.stroke = new ol.style.Stroke({
                        color: this._hexToRgbA(style_prop.stroke, style_prop['stroke-opacity']),
                        width: style_prop['stroke-width']
                    });
                };
                var coords = [];
                if ('Point' === geom.type) {
                    coords = new ol.proj.fromLonLat(geom.coordinates);
                } else {
                    let srcCoords = ('Polygon' === geom.type) ? geom.coordinates[0] : geom.coordinates;
                    for (let j = 0; j < srcCoords.length; j++) {
                        let point = new ol.proj.fromLonLat(srcCoords[j]);
                        coords.push(point);
                    }
                    if ('Polygon' === geom.type) {
                        coords = [coords];
                    }
                }
                let ft = new ol.Feature({
                    uid: 100,
                    name: 'test',
                    geometry: this._createGeom({kind: geom.type, coords: coords}
                )});
                console.log(JSON.stringify(style));
                ft.setStyle(new ol.style.Style(style));
                this.eventsSource.addFeature(ft);
            };
        });
    }

    _showEventsOnPanel(events, listComponent) {
        let html = '';
        events.forEach(event => {
            let date = new Date(event.startDate);
            date = ('0' + date.getDate()).slice(-2) + '.'
             + ('0' + (date.getMonth()+1)).slice(-2) + '.'
             + date.getFullYear();
            html += `<span>${date}</span> ${this.protocol.getDictName(event._name)}<br>`;
        });
        if ('' != html) {
            this.eventComponent.innerHTML = html;
        }
    }

    _showCurrentEvents(data) {
        this.eventsSource.clear();
        this.eventComponent.innerHTML = '';

        if (!data || !data.hasOwnProperty('events')) return;

        let events = data.events;
        this._showEventsOnMap(events);
        this._showEventsOnPanel(events);
    }

    _addButtons() {
        this.map.addControl(new CustomControl({
            caption: "Выбрать объект",
            class: "pointer-control",
            icon: "mdi mdi-cursor-default-outline",
            default: true,
            handler: (btn) => {
                this._setActiveButton(btn);
                this.map.removeInteraction(this.draw);
                this.map.removeInteraction(this.snap);
            }
        }));

        return; //soli
        this.map.addControl(new CustomControl({
            caption: "Рисовать связанные отрезки",
            class: "polyline-control",
            icon: "mdi mdi-vector-polyline",
            handler: (btn) => {
                this._setActiveButton(btn);
                this._addInteraction("LineString");
            },
        }));

        // каждый объект имеет свою логику работы с vectorsource
        // каждый объект сам настраивает события мыши
        // каждый объект сам получает доступ к объектам карты и к окружению
        // они используют глобальный объект, который сначала сбрасывают в состояние нуля?


        this.map.addControl(new CustomControl({
            caption: "Рисовать замкнутый контур",
            class: "polygon-control",
            icon: "mdi mdi-vector-polygon",
            handler: (btn) => {
                this._setActiveButton(btn);
                this._addInteraction("Polygon");
            },
        }));

        this.map.addControl(new CustomControl({
            caption: "Добавить точку на карту",
            class: "point-control",
            icon: "mdi mdi-circle-outline",
            handler: (btn) => {
                this._setActiveButton(btn);
                this._addInteraction("Point");
            },
        }));

        /*
        this.map.addControl(new CustomControl({
            caption: "Изображение",
            class: "image-control",
            icon: "mdi mdi-image",
            handler: (btn) => {
                this._setActiveButton(btn);
                this._addInteraction("Image");
            },
        }));
        */

        this.map.addControl(new CustomControl({
            caption: "Выбрать элементы на карте",
            class: "box-control",
            icon: "mdi mdi-select",
            handler: (btn) => {
                console.log('click to handler\'s boxcontrol');
                this._setActiveButton(btn);
                this._addInteraction("BoxControl");
            }
        }));

        this.map.addControl(new CustomControl({
            caption: "Импортировать объекты из geojson-файла",
            class: "box-control",
            icon: "mdi mdi-import",
            handler: (btn) => {
                console.log('click to import...');
                this._setActiveButton(btn);
                document.getElementById('fileImport').click();
            }
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

    _setActiveButton(btn) {
        if (this.activeButton) {
            $(this.activeButton).removeClass('glow-button');
        }

        this.activeButton = btn;
        $(btn).addClass('glow-button');
    }

    _addInteraction(type) {
        this.map.removeInteraction(this.draw);
        this.map.removeInteraction(this.snap);

        if ("Image" == type) {

            this.draw = new ol.interaction.DragBox({
                source: this.vectorSource2
            });

            this.draw.on('boxstart', (ev) => {
                console.log('boxstart: ' + ev.coordinate);
                this.firstFeature = ev.coordinate;

                this.dragBox = {};
                this.dragBox["start"] = {"x": ev.coordinate[0], "y": ev.coordinate[1]};
            });

            this.draw.on('boxend', (ev) => {
                this.dragBox["end"] = {"x": ev.coordinate[0], "y": ev.coordinate[1]};
                this._addDragBoxToMap(this.dragBox);
            });

            this.map.addInteraction(this.draw);
            this.snap = new ol.interaction.Snap({ source: this.vectorSource2 });
            this.map.addInteraction(this.snap);
            return;
        }
        else if ("BoxControl" == type) {

            this.draw = new ol.interaction.Draw({
                source: this.vectorSource2,
                type: 'Circle',
                geometryFunction: ol.interaction.Draw.createBox()
            });

            this.draw.on('change', (ev) => {
                console.log('change event');
            });

            this.map.addInteraction(this.draw);
            this.snap = new ol.interaction.Snap({ source: this.vectorSource2 });
            this.map.addInteraction(this.snap);
            return;

        } else {

            this.draw = new ol.interaction.Draw({
                source: this.vectorSource,
                type: type,
                //freehand: true
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

        }

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

class SuperCustomControl extends ol.control.Control {
    constructor(inputParams) {
        super(inputParams);
    }

    getBSIconHTML(name) {
        return '<span class="' + name + '"></span>';
    }
}

class CustomControl extends SuperCustomControl {

    constructor(inputParams) {

        super(inputParams);

        const caption = get(inputParams, 'caption');
        const hint = get(inputParams, 'hint') || caption;
        let button = document.createElement('button');
        button.innerHTML = this.getBSIconHTML(get(inputParams, 'icon'));
        button.className = get(inputParams, 'class');
        button.title = hint;

        let parentDiv = $('#custom-control')[0];
        if (!parentDiv) {
            parentDiv = document.createElement('div');
            parentDiv.className = 'ol-control';
            parentDiv.setAttribute("id", 'custom-control');
        }

        parentDiv.appendChild(button);
        this.element = parentDiv;

        ol.control.Control.call(this, {
            label: caption,
            hint: hint,
            tipLabel: caption,
            element: parentDiv,
            //target: get(inputParams, "target")
        });

        const handler = get(inputParams, 'handler');
        if (handler) {
            button.addEventListener('click', () => { handler(button); }, false);
            button.addEventListener('touchstart', () => { handler(button) }, false);
        }

        const isDefault = get(inputParams, 'default');
        if (isDefault) {
            handler(button);
        }
    }
}

class YearControl extends SuperCustomControl {
    constructor(inputParams) {

        super(inputParams);

        const caption = get(inputParams, 'caption');
        const hint = get(inputParams, 'hint') || caption;
        this.year = get(inputParams, 'year');
        this.handler = get(inputParams, 'handler');

        let yearInput = document.createElement('input');
        yearInput.className = 'input-without-focus';
        yearInput.title = hint;
        yearInput.setAttribute('id', 'year-input');
        yearInput.value = this.year;
        yearInput.addEventListener('keyup', (event) => { if (event.keyCode == 13) { this._inputKeyUp(); event.preventDefault(); } });

        this.yearInput = yearInput;

        let yearLeftButton = document.createElement('button');
        yearLeftButton.innerHTML = this.getBSIconHTML('mdi mdi-step-backward-2');
        yearLeftButton.title = 'Предыдущий год';
        yearLeftButton.setAttribute('id', 'year-left-button');
        yearLeftButton.addEventListener('click', () => { this._leftButtonClick(); }, false);
        yearLeftButton.addEventListener('touchstart', () => { this._leftButtonClick(); }, false);

        let yearRightButton = document.createElement('button');
        yearRightButton.innerHTML = this.getBSIconHTML('mdi mdi-step-forward-2');
        yearRightButton.title = 'Следующий год';
        yearRightButton.setAttribute('id', 'year-right-button');
        yearRightButton.addEventListener('click', () => { this._rightButtonClick(); }, false);
        yearRightButton.addEventListener('touchstart', () => { this._rightButtonClick(); }, false);

        let parentDiv = document.createElement('div');
        parentDiv.className = 'ol-control';
        parentDiv.setAttribute('id', 'year-control');

        parentDiv.appendChild(yearLeftButton);
        parentDiv.appendChild(yearInput);
        parentDiv.appendChild(yearRightButton);

        this.element = parentDiv;

        ol.control.Control.call(this, {
            label: "test",
            hint: "test",
            tipLabel: caption,
            element: parentDiv,
            //target: get(inputParams, "target")
        });
    }

    _leftButtonClick() {
        if (!this._checkYear(this.year, -1))
            return;

        this.year = parseInt(this.year) - 1;
        this._setNewYear(this.year);

        this.handler(this.year);
    }

    _rightButtonClick() {
        if (!this._checkYear(this.year, +1))
            return;

        this.year = parseInt(this.year) + 1;
        this._setNewYear(this.year);

        this.handler(this.year);
    }

    _inputKeyUp() {

        let year = this.yearInput.value;

        if (!this._checkYear(year, 0, this.year)) {
            this.yearInput.value = this.year;
            return;
        }

        this.year = parseInt(year);
        this._setNewYear(this.year);

        this.handler(this.year);
    }

    _checkYear(year, incr, oldValue = undefined) {

        var reg = /^[1][9]\d{2}$/;
        if (!reg.test(year))
            return false;

        let intYear = parseInt(year) + incr;
        if (intYear < 1933)
            return false;
        if (intYear > 1955)
            return false;

        if (oldValue == intYear)
            return false;

        return true;
    }

    _setNewYear(year) {
        this.yearInput.value = this.year;
    }
}