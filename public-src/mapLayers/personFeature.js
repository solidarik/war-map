import SuperFeature from './superFeature'
import dateHelper from '../../helper/dateHelper'
import strHelper from '../../helper/strHelper'

class PersonFeature extends SuperFeature {
  static getIcon() {
    return 'images/mapIcons/tagAchiev.png'
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

  static getFio(info) {
    let res = []
    info.surname && res.push(info.surname)
    info.name && res.push(info.name)
    info.middlename && res.push(info.middlename)
    return res.join(' ')
  }

  static fillPersonItems(info, kind) {
    let res = []
    switch (kind) {
      case 'birth':
        if (!info.personBirth) return res
        res = info.personBirth.map((elem) => {
          return {
            ...elem,
            point: elem.placeBirthCoords[0],
            icon: PersonFeature.getBirthIcon(),
            popupFirst: `${PersonFeature.getFio(elem)}`,
            popupSecond: `Дата рождения: ${dateHelper.dateToStr(
              elem.dateBirth
            )}`,
            popupThird: `Место рождения: ${elem.placeBirth}`,
          }
        })
        break
      case 'achievement':
        if (!info.personsAchievement) return res
        res = info.personsAchievement.map((elem) => {
          return {
            ...elem,
            point: elem.placeAchievementCoords[0],
            icon: PersonFeature.getAchievementIcon(),
            popupFirst: `${PersonFeature.getFio(elem)}`,
            popupSecond: `Дата подвига: ${dateHelper.dateToStr(
              elem.dateAchievement
            )}`,
            popupThird: `Место подвига: ${strHelper.shrinkStringBeforeDelim(
              elem.placeAchievement,
              ';'
            )}`,
          }
        })
        break
      case 'death':
        if (!info.personsDeath) return res
        res = info.personsDeath.map((elem) => {
          return {
            ...elem,
            point: elem.placeDeathCoords[0],
            icon: PersonFeature.getDeathIcon(),
            popupFirst: `${PersonFeature.getFio(elem)}`,
            popupSecond: `Дата смерти: ${dateHelper.dateToStr(elem.dateDeath)}`,
            popupThird: `Место смерти: ${elem.placeDeath}`,
          }
        })
        break
      default:
        throw console.error(`fillPersonItems, некорректный kind ${kind}`)
    }
    res = res.map((elem) => {
      return { ...elem, oneLine: `${PersonFeature.getFio(elem)}` }
    })
    return res
  }
}

module.exports = PersonFeature
