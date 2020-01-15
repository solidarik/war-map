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
    this.equilFields = ['startDate', 'place', 'brief']
    this.model = ChronosModel
  }

  processJson(json) {
    return new Promise(resolve => {
      if (json.hasOwnProperty('placeCoords')) {
        resolve(json)
      }

      inetHelper
        .getCoordsForCityOrCountry(json.place)
        .then(placeCoords => {
          if (placeCoords.length == 0)
            resolve({ error: `Не удалось определить координаты` })
          const newJson = {
            // _name: name_id,
            startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
            isOnlyYear: json.isOnlyYear == 'True' ? true : false,
            place: json.place,
            placeCoords: placeCoords ? [placeCoords.lon, placeCoords.lat] : [],
            brief: json.brief,
            url: json.url
          }
          resolve(newJson)
        })
        .catch(err => {
          console.log(`reject: ${json.place}`)
          resolve({ error: `Ошибка в processJson: ${err}` })
        })
    })
  }
}

module.exports = new ChronosJsonMediator()
