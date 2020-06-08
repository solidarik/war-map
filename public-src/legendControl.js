import { EventEmitter } from './eventEmitter'
import ClassHelper from '../helper/classHelper'
import JsHelper from '../helper/jsHelper'
import BattleFeature from './mapLayers/battleFeature'
import AgreementFeature from './mapLayers/agreementFeature'
import PersonFeature from './mapLayers/personFeature'
import { CookieHelper } from './cookieHelper'
import TileSource from 'ol/source/Tile'

export class LegendControl extends EventEmitter {
  constructor() {
    super() //first must

    this.legendButton = document.getElementById('legend-button')
    this.legendButton.addEventListener('click', this.legendButtonClick)

    this.legendSpan = document.getElementById('legend-span')
    this.legendDiv = document.getElementById('legend-div')
    const isVisible = CookieHelper.getCookie('isVisibleLegend', false)
    this.isVisible = isVisible ? JSON.parse(isVisible) : false
    this.showHideLegend()

    this.lines = this.addLines()
    this.linesCount = 10
    const isCheckArr = CookieHelper.getCookie('isCheckArrLegend', undefined)
    this.isCheckArr = isCheckArr
      ? JSON.parse(isCheckArr)
      : JsHelper.fillArray(true, this.linesCount)

    this.items = []
    this.uniqueItems = {}

    window.legend = this
    window.legendOnClick = this.legendOnClick
  }

  static create() {
    return new LegendControl()
  }

  pointFilter(res) {
    return res.filter(
      (item) => item.point && item.point.length === 2 && item.point[0] !== 0
    )
  }

  fillAgreementFeature(info) {
    return info.agreements
  }

  fillPersonFeature(info) {
    let res = []
    res = res.concat(this.fillPersonBirth(info))
    res = res.concat(this.fillPersonAchievement(info))
    res = res.concat(this.fillPersonDeath(info))
    return res
  }

  fillPersonBirth(info) {
    let res = []
    if (info.personBirth) {
      res = info.personBirth.map((elem) => {
        return { ...elem, point: elem.placeBirthCoords[0] }
      })
    }
    return this.pointFilter(res)
  }

  fillPersonAchievement(info) {
    let res = []
    if (info.personsAchievement) {
      res = info.personsAchievement.map((elem) => {
        return { ...elem, point: elem.placeAchievementCoords[0] }
      })
    }
    return this.pointFilter(res)
  }

  fillPersonDeath(info) {
    let res = []
    if (info.personsDeath) {
      res = info.personsDeath.map((elem) => {
        return { ...elem, point: elem.placeDeathCoords[0] }
      })
    }
    return this.pointFilter(res)
  }

  fillBattles(info) {
    return this.pointFilter(info.battles)
  }

  fillWMW(info) {
    return info.battles.filter((battle) => battle.kind === 'wmw')
  }

  fillWOW(info) {
    return info.battles.filter((battle) => battle.kind === 'wow')
  }

  fillUSSRWinner(info) {
    return info.battles.filter((battle) => battle.isWinnerUSSR)
  }

  fillGermanyWinner(info) {
    return info.battles.filter((battle) => battle.isWinnerGermany)
  }

  addLines() {
    let lines = []

    lines.push({
      id: 0,
      caption: 'Военные события',
      classFeature: BattleFeature,
      fillFunction: this.fillBattles,
      childs: [
        {
          id: 1,
          caption: 'События ВОВ',
          classFeature: BattleFeature,
          hint: 'События Великой Отечественной войны',
          fillFunction: this.fillWOW,
          childs: [
            {
              id: 2,
              caption: 'Победы СССР',
              classFeature: BattleFeature,
              fillFunction: this.fillUSSRWinner,
              icon: BattleFeature.getRussiaWinnerIcon(),
            },
            {
              id: 3,
              caption: 'Победы Германии',
              classFeature: BattleFeature,
              fillFunction: this.fillGermanyWinner,
              icon: BattleFeature.getGermanyWinnerIcon(),
            },
          ],
        },
        {
          caption: 'События ВМВ',
          id: 4,
          classFeature: BattleFeature,
          hint: 'Международные военные события',
          fillFunction: this.fillWMW,
          icon: BattleFeature.getWMWIcon(),
        },
      ],
    })

    lines.push({
      id: 5,
      caption: 'Политические события',
      classFeature: AgreementFeature,
      fillFunction: this.fillAgreementFeature,
      icon: AgreementFeature.getIcon(),
    })

    lines.push({
      id: 6,
      caption: 'Персоналии',
      classFeature: PersonFeature,
      fillFunction: this.fillPersonFeature,
      childs: [
        {
          id: 7,
          caption: 'Рождения',
          classFeature: PersonFeature,
          fillFunction: this.fillPersonBirth,
          icon: PersonFeature.getBirthIcon(),
        },
        {
          id: 8,
          caption: 'Достижения',
          classFeature: PersonFeature,
          fillFunction: this.fillPersonAchievement,
          icon: PersonFeature.getAchievementIcon(),
        },
        {
          id: 9,
          caption: 'Смерти',
          classFeature: PersonFeature,
          fillFunction: this.fillPersonDeath,
          icon: PersonFeature.getDeathIcon(),
        },
      ],
    })

    return lines
  }

