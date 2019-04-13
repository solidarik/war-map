const HistoryEventsModel = require('../models/historyEventsModel')
const dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol')
const geoHelper = require('../helper/geoHelper')
const inetHelper = require('../helper/inetHelper')
const fileHelper = require('../helper/fileHelper')
const SuperJsonMediator = require('./superJsonMediator')
const moment = require('moment')
const log = require('../helper/logHelper')
const convexHull = require('monotone-convex-hull-2d')

class HistoryEventsJsonMediator extends SuperJsonMediator {
  constructor() {
    super()
    this.equilFields = ['startDate', '_name']
    this.model = HistoryEventsModel
  }

  getPlacesFromJson(json) {
    return new Promise((resolve, reject) => {
      let promicesName = json.map(item =>
        dictEngRusProtocol.getEngRusObjectId(item.name)
      )
      Promise.all(promicesName)
        .then(objNames => {
          return objNames
        })
        .then(objNames => {
          let places = []
          for (let i = 0; i < json.length; i++) {
            let place = {}
            let obj = json[i]
            place.coordinates = geoHelper.fromLonLat(obj.lonlat_coordinates)
            place.name = objNames[i]
            places.push(place)
          }
          resolve(places)
        })
        .catch(err => reject(`Ошибка в getPlacesFromJson: ${err}`))
    })
  }

  getAlliesFromJson(json) {
    return new Promise((resolve, reject) => {
      resolve(json)

      // soli
      //   let allies = [];
      //   let promicesName = json.map(item =>
      //     dictEngRusProtocol.getEngRusObjectId(item.name)
      //   );

      //   Promise.all(promicesName)
      //     .then(allyNames => {
      //       return allyNames;
      //     })
      //     .then(allyNames => {
      //       for (let i = 0; i < json.length; i++) {
      //         let ally = {};
      //         let obj = json[i];
      //         ally.name = allyNames[i];
      //         ally.troops = obj.troops;
      //         ally.losses = obj.losses;
      //         ally.woundeds = obj.woundeds;
      //         ally.prisoners = obj.prisoners;
      //         ally.winner = obj.hasOwnProperty("winner") ? true : false;
      //         allies.push(ally);
      //       }
      //       resolve(allies);
      //     })
      //     .catch(err => reject(`Ошибка в getAlliesFromJson: ${err}`));
    })
  }

  getCorvexFromPath(path) {}

  processJson(json, filePath = '') {
    return new Promise((resolve, reject) => {
      let promises = [
        dictEngRusProtocol.getEngRusObjectId(json.name), //name_id
        this.getAlliesFromJson(json.allies), //allies
        this.getAlliesFromJson(json.enemies) //enemies
      ]

      var maps = []
      var corvexes = []
      if (!Array.isArray(json.features)) json.features = [json.features]

      json.features.forEach(featureFile => {
        let featurePath = fileHelper.composePath('новые карты', featureFile)
        console.log('>>>> featurePath', featurePath)
        corvexes.push(this.getCorvexFromPath(featurePath))
        maps.push(fileHelper.getJsonFromFile(featurePath))
      })

      Promise.all(promises)
        .then(res => {
          let [name_id, allies, enemies] = res

          const newJson = {
            ...json,
            _name: name_id,
            startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
            endDate: moment.utc(json.endDate, 'DD.MM.YYYY'),
            allies: allies,
            enemies: enemies,
            filename: fileHelper.getFileNameFromPath(filePath),
            maps: maps,
            corvexes: corvexes
          }

          resolve(newJson)
        })
        .catch(err => reject(`Ошибка в processJson: ${err}`))
    })
  }
}

module.exports = new HistoryEventsJsonMediator()
