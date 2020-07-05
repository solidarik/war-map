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

  static getHtmlInfo(info) {
    window.CURRENT_ITEM = info
    const html = `<div class="chronos-info info-panel">
      <h1>${info.place}</h1>
      <h2>${info.startDateStr}</h2>
      <p>${info.brief}</p>
      ${info.comment ? '<p>' + info.comment + '</p>' : ''}
      ${info.remark ? '<p>' + info.remark + '</p>' : ''}
      <div class="source-info">
        <a target='_blank' rel='noopener noreferrer' href=${
          info.srcUrl
        }>Источник информации</a>
      </div>
    </div>
    `
    return html
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