  showHideLegend() {
    if (this.isVisible) {
      ClassHelper.removeClass(this.legendDiv, 'legend-div-hide')
      ClassHelper.addClass(this.legendDiv, 'legend-div-show')
      // this.legendSpan.className = 'mdi mdi-close mdi-24px'
    } else {
      ClassHelper.removeClass(this.legendDiv, 'legend-div-show')
      ClassHelper.addClass(this.legendDiv, 'legend-div-hide')
      // this.legendSpan.className = 'mdi mdi-format-list-bulleted mdi-24px'
    }
  }

  legendButtonClick(event) {
    const legend = window.legend
    legend.isVisible = !legend.isVisible
    legend.showHideLegend.call(legend)
    CookieHelper.setCookie('isVisibleLegend', legend.isVisible)
  }

  getIcons(line) {
    let icons = []

    if (line.icon) {
      icons.push(line.icon)
    } else {
      if (line.childs) {
        line.childs.forEach((child) => {
          const subIcons = this.getIcons(child)
          subIcons.forEach((icon) => icons.push(icon))
        })
      }
    }

    return icons
  }

  getHTMLIcons(line) {
    let htmlIcon = ''
    this.getIcons(line).forEach((icon) => {
      htmlIcon += `<img src="${icon}" alt="Girl in a jacket">`
    })
    return htmlIcon
  }

  searchLinesById(id, lines = undefined) {
    let maybeLine = undefined
    !lines && (lines = this.lines)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (id === line.id) {
        maybeLine = line
        break
      }

      if (line.childs) {
        maybeLine = this.searchLinesById(id, line.childs)
        if (maybeLine) {
          break
        }
      }
    }
    return maybeLine
  }

  changeParentCheck() {}

  repaintLegend() {
    let html = `
    <h1>Легенда</h1>
    <table class="table table-borderless">
    <tbody>`

    this.lines.forEach((line) => {
      html += this.getHTMLOneLineLegend(line, 0, this.isCheckArr[line.id])
    })

    html += '</tbody></table>'
    this.legendDiv.innerHTML = html
  }

  legendOnClick(span) {
    //get attribute for tr element: span > td > tr
    const tr = span.parentElement.parentElement
    const rowId = parseInt(tr.getAttribute('data-href'))
    const legend = window.legend
    //const line = legend.searchLinesById.call(legend, rowId)

    legend.isCheckArr[rowId] = !legend.isCheckArr[rowId]
    CookieHelper.setCookie(
      'isCheckArrLegend',
      JSON.stringify(legend.isCheckArr)
    )
    legend.repaintLegend()
    legend.filterInfo.call(legend)
  }

  clickSpan(content) {
    return `<span onclick=legendOnClick(this)>${content}</span>`
  }

  getHTMLOneLineLegend(line, level, isCheckParent) {
    let html = ''
    const leftImagePosition =
      level > 0 ? `style="left: ${level * 5}px;z-index: ${level}"` : ''
    const leftCaptionPosition =
      level > 0 ? `style="padding-left: ${level * 30}px"` : ''

    const classTr =
      this.isCheckArr[line.id] && isCheckParent
        ? ''
        : 'class="legend-filter-grayscale"'

    html += `<tr data-href=${line.id} ${classTr}>
      <td ${leftImagePosition}>${this.clickSpan(this.getHTMLIcons(line))}</td>
      <td ${leftCaptionPosition}>${this.clickSpan(line.caption)}</td>
      <td>${this.items[line.id].length}</td>
    </tr>`

    if (line.childs) {
      line.childs.forEach((child) => {
        html += this.getHTMLOneLineLegend(
          child,
          level + 1,
          isCheckParent && this.isCheckArr[child.id]
        )
      })
    }
    return html
  }

  updateCounter(rawInfo) {
    this.items = []
    this.uniqueItems = {}
    for (let id = 0; id < this.linesCount; id++) {
      const line = this.searchLinesById(id)
      //injection classFeature property to every item
      const fillResult = line.fillFunction.call(this, rawInfo)
      this.items[id] = []
      if (fillResult) {
        this.items[id] = fillResult.map((elem) => {
          return { ...elem, classFeature: line.classFeature }
        })
        this.items[id].forEach((item) => {
          this.uniqueItems[item._id] = item
        })
      } else {
        console.log(`Не удалось инициализировать массив для ${line.caption}`)
      }
    }
  }

  filterInfo() {
    let visible = {}
    for (let id in this.uniqueItems) {
      visible[id] = true
    }

    //loop all layer items and set visible to unique items
    for (let id = 0; id < this.linesCount; id++) {
      const isVisibleLayer = this.isCheckArr[id]
      this.items[id].forEach((item) => {
        visible[item._id] = visible[item._id] && isVisibleLayer
      })
    }

    let res = []
    for (let id in this.uniqueItems) {
      visible[id] && res.push(this.uniqueItems[id])
    }

    console.log('refreshInfo', res)
    this.emit('refreshInfo', res)
  }

  refreshInfo(rawInfo) {
    this.rawInfo = rawInfo
    this.updateCounter(this.rawInfo)
    this.repaintLegend()
    this.filterInfo()
  }
}
