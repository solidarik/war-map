const BattleModel = require('../models/battlesModel')
const GeoHelper = require('../helper/geoHelper')
const StrHelper = require('../helper/strHelper')
const FileHelper = require('../helper/fileHelper')
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
        all_coords.push(GeoHelper.fromLonLat(geom.coordinates))
      } else {
        let srcCoords =
          geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates
        for (let j = 0; j < srcCoords.length; j++) {
          all_coords.push(GeoHelper.fromLonLat(srcCoords[j]))
        }
      }
    }
    return all_coords
  }

  getCenterOfCoords(all_coords) {
    return GeoHelper.getMedianXY(all_coords)
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
        const featurePath = FileHelper.composePath('новые карты', featureFile)
        const map = FileHelper.getJsonFromFile(featurePath)
        maps.push(map)
      })

      let centerOfFirstMaps
      let hullCoords = []
      for (let i = 0; i < maps.length; i++) {
        const all_coords = this.getAllCoordsFromMap(maps[i])
        hullCoords.push(this.getHullCoords(all_coords))
        if (i === 0) {
          centerOfFirstMaps = this.getCenterOfCoords(all_coords)
        }
      }

      const newJson = {
        ...json,
        startDate: moment.utc(json.startDate, 'DD.MM.YYYY'),
        endDate: moment.utc(json.endDate, 'DD.MM.YYYY'),
        isWinnerUSSR: StrHelper.compareEngLanguage(json.winner, 'CCCР'),
        isWinnerGermany: StrHelper.compareEngLanguage(json.winner, 'Германия'),
        point: centerOfFirstMaps,
        hullCoords: hullCoords,
        filename: FileHelper.getFileNameFromPath(filePath),
        maps: maps,
        pageUrl: StrHelper.generatePageUrl([
          json.name,
          json.startDate,
        ]),
      }

      resolve(newJson)
    })
  }
}

module.exports = new BattlesJsonMediator()
