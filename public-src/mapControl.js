// import ol from './libs/ol'
// import olExt from './libs/ol-ext.min'
import { EventEmitter } from './eventEmitter'
import convexHull from 'monotone-convex-hull-2d'
import strHelper from '../helper/strHelper'

const kremlinLocation = new ol.proj.fromLonLat([37.617499, 55.752023]) // moscow kremlin

function resizeImage(url, fixWidth, callback) {
  var sourceImage = new Image()

  sourceImage.onload = function() {
    // Create a canvas with the desired dimensions
    var canvas = document.createElement('canvas')

    let imgWidth = this.width
    let aspectRatio = Math.round(imgWidth / fixWidth)

    let imgHeight = this.height
    let fixHeight = Math.round(imgHeight / aspectRatio)

    canvas.width = fixWidth
    canvas.height = fixHeight

    // Scale and draw the source image to the canvas
    let ctx = canvas.getContext('2d')
    ctx.globalAlpha = 0.6
    ctx.drawImage(sourceImage, 0, 0, fixWidth, fixHeight)

    // Convert the canvas to a data URL in PNG format
    if (callback) callback(canvas)
  }

  return (sourceImage.src = url)
}

export class MapControl extends EventEmitter {
  constructor() {
    super()

    let rasterLayer = new ol.layer.Tile({
      opacity: 1,
      zIndex: 0,
      source: new ol.source.OSM()
    })

    let view = new ol.View({
      center: new ol.proj.fromLonLat([56.004, 54.695]), // ufa place
      // center: kremlinLocation,
      zoom: 3
      // projection: 'EPSG:4326'
    })

    const map = new ol.Map({
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      }),
      controls: ol.control
        .defaults({ attribution: false, zoom: false })
        .extend([
          // new ol.control.FullScreen()
        ]),
      layers: [rasterLayer],
      target: 'map',
      view: view
    })

    const selectedStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 2
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    })

    const select = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove,
      //      style: selectedStyle,
      multi: false
    })

    map.addInteraction(select)

    var transparent = [0, 0, 0, 0.01]
    var filltransparent = [0, 0, 0, 0]
    var transparentStyle = [
      new ol.style.Style({
        image: new ol.style.RegularShape({
          radius: 10,
          radius2: 5,
          points: 5,
          fill: new ol.style.Fill({ color: transparent })
        }),
        stroke: new ol.style.Stroke({ color: transparent, width: 1 }),
        fill: new ol.style.Fill({ color: filltransparent })
      })
    ]

    select.on('select', function(evt) {
      if (evt.selected.length) return
      const feature = evt.selected[0]

      //window.map.showEventMap(feature.get('eventMap'))
    })

    map.on('click', function(evt) {
      let coordinates = evt.coordinate
      let lonLatCoords = new ol.proj.toLonLat(coordinates)
      console.log(
        'clicked on map with coordinates: ' +
          coordinates +
          '; WGS: ' +
          lonLatCoords
      )

      let imgUrl = undefined
      let featureEvent = undefined
      const isHit = map.forEachFeatureAtPixel(evt.pixel, function(
        feature,
        layer
      ) {
        featureEvent = feature
        imgUrl = feature.get('imgUrl')
        return ['wmw', 'wow', 'politics'].indexOf(feature.get('kind')) >= 0
      })

      const isExistUrl = imgUrl !== undefined

      if (isHit && isExistUrl) {
        window.map.showEventMap(featureEvent.get('eventMap'))

        $('#imgModalLabel').html(featureEvent.get('name'))
        $('.modal-body').html(`
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        `)
        $('#imgModal').modal()

        setTimeout(() => {
          console.log('>>>>>>>> width', $('.modal-body').width())
          resizeImage(imgUrl, $('.modal-body').width(), canvas => {
            $('.modal-body').html(canvas)
          })
        }, 1000)
      }
    })

    map.on('moveend', evt => {
      var map = evt.map
      //   console.log(map.getView().getZoom());
    })

    map.on('pointermove', function(evt) {
      const isHit = map.forEachFeatureAtPixel(evt.pixel, function(
        feature,
        layer
      ) {
        if (feature === undefined || feature.get('kind') === undefined)
          return false
        return ['wmw', 'wow', 'politics'].indexOf(feature.get('kind')) >= 0
      })

      if (isHit) {
        this.getTargetElement().style.cursor = 'pointer'
      } else {
        this.getTargetElement().style.cursor = ''
      }
    })

    this.map = map
    this.historyEvents = []
    this.agreements = []

    this.view = view
    this.draw = undefined
    this.snap = undefined
    this.dragBox = {}
    this.addFeatureEnabled = true

    this.activeButton = undefined

    this.maxExtent = {
      left: -20037508.3,
      top: -20037508.3,
      right: 20037508.3,
      bottom: 20037508.3
    }
    this.maxResolution = 156543.0339
    this.tileSize = { w: 256, h: 256 }

    this.styleCache = {}

    setTimeout(() => {
      // this.addSelectInteraction()
      this.addYearLayer()
      this.addHistoryEventsLayer()
      this.addAgreementsLayer()
      // this._addButtons();
    }, 10)
  }

  static create() {
    return new MapControl()
  }

  setCurrentYearFromServer(year) {
    this.changeYear(year)
    this.addYearControl()
  }

  addYearLayer() {
    var yearLayer = new ol.layer.Tile({
      preload: 5,
      opacity: 0.2,
      zIndex: 2,
      source: new ol.source.XYZ({
        tileUrlFunction: (tileCoord, pixelRatio, projection) => {
          return this.getYearLayerUrl.call(
            this,
            tileCoord,
            pixelRatio,
            projection
          )
        }
      })
    })

    this.yearLayer = yearLayer
    this.map.addLayer(yearLayer)
  }

  getNumber(value) {
    if (value == undefined) return 0
    const tryFloat = parseFloat(value)
    const isNaN =
      typeof Number.isNaN !== 'undefined'
        ? Number.isNaN(tryFloat)
        : tryFloat !== tryFloat
        ? true
        : false
    return isNaN ? 0 : tryFloat
  }

  eventStyleFunc(feature, zoom) {
    // if (zoom > 4.5) {
    //   return [new ol.style.Style()]
    // }

    const allyTroops = this.getNumber(feature.get('ally_troops'))
    const enemTroops = this.getNumber(feature.get('enem_troops'))
    let starSize = 4

    const starSizes = [
      { count: 2500, size: 6 },
      { count: 5000, size: 8 },
      { count: 70000, size: 10 },
      { count: 100000, size: 12 },
      { count: 200000, size: 14 },
      { count: 500000, size: 16 },
      { count: 1000000, size: 18 },
      { count: 10000000000, size: 20 }
    ]

    if (allyTroops + enemTroops > 0) {
      const v = allyTroops + enemTroops
      for (let i = 0; i < starSizes.length; i++) {
        if (v < starSizes[i].count) {
          starSize = starSizes[i].size
          break
        }
      }
    }

    console.log('>>>>starSize: ', allyTroops, enemTroops, starSize)

    let style = new ol.style.Style({
      // fill: new ol.style.Fill({
      //   color: 'rgba(255,255,255,0.5)'
      // }),
      // stroke: new ol.style.Stroke({
      //   width: 2,
      //   color: 'rgba(40, 40, 40, 0.50)'
      // }),
      // text: new ol.style.Text({
      //   font: '14px helvetica,sans-serif',
      //   text: zoom > 3 ? feature.get('name') : '',
      //   fill: new ol.style.Fill({ color: 'red' }),
      //   stroke: new ol.style.Stroke({
      //     color: 'white',
      //     width: 2
      //   }),
      //   baseline: 'middle',
      //   align: 'right',
      //   offsetX: 100,
      //   offsetY: 40,
      //   overflow: 'true',
      //   // outline: 'black',
      //   outlineWidth: 0
      // }),

      image: new ol.style.RegularShape({
        fill: new ol.style.Fill(
          feature.get('kind') == 'wmw'
            ? { color: 'rgba(102,102,255,0.9 ) ' }
            : feature.get('isWinnerUSSR') == true
            ? { color: 'rgba(255,0,0,0.6)' }
            : { color: 'rgba(0,0,0,0.6)' } //black enemy
        ),
        // stroke: new ol.style.Stroke({
        //   width: 0,
        //   color: 'gray'
        // }),
        points: 5,
        radius: starSize + 2,
        radius2: Math.floor(starSize / 2),
        angle: -50
      })
    })
    return [style]
  }

  agreementStyleFunc(feature, zoom) {
    // if (zoom > 4.5) {
    //   return [new ol.style.Style()]
    // }

    let style = new ol.style.Style({
      // fill: new ol.style.Fill({
      //   color: 'rgba(255,255,255,0.5)'
      // }),
      // stroke: new ol.style.Stroke({
      //   width: 2,
      //   color: 'rgba(40, 40, 40, 0.50)'
      // }),
      // text: new ol.style.Text({
      //   font: '20px helvetica,sans-serif',
      //   text: zoom > 3 ? feature.get('name') : '',
      //   fill: new ol.style.Fill({ color: 'black' }),
      //   stroke: new ol.style.Stroke({
      //     color: 'white',
      //     width: 2
      //   }),
      //   baseline: 'middle',
      //   align: 'right',
      //   offsetX: 100,
      //   offsetY: 40,
      //   overflow: 'true',
      //   // outline: 'black',
      //   outlineWidth: 0
      // }),
      image: new ol.style.Circle({
        fill: new ol.style.Fill({ color: 'rgba(51,153,255,0.7)' }),
        // stroke: new ol.style.Stroke({
        //   width: 2,
        //   color: 'yellow'
        // }),
        // points: 3,
        radius: 7
        // angle: 0
      })
    })
    return [style]
  }

  addHistoryEventsLayer() {
    let historyEventsSource = new ol.source.Vector()
    let historyEventsLayer = new ol.layer.Vector({
      source: historyEventsSource,
      zIndex: 1,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    })
    this.historyEventsSource = historyEventsSource
    this.map.addLayer(historyEventsLayer)
    this.map.historyEventsSource = historyEventsSource

    let hullSource = new ol.source.Vector()
    let hullLayer = new ol.layer.Vector({
      source: hullSource,
      zIndex: 100,
      updateWithAnimating: true,
      updateWhileInteracting: true
    })
    this.hullSource = hullSource
    this.map.addLayer(hullLayer)

    let allHistoryEventsSource = new ol.source.Vector()
    let allHistoryEventsLayer = new ol.layer.Vector({
      source: allHistoryEventsSource,
      style: (f, _) => this.eventStyleFunc(f, this.view.getZoom()),
      zIndex: 6,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    })
    this.allHistoryEventsSource = allHistoryEventsSource
    this.map.addLayer(allHistoryEventsLayer)
  }

  addAgreementsLayer() {
    let agreementsSource = new ol.source.Vector()
    let agreementsLayer = new ol.layer.Vector({
      source: agreementsSource,
      style: (feature, _) =>
        this.agreementStyleFunc(feature, this.view.getZoom()),
      zIndex: 7,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    })
    this.agreementsSource = agreementsSource
    this.map.addLayer(agreementsLayer)
  }

  fixMapHeight() {
    this.map.updateSize()
  }

  getCenterCoord(ft) {
    let geom = ft.getGeometry()
    switch (geom.getType()) {
      case 'Point':
        return geom.getCoordinates()
        break
      case 'LineString':
        return this.getMedianXY(geom.getCoordinates())
        break
      case 'Polygon':
        return this.getMedianXY(geom.getCoordinates()[0])
        break
    }
    return kremlinLocation
  }

  getMedianXY(coords) {
    var valuesX = []
    var valuesY = []
    coords.forEach(coord => {
      valuesX.push(coord[0])
      valuesY.push(coord[1])
    })
    return [this.getMedian(valuesX), this.getMedian(valuesY)]
  }

  getMedian(values) {
    values.sort(function(a, b) {
      return a - b
    })

    var half = Math.floor(values.length / 2)

    if (values.length % 2) return values[half]
    else return (values[half - 1] + values[half]) / 2.0
  }

  getYearLayerUrl(tileCoord, pixelRatio, projection) {
    if (!this.currentYearForMap) return

    let ano = this.currentYearForMap
    var anow = '' + ano
    anow = anow.replace('-', 'B')

    let z = tileCoord[0]
    let x = tileCoord[1]
    let y = -tileCoord[2] - 1

    if (z == 0 || z > 6) return

    let url =
      'http://cdn.geacron.com' +
      '/tiles/area/' +
      anow +
      '/Z' +
      z +
      '/' +
      y +
      '/' +
      x +
      '.png'
    return url
  }

  addYearControl() {
    this.map.addControl(
      new YearControl({
        caption: 'Выбрать год событий',
        year: this.currentYear,
        handler: year => {
          this.changeYear(year)
        }
      })
    )
  }

  changeYear(year) {
    this.historyEventsSource.clear()
    this.hullSource.clear()
    this.agreementsSource.clear()
    this.currentYear = year
    this.currentYearForMap = this.currentYear == 1951 ? 1950 : this.currentYear
    this.yearLayer.getSource().refresh()
    this.emit('changeYear', year)
  }

  hexToRgbA(hex, opacity) {
    var c
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('')
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]]
      }
      c = '0x' + c.join('')
      return [(c >> 16) & 255, (c >> 8) & 255, c & 255, opacity || 0]
    }
    throw new Error(`Bad Hex ${hex}`)
  }

  createGeom(mo) {
    let geom
    switch (mo.kind) {
      case 'Point':
        geom = new ol.geom.Point(mo.coords)
        break
      case 'LineString':
        geom = new ol.geom.LineString(mo.coords)
        break
      case 'Polygon':
        geom = new ol.geom.Polygon(mo.coords)
        break
    }
    return geom
  }

  setAgreements(agreements) {
    this.agreements = agreements
    this.repaintAgreements()
  }

  setHistoryEvents(events) {
    this.historyEvents = events
    this.repaintHistoryEvents()
  }

  getAllCoordsFromMap(map) {
    let all_coords = []

    for (let i = 0; i < map.features.length; i++) {
      let geom = map.features[i].geometry
      if (geom.type === 'Point') {
        all_coords.push(new ol.proj.fromLonLat(geom.coordinates))
      } else {
        let srcCoords =
          geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates
        for (let j = 0; j < srcCoords.length; j++) {
          all_coords.push(new ol.proj.fromLonLat(srcCoords[j]))
        }
      }
    }
    return all_coords
  }

  getCenterOfMap(map) {
    if (!map.features) {
      return null
    }

    const all_coords = this.getAllCoordsFromMap(map)
    return this.getMedianXY(all_coords)
  }

  repaintHistoryEvents() {
    this.allHistoryEventsSource.clear()

    this.allHistoryEventsSource.clear()
    this.historyEvents.forEach((event, i) => {
      0 == i && this.showEventMap(event.maps[0])

      let ft = new ol.Feature({
        name: event.name,
        geometry: new ol.geom.Point(this.getCenterOfMap(event.maps[0])),
        size: 20000,
        isWinnerUSSR: strHelper.compareEngLanguage(event.winner, 'CCCР'),
        ally_troops: event.ally_troops,
        enem_troops: event.enem_troops,
        kind: event.kind,
        imgUrl: event.imgUrl,
        winner: event.winner,
        eventMap: event.maps[0],
        filename: event.filename
      })

      this.allHistoryEventsSource.addFeature(ft)
    })
  }

  repaintAgreements() {
    this.agreementsSource.clear()

    this.agreements.forEach(agreement => {
      if (agreement.placeCoords && agreement.placeCoords.length) {
        let ft = new ol.Feature({
          name: agreement.results,
          kind: 'politics',
          geometry: new ol.geom.Point(ol.proj.fromLonLat(agreement.placeCoords))
        })

        this.agreementsSource.addFeature(ft)
      }
    })
  }

  setCurrentEventMap(map) {
    this.showEventMap(map)
    //this.currentEventMap = map
  }

  showEventMap(map) {
    this.historyEventsSource.clear()
    this.hullSource.clear()

    let features = map.features

    if (!features) {
      return
    }

    let all_coords = []
    for (let i = 0; i < features.length; i++) {
      let geom = features[i].geometry
      let style_prop = features[i].properties
      let style = {}
      if (style_prop.fill) {
        style.fill = new ol.style.Fill({
          color: this.hexToRgbA(style_prop.fill, style_prop['fill-opacity'])
        })
      }
      if (style_prop.stroke) {
        style.stroke = new ol.style.Stroke({
          color: this.hexToRgbA(
            style_prop.stroke,
            style_prop['stroke-opacity']
          ),
          width: style_prop['stroke-width']
        })
      }
      var coords = []
      if (geom.type === 'Point') {
        coords = new ol.proj.fromLonLat(geom.coordinates)
        all_coords.push(coords)
      } else {
        let srcCoords =
          geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates
        for (let j = 0; j < srcCoords.length; j++) {
          let point = new ol.proj.fromLonLat(srcCoords[j])
          coords.push(point)
          all_coords.push(point)
        }
        if (geom.type === 'Polygon') {
          coords = [coords]
        }
      }
      let ft = new ol.Feature({
        uid: 100,
        name: 'test',
        geometry: this.createGeom({ kind: geom.type, coords: coords })
      })
      ft.setStyle(new ol.style.Style(style))
      this.historyEventsSource.addFeature(ft)
    }

    let hull_indexes = convexHull(all_coords)
    let hull_coords = []
    hull_indexes.forEach(idx => {
      hull_coords.push(all_coords[idx])
    })

    let polygon = this.createGeom({ kind: 'Polygon', coords: [hull_coords] })
    polygon.scale(1.03, 1.03)
    let ft = new ol.Feature({
      uid: 1000,
      name: 'test2',
      geometry: polygon
    })
    this.hullSource.addFeature(ft)

    this.view.animate({
      center: this.getCenterOfMap(map),
      duration: 500
    })
  }

  _addButtons() {
    this.map.addControl(
      new CustomControl({
        caption: 'Выбрать объект',
        class: 'pointer-control',
        icon: 'mdi mdi-cursor-default-outline',
        default: true,
        handler: btn => {
          this._setActiveButton(btn)
          this.map.removeInteraction(this.draw)
          this.map.removeInteraction(this.snap)
        }
      })
    )

    this.map.addControl(
      new CustomControl({
        caption: 'Импортировать объекты из geojson-файла',
        class: 'box-control',
        icon: 'mdi mdi-import',
        handler: btn => {
          this._setActiveButton(btn)
          document.getElementById('fileImport').click()
        }
      })
    )
  }

  _setActiveButton(btn) {
    if (this.activeButton) {
      $(this.activeButton).removeClass('glow-button')
    }

    this.activeButton = btn
    $(btn).addClass('glow-button')
  }

  _getStyleFunction(feature, resolution) {
    var stroke = new ol.style.Stroke({
      color: '#ff0000',
      width: 1
    })

    var fill = new ol.style.Fill({
      color: 'rgba(255, 255, 0, 0.2)'
    })

    var imageStyle = new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({
        color: 'red'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 1
      })
    })

    var textColor = 'red'

    switch (feature.get('country')) {
      case 'germany':
        stroke = new ol.style.Stroke({
          color: '#000000',
          width: 1
        })

        imageStyle = new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: 'black'
          }),
          stroke: new ol.style.Stroke({
            color: 'black',
            width: 1
          })
        })

        textColor = 'black'
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
        maxreso: 20000
      })
    })
  }

  _createTextStyle(feature, resolution, dom) {
    let align = dom.align
    let baseline = dom.baseline
    let size = dom.size
    let offsetX = parseInt(dom.offsetX, 10)
    let offsetY = parseInt(dom.offsetY, 10)
    let weight = dom.weight
    let placement = dom.placement ? dom.placement : undefined
    let maxAngle = dom.maxangle ? parseFloat(dom.maxangle) : undefined
    let overflow = dom.overflow ? dom.overflow == 'true' : undefined
    let rotation = parseFloat(dom.rotation)

    let font = weight + ' ' + size + ' ' + dom.font
    let fillColor = dom.color
    let outlineColor = dom.outline
    let outlineWidth = parseInt(dom.outlineWidth, 10)

    return new ol.style.Text({
      textAlign: align == '' ? undefined : align,
      textBaseline: baseline,
      font: font,
      text: this._getText(feature, resolution, dom),
      fill: new ol.style.Fill({ color: fillColor }),
      stroke:
        outlineWidth == 0
          ? undefined
          : new ol.style.Stroke({ color: outlineColor, width: outlineWidth }),
      offsetX: offsetX,
      offsetY: offsetY,
      placement: placement,
      maxAngle: maxAngle,
      overflow: overflow,
      rotation: rotation
    })
  }

  _getText(feature, resolution, dom) {
    let type = dom.text
    let maxResolution = dom.maxreso

    var text = feature.get('name')
    text = text || ''

    if (resolution > maxResolution) {
      text = ''
    } else if (type == 'hide') {
      text = ''
    } else if (type == 'shorten') {
      text = text.trunc(12)
    } else if (type == 'wrap' && dom.placement != 'line') {
      text = stringDivider(text, 16, '\n')
    }

    return text
  }
}

