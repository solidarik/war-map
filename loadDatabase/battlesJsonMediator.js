const BattleModel = require('../models/battlesModel')
const dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol')
const geoHelper = require('../helper/geoHelper')
const strHelper = require('../helper/strHelper')
const fileHelper = require('../helper/fileHelper')
const SuperJsonMediator = require('./superJsonMediator')
const moment = require('moment')
const log = require('../helper/logHelper')
const convexHull = require('monotone-convex-hull-2d')

class BattlesJsonMediator extends SuperJsonMediator {
  constructor() {
    super()
    this.equilFields = ['startDate', '_name']
    this.model = BattleModel
  }

  getPlacesFromJson(json) {
    return new Promise((resolve, reject) => {
      let promicesName = json.map((item) =>
        dictEngRusProtocol.getEngRusObjectId(item.name)
      )
      Promise.all(promicesName)
        .then((objNames) => {
          return objNames
        })
        .then((objNames) => {
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
        .catch((err) => reject(`ошибка в getPlacesFromJson: ${err}`))
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
      //     .catch(err => reject(`ошибка в getAlliesFromJson: ${err}`));
    })
  }

  getAllCoordsFromMap(map) {
    let all_coords = []

    for (let i = 0; i < map.features.length; i++) {
      let geom = map.features[i].geometry
      if (geom.type === 'Point') {
        all_coords.push(geoHelper.fromLonLat(geom.coordinates))
      } else {
        let srcCoords =
          geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates
        for (let j = 0; j < srcCoords.length; j++) {
          all_coords.push(geoHelper.fromLonLat(srcCoords[j]))
        }
      }
    }
    return all_coords
  }

  getCenterOfCoords(all_coords) {
    return geoHelper.getMedianXY(all_coords)
  }

  getHullCoords(all_coords) {
    const hullIndexes = convexHull(all_coords)
    let hullCoords = []
    hullIndexes.forEach((idx) => {
      hullCoords.push(all_coords[idx])
    })
    return hullCoords
  }

  processJson(json, filePath = '') {
    return new Promise((resolve, reject) => {
      let promises = [
        dictEngRusProtocol.getEngRusObjectId(json.name), //name_id
        this.getAlliesFromJson(json.allies), //allies
        this.getAlliesFromJson(json.enemies), //enemies
      ]

      let maps = []
      if (!Array.isArray(json.features)) json.features = [json.features]

      json.features.forEach((featureFile) => {
        const featurePath = fileHelper.composePath('новые карты', featureFile)
        const map = fileHelper.getJsonFromFile(featurePath)
        maps.push(map)
      })

      const all_coords = this.getAllCoordsFromMap(maps[0])

      Promise.all(promises)
        .then((res) => {
          let [name_id, allies, enemies] = res

          const newJson = {
            ...json,
            _name: name_id,
            startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
            endDate: moment.utc(json.endDate, 'DD.MM.YYYY'),
            isWinnerUSSR: strHelper.compareEngLanguage(json.winner, 'CCCР'),
            isWinnerGermany: strHelper.compareEngLanguage(
              json.winner,
              'Германия'
            ),
            point: this.getCenterOfCoords(all_coords),
            hullCoords: this.getHullCoords(all_coords),
            filename: fileHelper.getFileNameFromPath(filePath),
            maps: maps,
          }

          resolve(newJson)
        })
        .catch((err) => reject(`ошибка в processJson: ${err}`))
    })
  }
}

module.exports = new BattlesJsonMediator()
