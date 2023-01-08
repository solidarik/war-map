import SuperFeature from './superFeature.js'
import strHelper from '../../helper/strHelper.js'
import dateHelper from '../../helper/dateHelper.js'

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
    console.log(`chronosFeatureInfo: ${JSON.stringify(info)}`)
    window.CURRENT_ITEM = info
    let html = `<div class="chronos-info panel-info">
      <h1>${info.place}</h1>
      <h2>${info.start.dateStr}</h2>
      <p>${info.brief}</p>
      ${info.comment ? '<p>' + info.comment + '</p>' : ''}
      ${info.remark ? '<p>' + info.remark + '</p>' : ''}`
    if (info.srcUrl) {
      html += `<div class="source-info">
          <a target='_blank' rel='noopener noreferrer' href=${
            info.srcUrl
          }>Подробнее</a>
        </div>
      </div>
      `
    }
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
