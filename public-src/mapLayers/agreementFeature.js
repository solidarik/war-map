import SuperFeature from './superFeature'

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
    return <div>'Not implemented'</div>
  }
}

module.exports = AgreementFeature
