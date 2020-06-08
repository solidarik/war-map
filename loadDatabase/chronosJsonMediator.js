const ChronosModel = require('../models/chronosModel')
const inetHelper = require('../helper/inetHelper')
const SuperJsonMediator = require('./superJsonMediator')
const moment = require('moment')

class ChronosJsonMediator extends SuperJsonMediator {
  constructor() {
    super()
    this.equilFields = ['startDate', 'place', 'brief']
    this.model = ChronosModel
  }

  processJson(json) {
    return new Promise((resolve) => {
      if (json.hasOwnProperty('placeCoords')) {
        resolve(json)
      }

      inetHelper
        .getCoordsForCityOrCountry(json.place)
        .then((placeCoords) => {
          if (placeCoords.length == 0)
            resolve({ error: `не удалось определить координаты` })
          const newJson = {
            // _name: name_id,
            startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
            isOnlyYear: json.isOnlyYear == 'True' ? true : false,
            place: json.place,
            placeCoords: placeCoords,
            brief: json.brief,
            srcUrl: json.srcUrl,
          }
          resolve(newJson)
        })
        .catch((err) => {
          resolve({ error: `ошибка в processJson: ${err}` })
        })
    })
  }
}

module.exports = new ChronosJsonMediator()
