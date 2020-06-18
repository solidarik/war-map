import { Map as olMap, View as olView } from 'ol'
import * as olStyle from 'ol/style'
import * as olGeom from 'ol/geom'
import { default as olFeature } from 'ol/Feature'
import {
  fromLonLat,
  toLonLat,
  get as getProjection,
  transformExtent,
} from 'ol/proj'
import * as olControl from 'ol/control'
import { default as olLayer } from 'ol/layer/Tile'
import * as olSource from 'ol/source'
import * as olTilegrid from 'ol/tilegrid'
import * as olInteraction from 'ol/interaction'
import { EventEmitter } from './eventEmitter'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { default as olPopup } from 'ol-ext/overlay/Popup'
import { default as olAnimatedCluster } from 'ol-ext/layer/AnimatedCluster'

const MAP_PARAMS = {
  min_year: 1914,
  max_year: 1965,
  isEnableAnimate: true,
}

export class MapControl extends EventEmitter {
  constructor() {
    super() //first must

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
        // url:
        //   'http://vec0{1-4}.maps.yandex.net/tiles?l=map&v=4.55.2&x={x}&y={y}&z={z}',
        // tileUrlFunction: (tileCoord, pixelRatio, projection) => {
        //   return this.getYandexLayerUrl.call(
        //     this,
        //     tileCoord,
        //     pixelRatio,
        //     projection
        //   )
        // },
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

    function getStyleCluster(feature, _) {
      const size = feature.get('features').length
      if (size == 1) {
        const oneFeature = feature.get('features')[0]
        const featureClass = oneFeature.get('featureClass')
        const style = featureClass.getStyleFeature(
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
    map.addLayer(clusterLayer)

    this.clusterSource = clusterSource

    map.on('click', (event) => {
      window.map.popup.hide()

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
      const features = featureEvent.get('features')

      let htmlContent = ''
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
            <td><img src="${info.icon}" alt="Girl in a jacket"></td>
            <td><span>${info.oneLine}</span></td>
          </tr>`
        })
        htmlContent += `</table>`
        console.log(`Cluster ${features.length} features`)
      }

      //todo Showing HTML content
      window.map.popup.show(
        featureEvent.getGeometry().getFirstCoordinate(),
        `<div class="popupDiv">${htmlContent}</div>`
      )
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

    window.map = this
    this.map = map
    this.view = view

    setTimeout(() => {
      this.addYearLayer()
    }, 10)
  }

  static create() {
    return new MapControl()
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
    if (!this.currentYearForMap) return

    let ano = this.currentYearForMap
    var anow = '' + ano
    anow = anow.replace('-', 'B')

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

  changeYear(year) {
    this.hidePopup()
    this.currentYear = year
    this.currentYearForMap = this.currentYear == 1951 ? 1950 : this.currentYear
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
      featureClass: item.classFeature,
      geometry: new olGeom.Point(item.point),
    })

    this.clusterSource.getSource().addFeature(ft)
  }

  refreshInfo(info) {
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
