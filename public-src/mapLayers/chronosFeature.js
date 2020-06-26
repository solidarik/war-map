import SuperFeature from './superFeature'
import strHelper from '../../helper/strHelper'
import dateHelper from '../../helper/dateHelper'

class ChronosFeature extends SuperFeature {
  static getIcon() {
    return 'images/mapIcons/chronos.png'
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

  static fillChronosFeature(info) {
    return info.chronos.map((elem) => {
      return {
        ...elem,
        icon: ChronosFeature.getIcon(),
        popupFirst: strHelper.ellipseLongString(elem.brief),
        popupSecond: dateHelper.twoDateToStr(
          elem.startDate,
          elem.endDate,
          elem.isOnlyYear
        ),
        popupThird: elem.place,
        oneLine: strHelper.ellipseLongString(elem.brief),
      }
    })
  }
}

module.exports = ChronosFeature