class SuperCustomControl extends ol.control.Control {
  constructor(inputParams) {
    super(inputParams)
  }

  getBSIconHTML(name) {
    return '<span class="' + name + '"></span>'
  }
}

class CustomControl extends SuperCustomControl {
  constructor(inputParams) {
    super(inputParams)

    const caption = get(inputParams, 'caption')
    const hint = get(inputParams, 'hint') || caption
    let button = document.createElement('button')
    button.innerHTML = this.getBSIconHTML(get(inputParams, 'icon'))
    button.className = get(inputParams, 'class')
    button.title = hint

    let parentDiv = $('#custom-control')[0]
    if (!parentDiv) {
      parentDiv = document.createElement('div')
      parentDiv.className = 'ol-control'
      parentDiv.setAttribute('id', 'custom-control')
    }

    parentDiv.appendChild(button)
    this.element = parentDiv

    ol.control.Control.call(this, {
      label: caption,
      hint: hint,
      tipLabel: caption,
      element: parentDiv
      // target: get(inputParams, "target")
    })

    const handler = get(inputParams, 'handler')
    if (handler) {
      button.addEventListener(
        'click',
        () => {
          handler(button)
        },
        false
      )
      button.addEventListener(
        'touchstart',
        () => {
          handler(button)
        },
        false
      )
    }

    const isDefault = get(inputParams, 'default')
    if (isDefault) {
      handler(button)
    }
  }
}

