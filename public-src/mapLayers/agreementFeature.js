import SuperFeature from './superFeature'
import dateHelper from '../../helper/dateHelper'

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

  static getHtmlInfo(feature) {
    return 'Not implemented'
  }

  static fillAgreementFeature(info) {
    return info.agreements.map((elem) => {
      return {
        ...elem,
        icon: AgreementFeature.getIcon(),
        popupFirst: elem.kind,
        popupSecond: dateHelper.twoDateToStr(elem.startDate, elem.endDate),
        popupThird: elem.place,
        oneLine: elem.kind,
      }
    })
  }
}

module.exports = AgreementFeature
