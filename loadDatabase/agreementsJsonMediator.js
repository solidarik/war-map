const AgreementsModel = require('../models/agreementsModel')
const InetHelper = require('../helper/inetHelper')
const StrHelper = require('../helper/strHelper')
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
      InetHelper.getCoordsForCityOrCountry(json.place)
        .then((placeCoords) => {
          const newJson = {
            startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
            endDate: moment.utc(json.endDate, 'DD.MM.YYYY'),
            startDateStr: json.startDate,
            endDateStr: json.endDate,
            kind: json.kind ? json.kind : '',
            place: json.place,
            point: placeCoords[0],
            player1: json.player1,
            player2: json.player2,
            results: json.results,
            imgUrl: json.imgUrl,
            srcUrl: json.srcUrl,
            pageUrl: StrHelper.generatePageUrl([json.kind]),
          }

          !placeCoords && console.log('json', newJson)

          resolve(newJson)
        })
        .catch((err) => {
          resolve({ error: `ошибка в processJson: ${err}` })
        })
    })
  }
}

module.exports = new AgreementsJsonMediator()
