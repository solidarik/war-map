import { EventEmitter } from './eventEmitter'
import ClassHelper from '../helper/classHelper'
import StrHelper from '../helper/strHelper'
import BattleFeature from './mapLayers/battleFeature'
import AgreementFeature from './mapLayers/agreementFeature'

export class LegendControl extends EventEmitter {
  constructor() {
    super() //first must

    this.legendButton = document.getElementById('legend-button')
    this.legendButton.addEventListener('click', this.legendButtonClick)

    this.legendSpan = document.getElementById('legend-span')

    this.legendDiv = document.getElementById('legend-div')
    this.isShow = false

    this.lines = this.addLines()
  }

  static create() {
    return new LegendControl()
  }

  fillBattles(info) {}
  fillAgreementFeature(info) {}
  fillWMW(info) {}
  fillWOW(info) {}
  fillRussiaWinner(info) {}
  fillGermanyWinner(info) {}

  addLines() {
    let lines = []

    lines.push({
      caption: 'Военные события',
      classFeature: BattleFeature,
      fillFunction: this.fillBattles,
      checkVariable: this.isCheckBattles,
      childs: [
        {
          caption: 'ВОВ',
          classFeature: BattleFeature,
          hint: 'События Великой Отечественной войны',
          fillFunction: this.FillWOW,
          checkVariable: this.isCheckBattlesWOW,
          childs: [
            {
              caption: 'Победы СССР',
              classFeature: BattleFeature,
              fillFunction: this.fillRussiaWinner(),
              icon: BattleFeature.getRussiaWinnerIcon(),
              checkVariable: this.isCheckBattlesRussiaWinner,
            },
            {
              caption: 'Победы Германии',
              classFeature: BattleFeature,
              fillFunction: this.fillGermanyWinner(),
              icon: BattleFeature.getGermanyWinnerIcon(),
              checkVariable: this.isCheckBattlesGermanyWinner,
            },
          ],
        },
        {
          caption: 'ВМВ',
          classFeature: BattleFeature,
          hint: 'Международные военные события',
          fillFunction: this.fillWMW,
          icon: BattleFeature.getWMWIcon(),
          checkVariable: this.isCheckBattlesWMW,
        },
      ],
    })

    lines.push({
      caption: 'Соглашения',
      classFeature: AgreementFeature,
      fillFunction: this.fillAgreementFeature(),
      icon: AgreementFeature.getIcon(),
      checkVariable: this.isCheckAgreements,
    })

    return lines
  }

  legendButtonClick(event) {
    const legend = window.legend
    legend.isShow = !legend.isShow
    legend.isShow
      ? legend.showLegend.call(legend)
      : legend.hideLegend.call(legend)
  }

  showLegend() {
    ClassHelper.removeClass(this.legendDiv, 'legend-div-hide')
    ClassHelper.addClass(this.legendDiv, 'legend-div-show')
    // this.legendSpan.className = 'mdi mdi-close mdi-24px'
  }

  hideLegend() {
    ClassHelper.removeClass(this.legendDiv, 'legend-div-show')
    ClassHelper.addClass(this.legendDiv, 'legend-div-hide')
    // this.legendSpan.className = 'mdi mdi-format-list-bulleted mdi-24px'
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
      console.log(icon)
      htmlIcon += `<img src="${icon}" alt="Girl in a jacket">`
    })
    return htmlIcon
  }

  filterInfo(rawInfo) {
    //todo filter by check legends
    return rawInfo
  }

  rowClick(tr) {
    let id = tr.attr('data-href')
    if (!id) return

    tr.addClass('event-active-row')
      .siblings()
      .removeClass('event-active-row')
    //let activeEvent = this.lines.filter(event => event.id == id)[0]
  }

  updateCounter(rawInfo) {
    let html = `
      <h1>Легенда</h1>
      <table class="table table-borderless">
      <tbody>`

    this.lines.forEach((line) => {
      html += `<tr>
        <td>${this.getHTMLIcons(line)}</td>
        <td>${line.caption}</td>
        <td>0</td>
      </tr>`
    })

    html += '</tbody></table>'
    this.legendDiv.innerHTML = html
  }

  refreshInfo(rawInfo) {
    this.rawInfo = rawInfo
    this.updateCounter(this.rawInfo)
    const info = this.filterInfo(this.rawInfo)
    this.emit('refreshInfo', info)
  }
}
