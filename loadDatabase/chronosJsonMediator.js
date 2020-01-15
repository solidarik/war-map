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

  checkJsonSync(json) {
    return (
      json && json.hasOwnProperty('placeCoords') && json.placeCoords.length > 0
    )
  }

  processJsonSync(json) {
    const p = new Promise(resolve => {
      if (json.hasOwnProperty('placeCoords')) {
        return json
      }

      let promises = [
        //dictEngRusProtocol.getEngRusObjectId(json.name),
        inetHelper.getCoordsForCityOrCountry(json.place)
      ]

      console.log(json.place)

      Promise.all(promises).then(
        placeCoords => {
          placeCoords = placeCoords[0]
          const newJson = {
            // _name: name_id,
            startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
            isOnlyYear: json.isOnlyYear == 'True' ? true : false,
            place: json.place,
            placeCoords: placeCoords ? [placeCoords.lon, placeCoords.lat] : [],
            brief: json.brief,
            url: json.url
          }
          return newJson
        },
        err => {
          return { error: `Ошибка в processJson: ${err}` }
        }
      )
    }).then(res => resolve(res))
  }
}

module.exports = new ChronosJsonMediator()
