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
    this.equilFields = ['startDate', '_name']
    this.model = AgreementsModel
  }

  async getPlaceCoords(place) {}

  processJson(json) {
    return new Promise((resolve, reject) => {
      let promises = [
        dictEngRusProtocol.getEngRusObjectId(json.name),
        this.getPlaceCoords(json.place)
      ]

      Promise.all(promises)
        .then(res => {
          let [name_id, placeCoords] = res

          const newJson = {
            _name: name_id,
            startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
            endDate: moment.utc(json.endDate, 'DD.MM.YYYY'),
            kind: json.kind ? json.kind : '',
            place: json.place,
            placeCoord: placeCoords,
            imgUrl: json.imgUrl,
            allies: allies,
            enemies: enemies,
            maps: maps,
            corvexes: corvexes
          }

          resolve(newJson)
        })
        .catch(err => reject(`Ошибка в processJson: ${err}`))
    })
  }
}

module.exports = new AgreementsJsonMediator()
