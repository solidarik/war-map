// import ol from './libs/ol'
// import olExt from './libs/ol-ext.min'
import { EventEmitter } from './eventEmitter'
import convexHull from 'monotone-convex-hull-2d'
import strHelper from '../helper/strHelper'

const kremlinLocation = new ol.proj.fromLonLat([37.617499, 55.752023]) // moscow kremlin

const min_year = 1914
const max_year = 1965

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

    this.popup = new ol.Overlay.Popup({
      popupClass: 'default shadow', //"tooltips", "warning" "black" "default", "tips", "shadow",
      closeBox: false,
      onshow: function() {
        // console.log('You opened the box')
      },
      onclose: function() {
        // console.log('You close the box')
      },
      positioning: 'auto',
      autoPan: true,
      autoPanAnimation: { duration: 250 }
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
      overlays: [this.popup],
      target: 'map',
      view: view
    })

    /*
    solidarik: Temporarily disabled selectStyle

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

    select.on('select', function(evt) {
      if (evt.selected.length) return
      const feature = evt.selected[0]

      //window.map.showEventContour(feature.get('eventMap'))
    })

    */

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

    map.on('click', function(evt) {
      window.map.popup.hide()

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
      let kind = undefined
      const isHit = map.forEachFeatureAtPixel(evt.pixel, function(
        feature,
        layer
      ) {
        featureEvent = feature
        imgUrl = feature.get('imgUrl')
        kind = feature.get('kind')
        return (
          ['wmw', 'wow', 'politics', 'chronos', 'persons'].indexOf(
            feature.get('kind')
          ) >= 0
        )
      })

      if (!featureEvent) return

      const info = featureEvent.get('info')
      const isExistUrl = imgUrl !== undefined

      let content = `<h3>${info.name}</h3>`
      if (kind == 'chronos') {
        content = `<h3>${info.place}</h3>`
      }

      let isFirstRow = true

      const getHtmlForFeatureEvent = event => {
        const getHtmlCell = (caption, param1, param2, isBold = false) => {
          const f = value => {
            if (Array.isArray(value)) {
              return value.length > 0
                ? value.join(', ').replace(/, /g, '<br/>')
                : '-'
            } else {
              if (value == undefined) return '-'
              const tryFloat = parseFloat(value)
              const isNaN =
                typeof Number.isNaN !== 'undefined'
                  ? Number.isNaN(tryFloat)
                  : tryFloat !== tryFloat
                  ? true
                  : false
              return isNaN
                ? value.replace(/, /g, '<br />')
                : tryFloat.toString()
            }
          }

          const one = f(param1)
          const two = f(param2)

          const getTdWithClassName = (defaultClass, value) => {
            const className = isBold
              ? defaultClass + ' ' + 'bold-text'
              : defaultClass
            return className.trim() != ''
              ? `<td class="${className}">${value}</td>`
              : `<td>${value}</td>`
          }

          if ('-' != one || '-' != two) {
            let tr = `<tr>
              ${getTdWithClassName('left-align', caption)}
              ${getTdWithClassName('', one)}
              ${getTdWithClassName('right-align', two)}
            </tr>`
            return tr
          }

          return ''
        }

        let html = ''
        html += getHtmlCell('Участники', info.allies, info.enemies, true)
        html += getHtmlCell(
          'Силы сторон (чел.)',
          info.ally_troops,
          info.enem_troops
        )
        html += getHtmlCell('Потери (чел.)', info.ally_losses, info.enem_losses)
        html += getHtmlCell('Убитые (чел.)', info.ally_deads, info.enem_deads)
        html += getHtmlCell(
          'Пленные (чел.)',
          info.ally_prisoners,
          info.enem_prisoners
        )
        html += getHtmlCell(
          'Раненые (чел.)',
          info.ally_woundeds,
          info.enem_woundeds
        )
        html += getHtmlCell(
          'Пропавшие без вести (чел.)',
          info.ally_missing,
          info.enem_missing
        )
        html += getHtmlCell(
          'Танков (шт.)',
          info.ally_tanks_cnt,
          info.enem_tanks_cnt
        )
        html += getHtmlCell(
          'Самолетов (шт.)',
          info.ally_airplans_cnt,
          info.enem_airplans_cnt
        )
        html += getHtmlCell(
          'Кораблей (шт.)',
          info.ally_ships_cnt,
          info.enem_ships_cnt
        )
        html += getHtmlCell(
          'Подводных лодок (шт.)',
          info.ally_submarines_cnt,
          info.enem_submarines_cnt
        )

        return html
      }

      if ('politics' === kind) {
        const startDate = info.startDate
        const endDate = info.endDate
        if (startDate) {
          const dateStr =
            endDate != undefined && startDate != endDate
              ? `${startDate} - ${endDate}`
              : startDate
          content += '<h4>' + dateStr + '</h4>'
        }

        let results = info.results
        if (results) {
          results = results.replace(/[.,]\s*$/, '')
          content += '<p>' + results + '</p>'
        }
      } else if ('chronos' === kind) {
        const startDate = info.startDate
        const endDate = info.endDate
        if (startDate) {
          let dateStr =
            endDate != undefined && startDate != endDate
              ? `${startDate} - ${endDate}`
              : startDate
          if (info.isOnlyYear) {
            dateStr = dateStr.slice(-4)
          }
          content += '<h4>' + dateStr + '</h4>'
        }

        let results = info.brief
        if (results) {
          results = results.replace(/[.,]\s*$/, '')
          content += '<p>' + results + '</p>'
        }
      } else if ('persons' === kind) {
        content = `<h3>${info.surname} ${info.name} ${info.middlename}</h3>`
        const startDate = info.dateBirth
        const endDate = info.dateDeath
        if (startDate) {
          let dateStr =
            endDate != undefined && startDate != endDate
              ? `${startDate} - ${endDate}`
              : startDate
          content += '<h4>' + dateStr + '</h4>'
        }

        let results = info.description
        if (results) {
          results = results.replace(/[.,]\s*$/, '')
          content += '<p class="content-description">' + results + '</p>'
        }
      } else {
        window.map.setActiveEvent(featureEvent)

        const startDate = info.startDate
        const endDate = info.endDate
        if (startDate) {
          const dateStr =
            endDate != undefined && startDate != endDate
              ? `${startDate} - ${endDate}`
              : startDate
          content += '<h4>' + dateStr + '</h4>'
        }

        let table = `
          <table class="table table-sm table-borderless" id="table-info">
          <tbody>
          ${getHtmlForFeatureEvent(featureEvent)}
          </tbody></table>`
        content += `<p>${table}</p>`

        const eventId = info.id
        let table2 = `
        <table class="table table-sm table-borderless" id="table-control">
          <tr><td
            id="showEventContol"
            onclick="window.map.showActiveEventContour()"
            onmouseenter="window.map.setCursorPointer(this, true);"
            onmouseleave="window.map.setCursorPointer(this, false);">Показать/скрыть контур</td></tr>
          <tr><td
            id="showMapControl"
            onclick="window.map.showActiveEventMap()"
            onmouseenter="window.map.setCursorPointer(this, true);"
            onmouseleave="window.map.setCursorPointer(this, false);">Показать карту</td></tr>
        </table>`
        content += table2
      }

      if ('' == content) return

      if (info.srcUrl && 0 < info.srcUrl.length) {
        content +=
          '<span class="small-silver-text"><a href="' +
          info.srcUrl +
          '" target="_blank">Источник</a></span>'
      }

      const coords = featureEvent.getGeometry().getFirstCoordinate()
      window.map.popup.show(coords, content)

      /* Show Big Image */
      /*
      if (isHit && isExistUrl) {
        window.map.showEventContour(info.eventMap)

        $('#imgModalLabel').html(info.name)
        $('.modal-body').html(`
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        `)
        $('#imgModal').modal()

        setTimeout(() => {
          resizeImage(imgUrl, $('.modal-body').width(), canvas => {
            $('.modal-body').html(canvas)
          })
        }, 1000)
      }
      */
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
    this.legend = undefined
    this.historyEvents = []
    this.agreements = []
    this.chronos = []
    this.persons = []

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
      this.addChronosLayer()
      this.addAgreementsLayer()
      this.addPersonsLayer()
      this.addLegend()
      // this._addButtons();
    }, 10)
  }

  static create() {
    return new MapControl()
  }

  setActiveEvent(featureEvent) {
    this.activeFeatureEvent = featureEvent
    this.isShowContour = false
  }

  showActiveEventMap() {
    const ft = this.activeFeatureEvent

    $('#imgModalLabel').html(ft.get('name'))
    $('.modal-body').html(`
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    `)
    $('#imgModal').modal()

    setTimeout(() => {
      resizeImage(ft.get('imgUrl'), $('.modal-body').width(), canvas => {
        $('.modal-body').html(canvas)
      })
    }, 1000)
  }

  setCursorPointer(elem, b) {
    const c = 'hover-on-text'
    if (!elem) return
    b ? elem.classList.add(c) : elem.classList.remove(c)
  }

  showActiveEventContour() {
    const ft = this.activeFeatureEvent

    this.isShowContour = !this.isShowContour
    this.historyEventsSource.clear()
    this.hullSource.clear()

    if (this.isShowContour) {
      this.showEventContour(ft.get('eventMap'))
    }
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

  historyEventsStyleFunc(feature, zoom) {
    // if (zoom > 4.5) {
    //   return [new ol.style.Style()]
    // }

    const info = feature.get('info')
    const allyTroops = this.getNumber(info.ally_troops)
    const enemTroops = this.getNumber(info.enem_troops)
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

  chronosStyleFunc(feature, zoom) {
    let style = new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({ color: 'rgba(0,220,0,0.7)' }),
        radius: 7
      })
    })
    return [style]
  }

  personsStyleFunc(feature, zoom) {
    let style = new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({ color: 'rgba(153,51,255,1)' }),
        radius: 7
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
      style: (f, _) => this.historyEventsStyleFunc(f, this.view.getZoom()),
      zIndex: 6,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    })
    this.allHistoryEventsSource = allHistoryEventsSource
    this.map.addLayer(allHistoryEventsLayer)
  }

  addChronosLayer() {
    let chronosSource = new ol.source.Vector()
    let chronosLayer = new ol.layer.Vector({
      source: chronosSource,
      style: (feature, _) =>
        this.chronosStyleFunc(feature, this.view.getZoom()),
      zIndex: 7,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    })
    this.chronosSource = chronosSource
    this.map.addLayer(chronosLayer)
  }

  addPersonsLayer() {
    let personsSource = new ol.source.Vector()
    let personsLayer = new ol.layer.Vector({
      source: personsSource,
      style: (feature, _) =>
        this.personsStyleFunc(feature, this.view.getZoom()),
      zIndex: 7,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    })
    this.personsSource = personsSource
    this.map.addLayer(personsLayer)
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

  repaintLegend() {
    while (this.legend.getLength() != 0) {
      this.legend.removeRow(0)
    }
    if (0 < this.allHistoryEventsSource.getFeatures().length) {
      const f0 = this.allHistoryEventsSource.getFeatures()[0]
      f0.setStyle(this.historyEventsStyleFunc()[0])
      this.legend.addRow({
        title: 'Военные события',
        feature: f0,
        typeGeom: f0.getGeometry().getType()
      })
    }
    if (0 < this.chronosSource.getFeatures().length) {
      const f0 = this.chronosSource.getFeatures()[0]
      f0.setStyle(this.chronosStyleFunc()[0])
      this.legend.addRow({
        title: 'Прочие события',
        feature: f0,
        typeGeom: f0.getGeometry().getType()
      })
    }
    if (0 < this.agreementsSource.getFeatures().length) {
      const f0 = this.agreementsSource.getFeatures()[0]
      f0.setStyle(this.agreementStyleFunc()[0])
      this.legend.addRow({
        title: 'Политические события',
        feature: f0,
        typeGeom: f0.getGeometry().getType()
      })
    }
    if (0 < this.personsSource.getFeatures().length) {
      const f0 = this.personsSource.getFeatures()[0]
      f0.setStyle(this.personsStyleFunc()[0])
      this.legend.addRow({
        title: 'Персоналии',
        feature: f0,
        typeGeom: f0.getGeometry().getType()
      })
    }
    console.log('repaint legend')
  }

  addLegend() {
    this.legend = new ol.control.Legend({
      title: 'Легенда',
      collapsed: false
    })
    this.map.addControl(this.legend)
    this.legend.on('select', function(e) {
      if (e.index >= 0) {
        console.log('You click on row: ' + e.title + ' (' + e.index + ')')
        this.removeRow(e.index)
      } else console.log('You click on the title: ' + e.title)
      switch (e.title) {
        case 'Прочие события':
          window.map.chronosSource.clear()
          break
        case 'Военные события':
          window.map.allHistoryEventsSource.clear()
          break
        case 'Политические события':
          window.map.agreementsSource.clear()
          break
        case 'Персоналии':
          window.map.personsSource.clear()
          break
        default:
          break
      }
    })
    setTimeout(() => {
      const legendControl = $('.ol-legend')[0]
      if (legendControl) {
        legendControl.setAttribute('id', 'events-legend')
      }
    }, 10)
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
    window.map.popup.hide()
    this.historyEventsSource.clear()
    this.hullSource.clear()
    this.agreementsSource.clear()
    this.chronosSource.clear()
    this.personsSource.clear()
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

  refreshInfo(info) {
    this.chronos = info.chronos
    this.agreements = info.agreements
    this.historyEvents = info.events
    this.persons = info.persons
    this.repaintChronos()
    this.repaintAgreements()
    this.repaintHistoryEvents()
    this.repaintPersons()
    this.repaintLegend()
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
      //0 == i && this.showEventContour(event.maps[0])
      let info = event
      let ft = new ol.Feature({
        id: event.id,
        name: event.name,
        geometry: new ol.geom.Point(this.getCenterOfMap(event.maps[0])),
        size: 20000,
        isWinnerUSSR: strHelper.compareEngLanguage(event.winner, 'CCCР'),
        kind: event.kind,
        info: info,
        imgUrl: event.imgUrl,
        eventMap: event.maps[0],
        filename: event.filename
      })

      this.allHistoryEventsSource.addFeature(ft)
    })
  }

  repaintChronos() {
    this.chronosSource.clear()

    this.chronos.forEach(chrono => {
      let info = chrono
      if (chrono.placeCoords && chrono.placeCoords.length) {
        chrono.placeCoords[1] =
          chrono.placeCoords[1] + chrono.placeCoords[1] / 200 //поправка для слияния нескольких точек в одну
        let ft = new ol.Feature({
          kind: 'chronos',
          geometry: new ol.geom.Point(ol.proj.fromLonLat(chrono.placeCoords)),
          info: info
        })

        this.chronosSource.addFeature(ft)
      }
    })
  }

  repaintAgreements() {
    this.agreementsSource.clear()

    this.agreements.forEach(agreement => {
      let info = agreement
      if (agreement.placeCoords && agreement.placeCoords.length) {
        let ft = new ol.Feature({
          name: agreement.kind,
          kind: 'politics',
          geometry: new ol.geom.Point(
            ol.proj.fromLonLat(agreement.placeCoords)
          ),
          info: info
        })

        this.agreementsSource.addFeature(ft)
      }
    })
  }

  repaintPersons() {
    this.personsSource.clear()

    this.persons.forEach(person => {
      let info = person
      if (person.placeDeathCoords && person.placeDeathCoords.length) {
        person.placeDeathCoords[1] =
          person.placeDeathCoords[1] - person.placeDeathCoords[1] / 150 //поправка для слияния нескольких точек в одну
        let ft = new ol.Feature({
          kind: 'persons',
          geometry: new ol.geom.Point(
            ol.proj.fromLonLat(person.placeDeathCoords)
          ),
          info: info
        })
        this.personsSource.addFeature(ft)
      }

      if (
        person.placeAchievementCoords &&
        person.placeAchievementCoords.length
      ) {
        person.placeAchievementCoords[1] =
          person.placeAchievementCoords[1] -
          person.placeAchievementCoords[1] / 200 //поправка для слияния нескольких точек в одну
        let ft = new ol.Feature({
          kind: 'persons',
          geometry: new ol.geom.Point(
            ol.proj.fromLonLat(person.placeAchievementCoords)
          ),
          info: info
        })
        this.personsSource.addFeature(ft)
      }
    })
  }

  setCurrentEventMap(map) {
    //this.showEventContour(map)
    //this.currentEventMap = map
  }

  showEventContour(map) {
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

    // this.view.animate({
    //   center: this.getCenterOfMap(map),
    //   duration: 500
    // })
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
  static get min_year() {
    return min_year
  }

  static get max_year() {
    return max_year
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
