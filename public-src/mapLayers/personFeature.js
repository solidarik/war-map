import SuperFeature from './superFeature.js'
import DateHelper from '../../helper/dateHelper.js'
import StrHelper from '../../helper/strHelper.js'

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

  static getHtmlInfo(info) {
    window.CURRENT_ITEM = info
    const delimSymbol = '<br/>'

    let imgHtml = ''
    const photoUrl = info.photoUrl
    if (photoUrl) {
      imgHtml = `<img src="${photoUrl}" class="rounded float-start imageFeatureInfo"></img>`
    }

    let html = `<div class="person-info panel-info">
    <div class="row">
      <div class="col-md-auto">
        ${imgHtml}
      </div>
      <div class="col">
      <h1>${info.surname} ${info.name} ${info.middlename}</h1>
      <h2>${info.activity}</h2>
      <table class="table table-sm table-borderless" id="table-info">
        <thead>
        <tbody>
          ${
            info.dateAchievementStr
              ? '<tr><td>Подвиг</td><td>' +
                info.dateAchievementStr +
                ' (' +
                info.achievementYearStr +
                ')' +
                delimSymbol +
                info.placeAchievement +
                '</td></tr>'
              : ''
          }
          ${
            info.dateDeathStr && info.dateDeathStr !== info.dateAchievementStr
              ? '<tr><td>Смерть</td><td>' +
                info.dateDeathStr +
                ' (' +
                info.deathYearStr +
                ')' +
                delimSymbol +
                info.placeDeath +
                '</td></tr>'
              : ''
          }
        </tbody>
      </table>
      <p>${info.description}</p>
      <div class="source-info">
        <a target='_blank' rel='noopener noreferrer' href=
        person/${info.pageUrl}>Подробнее</a>
      </div>
      </div>
    </div>
    `
    return html
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
        if (!info.personsBirth) return res
        res = info.personsBirth.map((elem) => {
          return {
            ...elem,
            point: elem.placeBirthCoords,
            icon: PersonFeature.getBirthIcon(),
            popupFirst: `${PersonFeature.getFio(elem)}`,
            popupSecond: `Дата рождения: ${DateHelper.dateToStr(
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
            point: elem.placeAchievementCoords,
            icon: PersonFeature.getAchievementIcon(),
            popupFirst: `${PersonFeature.getFio(elem)}`,
            popupSecond: `Дата подвига: ${DateHelper.dateToStr(
              elem.dateAchievement
            )}`,
            popupThird: `Место подвига: ${StrHelper.shrinkStringBeforeDelim(
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
            point: elem.placeDeathCoords,
            icon: PersonFeature.getDeathIcon(),
            popupFirst: `${PersonFeature.getFio(elem)}`,
            popupSecond: `Дата смерти: ${DateHelper.dateToStr(elem.dateDeath)}`,
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
