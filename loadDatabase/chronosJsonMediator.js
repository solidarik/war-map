const ChronosModel = require('../models/chronosModel')
const dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol')
const geoHelper = require('../helper/geoHelper')
const inetHelper = require('../helper/inetHelper')
const fileHelper = require('../helper/fileHelper')
const SuperJsonMediator = require('./superJsonMediator')
const moment = require('moment')
const log = require('../helper/logHelper')

class ChronosJsonMediator extends SuperJsonMediator {
  constructor() {
    super()
    this.equilFields = ['startDate', 'place']
    this.model = ChronosModel
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
            place: json.place,
            placeCoords: placeCoords ? [placeCoords.lon, placeCoords.lat] : [],
            brief: json.brief,
            url: json.url
          }

          !placeCoords && console.log('json', newJson)

          resolve(newJson)
        })
        .catch(err => reject(`Ошибка в processJson: ${err}`))
    })
  }
}

module.exports = new ChronosJsonMediator()
