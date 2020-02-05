const PersonsModel = require('../models/personsModel')
const dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol')
const geoHelper = require('../helper/geoHelper')
const inetHelper = require('../helper/inetHelper')
const fileHelper = require('../helper/fileHelper')
const SuperJsonMediator = require('./superJsonMediator')
const moment = require('moment')
const log = require('../helper/logHelper')

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
        inetHelper.getCoordsForCityOrCountry(json.PlaceDeath)
      ]

      Promise.all(promises)
        .then(coords => {
          const placeAchievementCoords = coords[0]
          const placeBirthCoords = coords[1]
          const placeDeathCoords = coords[2]

          const newJson = {
            surname: json.Surname,
            name: json.Name,
            middlename: json.MiddleName,
            dateBirth: moment.utc(json.DateBirth, 'DD.MM.YYYY'),
            dateDeath: moment.utc(json.DateDeath, 'DD.MM.YYYY'),
            description: json.Description,
            fullDescription: json.FullDescription,
            srcUrl: json.Source,
            photoUrl: json.PhotoUrl,
            linkUrl: json.Link,
            placeAchievement: json.PlaceAchievement,
            placeAchievementCoords: placeAchievementCoords
              ? [placeAchievementCoords.lon, placeAchievementCoords.lat]
              : [],
            placeBirth: json.PlaceBirth,
            placeBirthCoords: placeBirthCoords
              ? [placeBirthCoords.lon, placeBirthCoords.lat]
              : [],
            placeDeath: json.PlaceDeath,
            placeDeathCoords: placeDeathCoords
              ? [placeDeathCoords.lon, placeDeathCoords.lat]
              : []
          }

          resolve(newJson)
        })
        .catch(err => reject(`Ошибка в processJson: ${err}`))
    })
  }

  afterProcessJson(json) {
    console.log(json.place, json.placeCoords)
  }
}

module.exports = new PersonsJsonMediator()
