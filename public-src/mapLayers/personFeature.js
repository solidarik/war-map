import SuperFeature from './superFeature'

class PersonFeature extends SuperFeature {
  static getIcon() {
    return 'images/mapIcons/tag.png'
  }

  static getBirthIcon() {
    return 'images/mapIcons/tagBirth.png'
  }

  static getAchievementIcon() {
    return 'images/mapIcons/tagAchiev.png'
  }

  static getDeathIcon() {
    return 'images/mapIcons/tagDeath.png'
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

module.exports = PersonFeature
