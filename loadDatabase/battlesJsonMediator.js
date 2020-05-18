const BattleModel = require('../models/battlesModel')
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
      let maps = []
      if (!Array.isArray(json.features)) json.features = [json.features]

      json.features.forEach((featureFile) => {
        const featurePath = fileHelper.composePath('новые карты', featureFile)
        const map = fileHelper.getJsonFromFile(featurePath)
        maps.push(map)
      })

      const all_coords = this.getAllCoordsFromMap(maps[0])

      const newJson = {
        ...json,
        startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
        endDate: moment.utc(json.endDate, 'DD.MM.YYYY'),
        isWinnerUSSR: strHelper.compareEngLanguage(json.winner, 'CCCР'),
        isWinnerGermany: strHelper.compareEngLanguage(json.winner, 'Германия'),
        point: this.getCenterOfCoords(all_coords),
        hullCoords: this.getHullCoords(all_coords),
        filename: fileHelper.getFileNameFromPath(filePath),
        maps: maps,
      }

      resolve(newJson)
    })
  }
}

module.exports = new BattlesJsonMediator()
