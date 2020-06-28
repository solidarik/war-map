import { Map as olMap, View as olView } from 'ol'
import * as olStyle from 'ol/style'
import * as olGeom from 'ol/geom'
import { default as olFeature } from 'ol/Feature'
import {
  fromLonLat,
  toLonLat,
  get as getProjection,
  //transformExtent,
} from 'ol/proj'
import * as olControl from 'ol/control'
import { default as olLayer } from 'ol/layer/Tile'
import { default as olLayerVector } from 'ol/layer/Vector'
import * as olSource from 'ol/source'
import * as olTilegrid from 'ol/tilegrid'
import * as olInteraction from 'ol/interaction'
import { EventEmitter } from './eventEmitter'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { default as olPopup } from 'ol-ext/overlay/Popup'
import { default as olAnimatedCluster } from 'ol-ext/layer/AnimatedCluster'
import { default as olFeatureAnimationZoom } from 'ol-ext/featureanimation/Zoom'
import { easeOut } from 'ol/easing'
import ClassHelper from '../helper/classHelper'
import StrHelper from '../helper/strHelper'
import BattleFeature from './mapLayers/battleFeature'

const MAP_PARAMS = {
  min_year: 1914,
  max_year: 1965,
  isEnableAnimate: true,
}

export class MapControl extends EventEmitter {
  constructor() {
    super() //first must

    window.map = this

    const yaex = [
      -20037508.342789244,
      -20037508.342789244,
      20037508.342789244,
      20037508.342789244,
    ]
    proj4.defs(
      'EPSG:3395',
      '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
    )
    register(proj4)
    let projection = getProjection('EPSG:3395')
    projection.setExtent(yaex)

    const rasterLayer = new olLayer({
      preload: 5,
      zIndex: 0,
      // source: new olSource.OSM(),
      source: new olSource.XYZ({
        projection: 'EPSG:3395',
        tileGrid: olTilegrid.createXYZ({
          extent: yaex,
        }),
        url:
          'http://vec0{1-4}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU',
      }),
    })

    this.isEnableAnimate = MAP_PARAMS.isEnableAnimate
    this.isDisableSavePermalink = true
    this.isDisableMoveend = false
    this.readViewFromPermalink()

    const view = new olView({
      center: this.center ? this.center : new fromLonLat([56.004, 54.695]), // ufa place
      zoom: this.zoom ? this.zoom : 3,
      // projection: 'EPSG:4326',
      // projection: 'EPSG:3857',
      // projection: 'EPSG:3395',
    })

    this.popup = new olPopup({
      popupClass: 'default shadow', //"default shadow", "tooltips", "warning" "black" "default", "tips", "shadow",
      closeBox: true,
      onshow: function () {
        // console.log('You opened the box')
      },
      onclose: function () {
        // console.log('You close the box')
      },
      positioning: 'auto',
      autoPan: true,
      autoPanAnimation: { duration: this.isEnableAnimate ? 250 : 0 },
    })

    const map = new olMap({
      interactions: olInteraction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false,
      }),
      controls: olControl.defaults({ attribution: false, zoom: false }).extend([
        //new olControl.FullScreen()
      ]),
      layers: [rasterLayer],
      overlays: [this.popup],
      target: 'map',
      view: view,
    })

    function getStyleSimple(feature, _) {
      const classFeature = feature.get('classFeature')
      const style = classFeature.getStyleFeature(
        feature,
        window.map.view.getZoom()
      )
      return style
    }

    function getStyleCluster(feature, _) {
      const size = feature.get('features').length
      if (size == 1) {
        const oneFeature = feature.get('features')[0]
        const classFeature = oneFeature.get('classFeature')
        const style = classFeature.getStyleFeature(
          oneFeature,
          window.map.view.getZoom()
        )
        return style
      }
      const redColor = '255,0,51'
      const cyanColor = '0,162,232'
      const greenColor = '34,177,76'
      const color = size > 10 ? redColor : size > 5 ? greenColor : cyanColor
      const radius = Math.max(8, Math.min(size, 20)) + 5
      let dash = (2 * Math.PI * radius) / 6
      dash = [0, dash, dash, dash, dash, dash, dash]
      const style = new olStyle.Style({
        image: new olStyle.Circle({
          radius: radius,
          stroke: new olStyle.Stroke({
            color: 'rgba(' + color + ',0.6)',
            width: 15,
            lineDash: dash,
            lineCap: 'butt',
          }),
          fill: new olStyle.Fill({
            color: 'rgba(' + color + ',0.9)',
          }),
        }),
        text: new olStyle.Text({
          text: size.toString(),
          font: '14px Helvetica',
          //textBaseline: 'top',
          fill: new olStyle.Fill({
            color: '#fff',
          }),
        }),
      })
      return style
    }

    // Simple Source
    let simpleSource = new olSource.Vector()
    let simpleLayer = new olLayerVector({
      source: simpleSource,
      zIndex: 1,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      style: getStyleSimple,
    })
    this.simpleLayer = simpleLayer
    this.simpleSource = simpleSource
    map.addLayer(simpleLayer)

    let battleMapSource = new olSource.Vector()
    let battleMapLayer = new olLayerVector({
      source: battleMapSource,
      zIndex: 100,
      updateWithAnimating: true,
      updateWhileInteracting: true,
    })
    this.battleMapLayer = battleMapLayer
    this.battleMapSource = battleMapSource
    map.addLayer(battleMapLayer)

    // Hull Source
    let hullSource = new olSource.Vector()
    let hullLayer = new olLayerVector({
      source: hullSource,
      opacity: 0.5,
      zIndex: 10,
      updateWithAnimating: true,
      updateWhileInteracting: true,
    })
    this.hullLayer = hullLayer
    this.hullSource = hullSource
    map.addLayer(hullLayer)

    // Cluster Source
    let clusterSource = new olSource.Cluster({
      distance: 10,
      source: new olSource.Vector(),
    })
    let clusterLayer = new olAnimatedCluster({
      name: 'Cluster',
      source: clusterSource,
      animationDuration: this.isEnableAnimate ? 400 : 0,
      style: getStyleCluster,
    })
    this.clusterLayer = clusterLayer
    map.addLayer(clusterLayer)

    this.clusterSource = clusterSource

    map.on('click', (event) => {
      window.map.popup.hide()
      this.emit('mapclick', undefined)

      const coordinates = event.coordinate
      const lonLatCoords = new toLonLat(coordinates)
      console.log(`clicked on map: ${coordinates}; WGS: ${lonLatCoords}`)

      let featureEvent = undefined
      const isHit = map.forEachFeatureAtPixel(
        event.pixel,
        (feature, _) => {
          featureEvent = feature
          return feature.get('kind')
        },
        { hitTolerance: 5 }
      )

      if (!featureEvent) return

      //simple feature
      let features = featureEvent.get('features')
      if (!features) {
        features = []
        features[0] = featureEvent
      }

      let htmlContent = ''
      if (features.length > 0) {
        this.emit('selectFeatures', features)
      }

      if (features.length == 1) {
        const feature = features[0]
        const info = feature.get('info')
        htmlContent += `<h1>${info.popupFirst}</h1>
            <h2>${info.popupSecond}</h2>
            ${info.popupThird ? '<h2>' + info.popupThird + '</h2>' : ''}`
      } else {
        htmlContent = `<table>`
        features.forEach((feature) => {
          const info = feature.get('info')
          htmlContent += `<tr>
            <td><img src="${info.icon}" alt="${info.oneLine}"></td>
            <td><span>${info.oneLine}</span></td>
          </tr>`
        })
        htmlContent += `</table>`
        console.log(`Cluster ${features.length} features`)
      }

      const featureCoord = featureEvent.getGeometry().getFirstCoordinate()

      this.currentFeatureCoord = featureCoord
      this.showPulse()

      if (featureEvent.get('classFeature') !== BattleFeature) {
        window.map.popup.show(
          featureCoord,
          `<div class="popupDiv">${htmlContent}</div>`
        )
      }
      return
    })

    map.on('moveend', () => {
      if (this.isDisableMoveend) {
        this.isDisableMoveend = false
        return
      }
      window.map.savePermalink.call(window.map)
    })

    map.on('pointermove', (event) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature, _) => {
          return feature
        },
        { hitTolerance: 5 }
      )

      const isHit = feature ? true : false
      if (isHit) {
        map.getTargetElement().style.cursor = 'pointer'
      } else {
        map.getTargetElement().style.cursor = ''
      }
    })

    this.map = map
    this.view = view

    setTimeout(() => {
      this.addYearLayer()
    }, 10)
  }

  static create() {
    return new MapControl()
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

  showMapContour(info) {
    const features = info.map.features
    if (!features) return

    this.hullSource.clear()
    this.battleMapSource.clear()
    console.log(`>>>>>>>> showMapContour ${info.hullCoords}`)

    let all_coords = []
    for (let i = 0; i < features.length; i++) {
      let geom = features[i].geometry
      let style_prop = features[i].properties
      let style = {}
      if (style_prop.fill) {
        style.fill = new olStyle.Fill({
          color: StrHelper.hexToRgbA(
            style_prop.fill,
            style_prop['fill-opacity']
          ),
        })
      }
      if (style_prop.stroke) {
        style.stroke = new olStyle.Stroke({
          color: StrHelper.hexToRgbA(
            style_prop.stroke,
            style_prop['stroke-opacity']
          ),
          width: style_prop['stroke-width'],
        })
      }
      var coords = []
      if (geom.type === 'Point') {
        coords = new fromLonLat(geom.coordinates)
        all_coords.push(coords)
      } else {
        let srcCoords =
          geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates
        for (let j = 0; j < srcCoords.length; j++) {
          let point = new fromLonLat(srcCoords[j])
          coords.push(point)
          all_coords.push(point)
        }
        if (geom.type === 'Polygon') {
          coords = [coords]
        }
      }
      let ft = new olFeature({
        uid: 100,
        name: 'test',
        geometry: this.createGeom({ kind: geom.type, coords: coords }),
      })
      ft.setStyle(new olStyle.Style(style))
      this.battleMapSource.addFeature(ft)

      //обрамление
      let polygon = this.createGeom({
        kind: 'Polygon',
        coords: [info.hullCoords],
      })
      polygon.scale(1.03, 1.03)
      this.hullSource.addFeature(
        new olFeature({
          uid: 1000,
          name: 'test2',
          geometry: polygon,
        })
      )
    }

    this.battleMapLayer.setVisible(true)
    this.hullLayer.setVisible(true)
  }

  showAdditionalInfo(info) {
    this.emit('showAdditionalInfo', undefined)
    this.hidePulse()
    this.showMapContour(info)
    this.simpleLayer.setVisible(false)
    this.clusterLayer.setVisible(false)
    ClassHelper.addClass(
      document.getElementById('year-control'),
      'hide-element'
    )
  }

  returnNormalMode() {
    this.emit('returnNormalMode', undefined)
    ClassHelper.removeClass(
      document.getElementById('year-control'),
      'hide-element'
    )

    this.showPulse()
    this.battleMapLayer.setVisible(false)
    this.hullLayer.setVisible(false)
    this.simpleLayer.setVisible(true)
    this.clusterLayer.setVisible(true)
  }

  pulseFeature(coord) {
    const f = new olFeature(new olGeom.Point(coord))
    f.setStyle(
      new olStyle.Style({
        image: new olStyle.Circle({
          radius: 30,
          stroke: new olStyle.Stroke({ color: 'red', width: 3 }),
        }),
        // image: new olStyle.RegularShape({
        //   fill: new olStyle.Fill({
        //     color: '#fff',
        //   }),
        //   stroke: new olStyle.Stroke({ color: 'black', width: 3 }),
        //   points: 4,
        //   radius: 80,
        //   radius2: 0,
        //   angle: 0,
        // }),
      })
    )
    this.map.animateFeature(
      f,
      new olFeatureAnimationZoom({
        fade: easeOut,
        duration: 1500,
        easing: easeOut,
      })
    )
  }

  setCurrentYearFromServer(year) {
    this.changeYear(year)
    this.addYearControl()
  }

  addYearControl() {
    this.map.addControl(
      new YearControl({
        caption: 'Выбрать год событий',
        year: this.currentYear,
        handler: (year) => {
          this.changeYear(year)
        },
      })
    )
  }

  addYearLayer() {
    const yearLayer = new olLayer({
      preload: 5,
      opacity: 0.2,
      zIndex: 2,
      source: new olSource.XYZ({
        tileUrlFunction: (tileCoord, pixelRatio, projection) => {
          return this.getGeacronLayerUrl.call(
            this,
            tileCoord,
            pixelRatio,
            projection
          )
        },
      }),
    })

    this.yearLayer = yearLayer
    this.map.addLayer(yearLayer)
  }

  fixMapHeight() {
    this.isDisableMoveend = true
    this.map.updateSize()
  }

  updateView() {
    if (this.isEnableAnimate) {
      this.view.animate({
        center: this.center,
        zoom: this.zoom,
        duration: 200,
      })
    } else {
      this.view.setCenter(this.center)
      this.view.setZoom(this.zoom)
    }
  }

  readViewFromState(state) {
    this.center = state.center
    this.zoom = state.zoom
  }

  readViewFromPermalink() {
    if (window.location.hash !== '') {
      var hash = window.location.hash.replace('#map=', '')
      var parts = hash.split('/')
      if (parts.length === 3) {
        this.zoom = parseInt(parts[0], 10)
        this.center = [parseFloat(parts[1]), parseFloat(parts[2])]
      }
    }
  }

  savePermalink() {
    if (this.isDisableSavePermalink) {
      this.isDisableSavePermalink = false
    }

    const center = this.view.getCenter()
    const hash =
      '#map=' +
      Math.round(this.view.getZoom()) +
      '/' +
      Math.round(center[0] * 100) / 100 +
      '/' +
      Math.round(center[1] * 100) / 100
    const state = {
      zoom: this.view.getZoom(),
      center: this.view.getCenter(),
    }

    window.history.pushState(state, 'map', hash)
  }

  getGeacronLayerUrl(tileCoord, pixelRatio, projection) {
    if (!this.currentYear) return

    let ano = this.currentYear
    let anow = '' + ano
    anow = anow.replace('-', 'B')

    anow = anow == '1951' ? '1950' : anow == '1960' ? '1959' : anow

    let z = tileCoord[0]
    let x = tileCoord[1]
    let y = tileCoord[2]

    if (z == 0 || z > 6) return

    let url = `http://cdn.geacron.com/tiles/area/${anow}/Z${z}/${y}/${x}.png`
    return url
  }

  getYandexLayerUrl(tileCoord, pixelRatio, projection) {
    let z = tileCoord[0]
    let x = tileCoord[1]
    let y = -tileCoord[2] - 1

    let url = `http://vec01.maps.yandex.net/tiles?l=map&v=4.55.2&z=${z}&x=${x}&y=${y}&scale=2&lang=ru_RU`
    return url
  }

  hidePopup() {
    window.map.popup.hide()
  }

  hidePulse() {
    clearInterval(window.pulse)
  }

  showPulse() {
    clearInterval(window.pulse)
    window.pulse = setInterval(() => {
      this.pulseFeature(this.currentFeatureCoord)
    }, 1000)
  }

  changeYear(year) {
    this.hidePopup()
    this.hidePulse()
    this.currentYear = year
    this.yearLayer.getSource().refresh()
    this.emit('changeYear', year)
  }

  createGeom(mo) {
    let geom
    switch (mo.kind) {
      case 'Point':
        geom = new olGeom.Point(mo.coords)
        break
      case 'LineString':
        geom = new olGeom.LineString(mo.coords)
        break
      case 'Polygon':
        geom = new olGeom.Polygon(mo.coords)
        break
    }
    return geom
  }

  addFeature(item) {
    const ft = new olFeature({
      info: item,
      classFeature: item.classFeature,
      geometry: new olGeom.Point(item.point),
    })

    let source = item.simple
      ? this.simpleSource
      : this.clusterSource.getSource()
    source.addFeature(ft)
  }

  refreshInfo(info) {
    this.simpleSource.clear()
    this.clusterSource.getSource().clear()
    info.forEach((item) => this.addFeature(item))
  }
}

window.onpopstate = (event) => {
  const map = window.map
  map.isDisableSavePermalink = true
  map.isDisableMoveend = true
  event.state
    ? map.readViewFromState.call(map, event.state)
    : map.readViewFromPermalink.call(map)
  map.updateView.call(map)
}

class SuperCustomControl extends olControl.Control {
  constructor(inputParams) {
    super(inputParams)
  }

  getBSIconHTML(name) {
    return '<span class="' + name + '"></span>'
  }
}

class YearControl extends SuperCustomControl {
  static get min_year() {
    return MAP_PARAMS.min_year
  }

  static get max_year() {
    return MAP_PARAMS.max_year
  }

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
    yearInput.addEventListener('keyup', (event) => {
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

    olControl.Control.call(this, {
      label: 'test',
      hint: 'test',
      tipLabel: caption,
      element: parentDiv,
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
    var reg = /^[1,2][8,9,0]\d{2}$/
    if (!reg.test(year)) return false

    let intYear = parseInt(year) + incr
    if (intYear < YearControl.min_year) return false
    if (intYear > YearControl.max_year) return false

    if (oldValue == intYear) return false

    return true
  }

  _setNewYear(year) {
    this.yearInput.value = this.year
    this.handler(this.year)
  }
}
