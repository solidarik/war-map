const AgreementsModel = require('../models/agreementsModel')
const dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol')
const geoHelper = require('../helper/geoHelper')
const inetHelper = require('../helper/inetHelper')
const fileHelper = require('../helper/fileHelper')
const SuperJsonMediator = require('./superJsonMediator')
const moment = require('moment')
const log = require('../helper/logHelper')

class AgreementsJsonMediator extends SuperJsonMediator {
  constructor() {
    super()
    this.equilFields = ['startDate', 'place']
    this.model = AgreementsModel
  }

  processJson(json) {
    return new Promise((resolve, reject) => {
      let promises = [
        //dictEngRusProtocol.getEngRusObjectId(json.name),
        inetHelper.getCoordsForCityOrCountry(json.place)
      ]

      Promise.all(promises)
        .then(placeCoords => {
          placeCoords = placeCoords[0]
          const newJson = {
            // _name: name_id,
            startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
            endDate: moment.utc(json.endDate, 'DD.MM.YYYY'),
            kind: json.kind ? json.kind : '',
            place: json.place,
            placeCoords: placeCoords ? [placeCoords.lon, placeCoords.lat] : [],
            player1: json.player1,
            player2: json.player2,
            results: json.results,
            imgUrl: json.imgUrl,
            srcUrl: json.srcUrl
          }

          !placeCoords && console.log('json', newJson)

          resolve(newJson)
        })
        .catch(err => reject(`Ошибка в processJson: ${err}`))
    })
  }
}

module.exports = new AgreementsJsonMediator()
