// import ol from './libs/ol'
// import olExt from './libs/ol-ext.min'
import { EventEmitter } from './eventEmitter'
//import battleLayer from './mapLayers/battleLayer'

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
      autoPanAnimation: { duration: this.isEnableAnimate ? 800 : 0 },
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

    var styleCache = {}
    function getStyleCluster(feature, _) {
      const size = feature.get('features').length
      let style = styleCache[size]
      if (!style) {
        //todo add support styles by kind for single feature
        // if (size == 1) {
        //   style = styleCache[size] = window.map.battlesStyleFunc(
        //     feature.get('features')[0],
        //     window.map.view.getZoom()
        //   )
        //   return style
        // }
        const redColor = '255,0,51'
        const cyanColor = '0,162,232'
        const greenColor = '34,177,76'
        const color = size > 10 ? redColor : size > 5 ? greenColor : cyanColor
        const radius = Math.max(8, Math.min(size, 20)) + 5
        let dash = (2 * Math.PI * radius) / 6
        dash = [0, dash, dash, dash, dash, dash, dash]
        style = styleCache[size] = new ol.style.Style({
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
      }
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

    // Style for selection
    const apartClusterStyle = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0,255,255,1)',
          width: 1,
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0,255,255,0.3)',
        }),
      }),
      // Draw a link beetween points (or not)
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 1,
      }),
    })
    // Select interaction to spread cluster out and select features
    const selectCluster = new ol.interaction.SelectCluster({
      // Point radius: to calculate distance between the features
      pointRadius: 7,
      animate: this.isEnableAnimate,
      // Feature style when it springs apart
      featureStyle: function () {
        return [apartClusterStyle]
      },
      // selectCluster: false,	// disable cluster selection
      // Style to draw cluster when selected
      style: function (f, res) {
        var cluster = f.get('features')
        if (cluster.length > 1) {
          var s = [getStyleCluster(f, res)]
          return s
        } else {
          return [
            new ol.style.Style({
              image: new ol.style.Circle({
                stroke: new ol.style.Stroke({
                  color: 'rgba(0,0,192,0.5)',
                  width: 2,
                }),
                fill: new ol.style.Fill({ color: 'rgba(0,0,192,0.3)' }),
                radius: 5,
              }),
            }),
          ]
        }
      },
    })
    map.addInteraction(selectCluster)

    selectCluster.getFeatures().on(['add'], function (e) {
      var c = e.element.get('features')
      if (c.length == 1) {
        console.log('One feature selected... id ' + c[0].get('id'))
      } else {
        console.log(`Cluster ${c.length} features`)
      }
    })
    // selectCluster.getFeatures().on(['remove'], function (e) {
    //   console.log('')
    // })

    map.on('click', (event) => {
      window.map.popup.hide()

      const coordinates = event.coordinate
      const lonLatCoords = new ol.proj.toLonLat(coordinates)
      console.log(`clicked on map: ${coordinates}; WGS: ${lonLatCoords}`)

      let featureEvent = undefined
      const isHit = map.forEachFeatureAtPixel(event.pixel, (feature, _) => {
        featureEvent = feature
        return feature.get('kind')
      })

      if (!featureEvent) return
      const kind = featureEvent.get('kind')
      //todo Showing HTML content
      console.log(
        'todo this place for showing html content of selected feature'
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

  refreshInfo(info) {
    this.clusterSource.getSource().clear()
    info.battles.forEach((item, i) => {
      let ft = new ol.Feature({
        ...item,
        geometry: new ol.geom.Point(item.point),
      })

      this.clusterSource.getSource().addFeature(ft)
    })
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
