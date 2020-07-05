const ChronosModel = require('../models/chronosModel')
const inetHelper = require('../helper/inetHelper')
const StrHelper = require('../helper/strHelper')
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
            startDateStr: json.startDate,
            startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
            isOnlyYear: json.isOnlyYear == 'True' ? true : false,
            place: json.place,
            point: placeCoords[0],
            brief: json.brief,
            srcUrl: json.srcUrl,
            pageUrl: StrHelper.generatePageUrl([
              json.place,
              json.startDate,
              json.brief,
            ]),
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
