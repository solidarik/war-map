import SuperFeature from './superFeature'
import DateHelper from '../../helper/dateHelper'

class AgreementFeature extends SuperFeature {
  static getIcon() {
    return 'images/mapIcons/agreement.png'
  }

  static getCaptionInfo(info) {
    return `${info.kind}. ${info.place}`
  }

  static getPopupInfo(feature) {
    const info = feature.get('info')
    return {
      icon: this.getIcon(),
      date: info.startDate,
      caption: this.getCaptionInfo(info),
    }
  }

  static getHtmlInfo(info) {
    window.CURRENT_ITEM = info
    const dates = DateHelper.twoDateToStr(info.startDate, info.endDate)
    const html = `<div class="agreement-info info-panel">
      <h1>${info.place}. ${info.kind}</h1>
      <h2>${dates}</h2>
      <table class="table table-sm table-borderless" id="table-info">
        <tbody>
          <tr><td>Участники</td><td>${info.player1}</td></tr>
          <tr><td></td><td>${info.player2}</td></tr>
        </tbody>
      </table>
      <p>${info.results}</p>
      <div class="source-info">
        <a target='_blank' rel='noopener noreferrer' href=${info.srcUrl}>Источник информации</a>
      </div>
    </div>
    `
    return html
  }

  static fillAgreementFeature(info) {
    return info.agreements.map((elem) => {
      return {
        ...elem,
        icon: AgreementFeature.getIcon(),
        popupFirst: elem.kind,
        popupSecond: DateHelper.twoDateToStr(elem.startDate, elem.endDate),
        popupThird: elem.place,
        oneLine: elem.kind,
      }
    })
  }
}

module.exports = AgreementFeature