class YearControl extends SuperCustomControl {
  constructor(inputParams) {
    super(inputParams)

    const caption = inputParams.caption
    const hint = inputParams.hint || caption
    this.year = inputParams.year
    this.handler = inputParams.handler

    let yearInput = document.createElement('input')
    yearInput.className = 'input-without-focus'
    yearInput.title = hint
    yearInput.setAttribute('id', 'year-input')
    yearInput.value = this.year
    yearInput.addEventListener('keyup', event => {
      if (event.keyCode == 13) {
        this._inputKeyUp()
        event.preventDefault()
      }
    })

    this.yearInput = yearInput

    let yearLeftButton = document.createElement('button')
    yearLeftButton.innerHTML = this.getBSIconHTML('mdi mdi-step-backward-2')
    yearLeftButton.title = 'Предыдущий год'
    yearLeftButton.setAttribute('id', 'year-left-button')
    yearLeftButton.addEventListener(
      'click',
      () => {
        this._leftButtonClick()
      },
      false
    )
    // yearLeftButton.addEventListener('touchstart', () => { this._leftButtonClick(); }, false);

    let yearRightButton = document.createElement('button')
    yearRightButton.innerHTML = this.getBSIconHTML('mdi mdi-step-forward-2')
    yearRightButton.title = 'Следующий год'
    yearRightButton.setAttribute('id', 'year-right-button')
    yearRightButton.addEventListener(
      'click',
      () => {
        this._rightButtonClick()
      },
      false
    )
    // yearRightButton.addEventListener('touchstart', () => { this._rightButtonClick(); }, false);

    let parentDiv = document.createElement('div')
    parentDiv.className = 'ol-control'
    parentDiv.setAttribute('id', 'year-control')

    parentDiv.appendChild(yearLeftButton)
    parentDiv.appendChild(yearInput)
    parentDiv.appendChild(yearRightButton)

    this.element = parentDiv

    ol.control.Control.call(this, {
      label: 'test',
      hint: 'test',
      tipLabel: caption,
      element: parentDiv
      // target: get(inputParams, "target")
    })
  }

  _leftButtonClick() {
    if (!this._checkYear(this.year, -1)) return

    this.year = parseInt(this.year) - 1
    this._setNewYear(this.year)
  }

  _rightButtonClick() {
    if (!this._checkYear(this.year, +1)) return

    this.year = parseInt(this.year) + 1
    this._setNewYear(this.year)
  }

  _inputKeyUp() {
    let year = this.yearInput.value

    if (!this._checkYear(year, 0, this.year)) {
      this.yearInput.value = this.year
      return
    }

    this.year = parseInt(year)
    this._setNewYear(this.year)
  }

  _checkYear(year, incr, oldValue = undefined) {
    var reg = /^[1][9]\d{2}$/
    if (!reg.test(year)) return false

    let intYear = parseInt(year) + incr
    if (intYear < 1933) return false
    if (intYear > 1955) return false

    if (oldValue == intYear) return false

    return true
  }

  _setNewYear(year) {
    this.yearInput.value = this.year
    this.handler(this.year)
  }
}
