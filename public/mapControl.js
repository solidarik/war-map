const kremlinLocation = new ol.proj.fromLonLat([37.617499, 55.752023]); //moscow kremlin

class MapControl extends EventEmitter {

    constructor() {

        super();

        let rasterLayer = new ol.layer.Tile({
            opacity: 1,
            zIndex: 0,
            source: new ol.source.OSM()
        });

        let view = new ol.View({
            center: new ol.proj.fromLonLat([56.004 , 54.6950]), //ufa place
            //center: kremlinLocation,
            zoom: 3,
            //projection: 'EPSG:4326'
        });

        const map = new ol.Map({
            controls: ol.control.defaults({ attribution: false, zoom: false }).extend([
                //new ol.control.FullScreen()
            ]),
            layers: [rasterLayer],
            target: 'map',
            view: view
        });

        map.on('click', function(evt) {
            let coordinates = evt.coordinate;
            let lonLatCoords = new ol.proj.toLonLat(coordinates);
            console.log('clicked on map with coordinates: ' + coordinates + '; WGS: ' + lonLatCoords);
        });

        this.map = map;

        this.view = view;
        this.draw = undefined;
        this.snap = undefined;
        this.dragBox = {};
        this.addFeatureEnabled = true;

        this.activeButton = undefined;

        this.maxExtent = {left: -20037508.3, top: -20037508.3, right: 20037508.3, bottom: 20037508.3};
        this.maxResolution = 156543.0339;
        this.tileSize = {w: 256, h: 256};

        setTimeout(() => {
            //this._addSelectInteraction();
            this._addYearLayer();
            this._addHistoryEventsLayer();
            this._changeYear(1939);
            this._addYearControl();
            // this._addButtons();
        }, 10);
    }

    static create() {
        return new MapControl();
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

    _addHistoryEventsLayer() {
        let historyEventsSource = new ol.source.Vector();
        let historyEventsLayer = new ol.layer.Vector({
            source: historyEventsSource,
            zIndex: 5,
            updateWhileAnimating: true,
            updateWhileInteracting: true,
        });
        this.historyEventsSource = historyEventsSource;
        this.map.addLayer(historyEventsLayer);
    }

    fixMapHeight() {
        this.map.updateSize();
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

    _getYearLayerUrl (tileCoord, pixelRatio, projection) {

        if (!this.currentYearForMap)
            return;

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
        this.historyEventsSource.clear();
        this.currentYear = year;
        this.currentYearForMap = (this.currentYear == 1951) ? 1950 : this.currentYear;
        this.yearLayer.getSource().refresh();
        this.emit('changeYear', year);
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

    showEventOnMap(map) {
        this.historyEventsSource.clear();

        let features = map.features;
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
            ft.setStyle(new ol.style.Style(style));
            this.historyEventsSource.addFeature(ft);
        };
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

    _setActiveButton(btn) {
        if (this.activeButton) {
            $(this.activeButton).removeClass('glow-button');
        }

        this.activeButton = btn;
        $(btn).addClass('glow-button');
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
        //yearLeftButton.addEventListener('touchstart', () => { this._leftButtonClick(); }, false);

        let yearRightButton = document.createElement('button');
        yearRightButton.innerHTML = this.getBSIconHTML('mdi mdi-step-forward-2');
        yearRightButton.title = 'Следующий год';
        yearRightButton.setAttribute('id', 'year-right-button');
        yearRightButton.addEventListener('click', () => { this._rightButtonClick(); }, false);
        //yearRightButton.addEventListener('touchstart', () => { this._rightButtonClick(); }, false);

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
    }

    _rightButtonClick() {
        if (!this._checkYear(this.year, +1))
            return;

        this.year = parseInt(this.year) + 1;
        this._setNewYear(this.year);
    }

    _inputKeyUp() {

        let year = this.yearInput.value;

        if (!this._checkYear(year, 0, this.year)) {
            this.yearInput.value = this.year;
            return;
        }

        this.year = parseInt(year);
        this._setNewYear(this.year);
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
        this.handler(this.year);
    }
}