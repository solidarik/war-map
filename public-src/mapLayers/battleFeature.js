import StrHelper from '../../helper/strHelper'
import DateHelper from '../../helper/dateHelper'
import SuperFeature from './superFeature'
import * as olStyle from 'ol/style'
import ImageHelper from '../../helper/imageHelper'

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
        popupFirst: DateHelper.twoDateToStr(elem.startDate, elem.endDate),
        popupSecond: elem.name,
        oneLine: elem.name,
      }
    })
  }

  static fillBattles(info) {
    let res = info.battles
    res = res.map((elem) => {
      return { ...elem, icon: BattleFeature.getIcon(), simple: true }
    })
    return BattleFeature.fillAddInfo(res)
  }

  static fillWMW(info) {
    let res = info.battles.filter((battle) => battle.kind === 'wmw')
    res = res.map((elem) => {
      return { ...elem, icon: BattleFeature.getWMWIcon(), simple: true }
    })
    return BattleFeature.fillAddInfo(res)
  }

  static fillWOW(info) {
    let res = info.battles.filter((battle) => battle.kind === 'wow')
    res = res.map((elem) => {
      return { ...elem, icon: BattleFeature.getWOWIcon(), simple: true }
    })
    return BattleFeature.fillAddInfo(res)
  }

  static fillUSSRWinner(info) {
    let res = info.battles.filter((battle) => battle.isWinnerUSSR)
    res = res.map((elem) => {
      return { ...elem, icon: BattleFeature.getUSSRWinnerIcon(), simple: true }
    })
    return BattleFeature.fillAddInfo(res)
  }

  static fillGermanyWinner(info) {
    let res = info.battles.filter((battle) => battle.isWinnerGermany)
    res = res.map((elem) => {
      return {
        ...elem,
        icon: BattleFeature.getGermanyWinnerIcon(),
        simple: true,
      }
    })
    return BattleFeature.fillAddInfo(res)
  }

  static getStyleFeature(feature, zoom) {
    return this.getStarStyleFeature(feature, zoom)
    //return this.getIconStyleFeature(feature, zoom)
  }

  static getIconStyleFeature(feature, zoom) {
    const info = feature.get('info')

    const allyTroops = StrHelper.getNumber(info.ally_troops)
    const enemTroops = StrHelper.getNumber(info.enem_troops)
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

    const allyTroops = StrHelper.getNumber(info.ally_troops)
    const enemTroops = StrHelper.getNumber(info.enem_troops)
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

  static arrayToText(input) {
    if (Array.isArray(input)) {
      return input.length > 0 ? input.join('<br />') : '-'
    } else {
      if (input == undefined) return '-'
    }
    return input
  }

  static getHtmlCell(caption, param1, param2, isFirstRow = false) {
    const f = (value) => {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ').replace(/, /g, '<br/>') : '-'
      } else {
        if (value == undefined) return '-'
        const tryFloat = parseFloat(value)
        const isNaN =
          typeof Number.isNaN !== 'undefined'
            ? Number.isNaN(tryFloat)
            : tryFloat !== tryFloat
            ? true
            : false
        return isNaN ? value.replace(/, /g, '<br />') : tryFloat.toString()
      }
    }

    const one = f(param1)
    const two = f(param2)

    const getTdWithClassName = (defaultClass, value) => {
      const className = isFirstRow
        ? defaultClass + ' ' + 'bold-text'
        : defaultClass
      return className.trim() != ''
        ? `<td class="${className}">${value}</td>`
        : `<td>${value}</td>`
    }

    const getComparison = (one, two) => {
      const oneNumber = StrHelper.getNumber(one)
      const twoNumber = StrHelper.getNumber(two)
      //if (oneNumber * twoNumber == 0) return '<td></td>'
      const maxNumber = Math.max(oneNumber, twoNumber)

      const getProgressDiv = (input, number, maxNumber, bgColor) => {
        const numberWidth = Math.floor((number / maxNumber) * 100)
        return `<div class="progress" style="height:2rem"><div class="progress-bar"
          style="width: ${numberWidth}%; background-color: ${bgColor}"
          role="progressbar"
          aria-valuenow="${number}"
          aria-valuemin="0"
          aria-valuemax="${maxNumber}">${
          input > 0 ? StrHelper.numberWithCommas(input) : input
        }
        </div></div>`
      }

      return `<td style='width:100%'>
          ${getProgressDiv(
            one,
            oneNumber,
            maxNumber,
            BattleFeature.sideColors[0]
          )}
          ${getProgressDiv(
            two,
            twoNumber,
            maxNumber,
            BattleFeature.sideColors[1]
          )}
      </td>`
    }

    if ('-' != one || '-' != two) {
      let tr = `<tr>
        ${getTdWithClassName('left-align', caption)}
        ${isFirstRow ? '<td></td>' : getComparison(one, two)}
      </tr>`
      return tr
    }

    // ${getTdWithClassName(
    //   '',
    //   one > 0 ? StrHelper.numberWithCommas(one) : one
    // )}
    // ${getTdWithClassName(
    //   'right-align',
    //   two > 0 ? StrHelper.numberWithCommas(two) : two
    // )}
    return ''
  }

  static getColorBySideName(input, elseColor) {
    if (-1 < input.indexOf('Россия') || -1 < input.indexOf('СССР')) {
      return 'rgba(255, 0, 0, 0.5)'
    } else if (-1 < input.indexOf('Германия')) {
      return 'rgba(40, 40, 40, 0.5)'
    } else return elseColor
  }

  static showContour(num) {
    if (num == window.CURRENT_ADD_NUM) {
      window.map.returnNormalMode.call(window.map)
      window.CURRENT_ADD_NUM = undefined
      return
    }

    window.CURRENT_ADD_NUM = num
    const info = window.CURRENT_ITEM
    const map = info.maps[num]
    const hullCoords = info.hullCoords[num]
    window.map.showAdditionalInfo.call(window.map, { map, hullCoords })
  }

  static showImage() {
    const imgDiv = document.getElementById('event-image-div')
    imgDiv.innerHTML = ''
    const imgUrl = window.CURRENT_ITEM.imgUrl
    if (!imgUrl) return

    ImageHelper.resizeImage(imgUrl, 300, (canvas) => {
      imgDiv.appendChild(canvas)
    })
  }

  static getMapsCell(caption, info) {
    let html = ''
    let delim = ''
    for (let i = 0; i < info.maps.length; i++) {
      html += `${delim}
        <span class="click-element event-feature-color" onclick="window.BattleFeature.showContour(${i})">${
        info.maps.length == 1 ? 'Вект.' : i + 1
      }</span>`
      delim = '&nbsp'
    }
    if (info.imgUrl) {
      html += `${delim}
        <span class="click-element event-feature-color" onclick="window.BattleFeature.showImage()">Граф.</span>`
    }

    return `<td>${caption}</td><td>${html}</td>`
  }

  static getHtmlInfo(info) {
    window.CURRENT_ITEM = info

    const dates = DateHelper.twoDateToStr(info.startDate, info.endDate)
    const hCell = this.getHtmlCell

    const oneSide = this.arrayToText(info.allies)
    const twoSide = this.arrayToText(info.enemies)

    const oneSideColor = this.getColorBySideName(oneSide, 'rgba(0,0,255,0.5)')
    const twoSideColor = this.getColorBySideName(twoSide, 'rgba(0,255,0,0.5)')
    BattleFeature.sideColors = [oneSideColor, twoSideColor]

    let tData = this.getMapsCell('Карты событий', info)
    tData += hCell('Участники', oneSide, twoSide)
    tData += hCell('Силы сторон', info.ally_troops, info.enem_troops)
    tData += hCell('Потери', info.ally_losses, info.enem_losses)
    tData += hCell('Убитые', info.ally_deads, info.enem_deads)
    tData += hCell('Пленные', info.ally_prisoners, info.enem_prisoners)
    tData += hCell('Раненые', info.ally_woundeds, info.enem_woundeds)
    tData += hCell('Пропавшие без вести', info.ally_missing, info.enem_missing)
    tData += hCell('Числ. танков', info.ally_tanks_cnt, info.enem_tanks_cnt)
    tData += hCell('Потери танков', info.ally_tanks_lost, info.enem_tanks_lost)
    tData += hCell(
      'Числ. самолетов',
      info.ally_airplans_cnt,
      info.enem_airplans_cnt
    )
    tData += hCell(
      'Потери самолетов',
      info.ally_airplans_lost,
      info.enem_airplans_lost
    )
    tData += hCell('Числ. кораблей', info.ally_ships_cnt, info.enem_ships_cnt)
    tData += hCell(
      'Потери кораблей',
      info.ally_ships_lost,
      info.enem_ships_lost
    )
    tData += hCell(
      'Подводных лодок',
      info.ally_submarines_cnt,
      info.enem_submarines_cnt
    )

    const html = `<div class="battle-info">
      <h1>${info.name}</h1>
      <h2>${dates}</h2>
      <table class="table table-sm table-borderless" id="table-info">
        <tbody>
          ${tData}
        </tbody>
      </table>
    </div>
    `

    return html
    /*
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
    return 'Not implemented'
  }

  static getInnerLayer(feature) {
    throw 'Not implemented'
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
}

module.exports = BattleFeature
window.BattleFeature = BattleFeature
