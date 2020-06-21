import convexHull from 'monotone-convex-hull-2d'
import strHelper from '../../helper/strHelper'
import dateHelper from '../../helper/dateHelper'
import SuperFeature from './superFeature'
import * as olStyle from 'ol/style'

class BattleFeature extends SuperFeature {
  static getIcon() {
    return 'images/mapIcons/undefined_icon.png'
  }

  static getCaptionInfo(info) {
    return info.name
  }

  static getStarThreeIcon() {
    return 'images/mapIcons/starThree.png'
  }

  static getWMWIcon() {
    return 'images/mapIcons/starblue.png'
  }

  static getWOWIcon() {
    return 'images/mapIcons/starwow.png'
  }

  static getUSSRWinnerIcon() {
    return 'images/mapIcons/starred.png'
  }

  static getGermanyWinnerIcon() {
    return 'images/mapIcons/starblack.png'
  }

  static getCaption(feature) {
    return 'Операции ВОВ/ВМВ'
  }

  static fillAddInfo(res) {
    return res.map((elem) => {
      return {
        ...elem,
        popupFirst: dateHelper.twoDateToStr(elem.startDate, elem.endDate),
        popupSecond: elem.name,
        oneLine: elem.name,
      }
    })
  }

  static fillBattles(info) {
    let res = info.battles
    res = res.map((elem) => {
      return { ...elem, icon: BattleFeature.getIcon() }
    })
    return BattleFeature.fillAddInfo(res)
  }

  static fillWMW(info) {
    let res = info.battles.filter((battle) => battle.kind === 'wmw')
    res = res.map((elem) => {
      return { ...elem, icon: BattleFeature.getWMWIcon() }
    })
    return BattleFeature.fillAddInfo(res)
  }

  static fillWOW(info) {
    let res = info.battles.filter((battle) => battle.kind === 'wow')
    res = res.map((elem) => {
      return { ...elem, icon: BattleFeature.getWOWIcon() }
    })
    return BattleFeature.fillAddInfo(res)
  }

  static fillUSSRWinner(info) {
    let res = info.battles.filter((battle) => battle.isWinnerUSSR)
    res = res.map((elem) => {
      return { ...elem, icon: BattleFeature.getUSSRWinnerIcon() }
    })
    return BattleFeature.fillAddInfo(res)
  }

  static fillGermanyWinner(info) {
    let res = info.battles.filter((battle) => battle.isWinnerGermany)
    res = res.map((elem) => {
      return { ...elem, icon: BattleFeature.getGermanyWinnerIcon() }
    })
    return BattleFeature.fillAddInfo(res)
  }

  static getStyleFeature(feature, zoom) {
    return this.getStarStyleFeature(feature, zoom)
    //return this.getIconStyleFeature(feature, zoom)
  }

  static getIconStyleFeature(feature, zoom) {
    const info = feature.get('info')

    const allyTroops = strHelper.getNumber(info.ally_troops)
    const enemTroops = strHelper.getNumber(info.enem_troops)
    const starSizes = [
      { count: 2500, size: 1 },
      { count: 5000, size: 1 },
      { count: 70000, size: 1.2 },
      { count: 100000, size: 1.5 },
      { count: 200000, size: 1.6 },
      { count: 500000, size: 1.8 },
      { count: 1000000, size: 1.9 },
      { count: 10000000000, size: 2 },
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

    const icon =
      info.kind == 'wmw'
        ? 'images/mapIcons/starblue.png'
        : info.isWinnerUSSR == true
        ? 'images/mapIcons/starred.png'
        : 'images/mapIcons/starblack.png'

    const style = new olStyle.Style({
      image: new olStyle.Icon({
        // anchor: [0, 0],
        imgSize: [32, 32],
        src: icon,
        //color: '#ff0000',
        // fill: new olStyle.Fill({ color: 'rgba(153,51,255,1)' }),
        //scale: starSize,
        radius: 7,
        opacity: 1,
      }),
    })
    return [style]
  }

  static getStarStyleFeature(feature, zoom) {
    const info = feature.get('info')

    const allyTroops = strHelper.getNumber(info.ally_troops)
    const enemTroops = strHelper.getNumber(info.enem_troops)
    let starSize = 4

    const starSizes = [
      { count: 2500, size: 6 },
      { count: 5000, size: 8 },
      { count: 70000, size: 10 },
      { count: 100000, size: 11 },
      { count: 200000, size: 12 },
      { count: 500000, size: 14 },
      { count: 1000000, size: 16 },
      { count: 10000000000, size: 18 },
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

    let style = new olStyle.Style({
      image: new olStyle.RegularShape({
        fill: new olStyle.Fill(
          info.kind == 'wmw'
            ? { color: 'rgba(102,102,255,0.9 ) ' } //blue color
            : info.isWinnerUSSR == true
            ? { color: 'rgba(255,0,0,0.6)' } //red color
            : { color: 'rgba(0,0,0,0.6)' } //black color
        ),
        // stroke: new olStyle.Stroke({
        //   width: 0,
        //   color: 'gray'
        // }),
        points: 5,
        radius: starSize + 2,
        radius2: Math.floor(starSize / 2),
        angle: -50,
      }),
    })
    return [style]
  }

  static getPopupInfo(feature) {
    const info = feature.get('info')
    return {
      icon: this.getIcon(),
      date: info.startDate,
      caption: info.name,
    }
  }

  static getHtmlInfo(feature) {
    /*
    let content = `<h3>${info.name}</h3>`
      switch (kind) {
        case 'chronos':
          content = `<h3>${info.place}</h3>`
          break
        case 'politics':
          content = `<h3>${info.place}</h3>`
          break
        default:
          break
      }

      let isFirstRow = true

      const getHtmlForFeatureEvent = (event) => {
        const getHtmlCell = (caption, param1, param2, isBold = false) => {
          const f = (value) => {
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
    return <div>'Not implemented'</div>
  }

  static getInnerLayer(feature) {
    throw 'Not implemented'
  }

  static getAllCoordsFromMap(map) {
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
      resizeImage(ft.get('imgUrl'), $('.modal-body').width(), (canvas) => {
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
    this.battlesSource.clear()
    this.hullSource.clear()

    if (this.isShowContour) {
      this.showEventContour(ft.get('eventMap'))
    }
  }

  showEventContour(map) {
    this.battlesSource.clear()
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
        style.fill = new olStyle.Fill({
          color: strHelper.hexToRgbA(
            style_prop.fill,
            style_prop['fill-opacity']
          ),
        })
      }
      if (style_prop.stroke) {
        style.stroke = new olStyle.Stroke({
          color: strHelper.hexToRgbA(
            style_prop.stroke,
            style_prop['stroke-opacity']
          ),
          width: style_prop['stroke-width'],
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
        geometry: this.createGeom({ kind: geom.type, coords: coords }),
      })
      ft.setStyle(new olStyle.Style(style))
      this.battlesSource.addFeature(ft)
    }

    let hull_indexes = convexHull(all_coords)
    let hull_coords = []
    hull_indexes.forEach((idx) => {
      hull_coords.push(all_coords[idx])
    })

    let polygon = this.createGeom({ kind: 'Polygon', coords: [hull_coords] })
    polygon.scale(1.03, 1.03)
    let ft = new ol.Feature({
      uid: 1000,
      name: 'test2',
      geometry: polygon,
    })
    this.hullSource.addFeature(ft)
  }
}

module.exports = BattleFeature
