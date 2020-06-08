// import ol from './libs/ol'
// import olExt from './libs/ol-ext.min'
import { EventEmitter } from './eventEmitter'
import BattleLayer from './mapLayers/battleLayer'
import AgreementFeature from './mapLayers/agreementFeature'
import BattleFeature from './mapLayers/battleFeature'
import DateHelper from '../helper/dateHelper'

const MAP_PARAMS = {
  min_year: 1914,
  max_year: 1965,
  isEnableAnimate: true,
}

export class MapControl extends EventEmitter {
  constructor() {
    super() //first must

    const rasterLayer = new ol.layer.Tile({
      preload: 5,
      zIndex: 0,
      //      source: new ol.source.OSM(),
      source: new ol.source.XYZ({
        tileUrlFunction: (tileCoord, pixelRatio, projection) => {
          return this.getYandexLayerUrl.call(
            this,
            tileCoord,
            pixelRatio,
            projection
          )
        },
      }),
    })

    this.isEnableAnimate = MAP_PARAMS.isEnableAnimate
    this.isDisableSavePermalink = true
    this.isDisableMoveend = false
    this.readViewFromPermalink()

    const view = new ol.View({
      center: this.center
        ? this.center
        : new ol.proj.fromLonLat([56.004, 54.695]), // ufa place
      zoom: this.zoom ? this.zoom : 3,
      // projection: 'EPSG:4326'
    })

    this.popup = new ol.Overlay.Popup({
      popupClass: 'default shadow', //"tooltips", "warning" "black" "default", "tips", "shadow",
      closeBox: false,
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

    const map = new ol.Map({
      interactions: ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false,
      }),
      controls: ol.control
        .defaults({ attribution: false, zoom: false })
        .extend([
          // new ol.control.FullScreen()
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
        console.log(featureClass)
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
      const style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: radius,
          stroke: new ol.style.Stroke({
            color: 'rgba(' + color + ',0.6)',
            width: 15,
            lineDash: dash,
            lineCap: 'butt',
          }),
          fill: new ol.style.Fill({
            color: 'rgba(' + color + ',0.9)',
          }),
        }),
        text: new ol.style.Text({
          text: size.toString(),
          font: '14px Helvetica',
          //textBaseline: 'top',
          fill: new ol.style.Fill({
            color: '#fff',
          }),
        }),
      })
      return style
    }

    // Cluster Source
    let clusterSource = new ol.source.Cluster({
      distance: 40,
      source: new ol.source.Vector(),
    })
    let clusterLayer = new ol.layer.AnimatedCluster({
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
      const lonLatCoords = new ol.proj.toLonLat(coordinates)
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
        const featureClass = feature.get('featureClass')
        const info = featureClass.getPopupInfo(feature)
        htmlContent = `<div>${DateHelper.dateToStr(
          info.date
        )} <a href='./some'>${info.caption}</a>`
      } else {
        let featureContent = []
        features.forEach((feature) => {
          const featureClass = feature.get('featureClass')
          featureContent.push(featureClass.getPopupInfo(feature))
        })
        console.log(`Cluster ${features.length} features`)
      }

      //todo Showing HTML content
      window.map.popup.show(
        featureEvent.getGeometry().getFirstCoordinate(),
        htmlContent
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
    var yearLayer = new ol.layer.Tile({
      preload: 5,
      opacity: 0.2,
      zIndex: 2,
      source: new ol.source.XYZ({
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
    let y = -tileCoord[2] - 1

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

  changeYear(year) {
    window.map.popup.hide()
    this.currentYear = year
    this.currentYearForMap = this.currentYear == 1951 ? 1950 : this.currentYear
    this.yearLayer.getSource().refresh()
    this.emit('changeYear', year)
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

  addFeature(item) {
    const ft = new ol.Feature({
      info: item,
      featureClass: item.classFeature,
      geometry: new ol.geom.Point(item.point),
    })

    console.log(`item point ${item.point}`)

    this.clusterSource.getSource().addFeature(ft)
  }

  refreshInfo(info) {
    console.log(`refresh info in map control ${info}`)
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

class SuperCustomControl extends ol.control.Control {
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

    ol.control.Control.call(this, {
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
