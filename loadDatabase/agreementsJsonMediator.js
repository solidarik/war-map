const AgreementsModel = require('../models/agreementsModel')
const geoHelper = require('../helper/geoHelper')
const inetHelper = require('../helper/inetHelper')
const SuperJsonMediator = require('./superJsonMediator')
const moment = require('moment')

class AgreementsJsonMediator extends SuperJsonMediator {
  constructor() {
    super()
    this.equilFields = ['startDate', 'place']
    this.model = AgreementsModel
  }

  processJson(json) {
    return new Promise((resolve, reject) => {
      let promises = [inetHelper.getCoordsForCityOrCountry(json.place)]

      Promise.all(promises)
        .then((placeCoords) => {
          placeCoords = placeCoords[0]
          placeCoords = geoHelper.fromLonLat([placeCoords.lon, placeCoords.lat])
          const newJson = {
            startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
            endDate: moment.utc(json.endDate, 'DD.MM.YYYY'),
            kind: json.kind ? json.kind : '',
            place: json.place,
            point: placeCoords ? placeCoords : [],
            player1: json.player1,
            player2: json.player2,
            results: json.results,
            imgUrl: json.imgUrl,
            srcUrl: json.srcUrl,
          }

          !placeCoords && console.log('json', newJson)

          resolve(newJson)
        })
        .catch((err) => reject(`ошибка в processJson: ${err}`))
    })
  }
}

module.exports = new AgreementsJsonMediator()
