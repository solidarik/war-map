const PersonsModel = require('../models/personsModel')
const StrHelper = require('../helper/strHelper')
const DateHelper = require('../helper/dateHelper')
const inetHelper = require('../helper/inetHelper')
const SuperJsonMediator = require('./superJsonMediator')

class PersonsJsonMediator extends SuperJsonMediator {
  constructor() {
    super()
    this.equilFields = ['surname', 'name', 'middlename']
    this.model = PersonsModel
  }

  checkJsonSync(json) {
    return json.placeBirthCoords.length > 0
  }

  processJson(json) {
    return new Promise((resolve, reject) => {
      if (json.placeBirthCoords) {
        resolve(json)
        return
      }

      let promises = [
        inetHelper.getCoordsForCityOrCountry(json.PlaceAchievement),
        inetHelper.getCoordsForCityOrCountry(json.PlaceBirth),
        inetHelper.getCoordsForCityOrCountry(json.PlaceDeath),
      ]

      Promise.all(promises)
        .then((coords) => {
          const placeAchievementCoords = coords[0]
          const placeBirthCoords = coords[1]
          const placeDeathCoords = coords[2]

          const newJson = {
            surname: json.Surname,
            name: json.Name,
            middlename: json.MiddleName,
            dateBirth: DateHelper.ignoreAlterDate(json.DateBirth),
            dateBirthStr: json.DateBirth,
            dateDeath: DateHelper.ignoreAlterDate(json.DateDeath),
            dateDeathStr: json.DateDeath,
            dateAchievement: DateHelper.ignoreAlterDate(json.DateAchievement),
            dateAchievementStr: json.DateAchievement,
            deathYearStr: DateHelper.betweenYearTwoDates(
              json.DateBirth,
              json.DateDeath
            ),
            achievementYearStr: DateHelper.betweenYearTwoDates(
              json.DateBirth,
              json.DateAchievement
            ),
            description: json.Description,
            fullDescription: json.FullDescription,
            pageUrl:
              'person/#sel=' +
              StrHelper.generatePageUrl([
                json.Surname,
                json.Name,
                json.DateBirth,
              ]),
            srcUrl: json.Source,
            photoUrl: json.PhotoUrl,
            linkUrl: json.Link,
            placeAchievement: json.PlaceAchievement,
            placeAchievementCoords: placeAchievementCoords,
            placeBirth: json.PlaceBirth,
            placeBirthCoords: placeBirthCoords,
            placeDeath: json.PlaceDeath,
            placeDeathCoords: placeDeathCoords,
          }

          resolve(newJson)
        })
        .catch((err) => reject(`ошибка в processJson: ${err}`))
    })
  }

  afterProcessJson(json) {
    console.log(json.name, json.middlename)
  }
}

module.exports = new PersonsJsonMediator()
