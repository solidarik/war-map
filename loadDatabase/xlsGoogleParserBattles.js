import FileHelper from '../helper/fileHelper.js'
import StrHelper from '../helper/strHelper.js'
import BattlesModel from '../models/battlesModel.js'
import XlsGoogleParser from './xlsGoogleParser.js'
import GeoHelper from '../helper/geoHelper.js'

import moment from 'moment'
import convexHull from 'monotone-convex-hull-2d'

export default class XlsGoogleParserBattles extends XlsGoogleParser {

    constructor(log) {
        super()
        this.log = log
        this.name = 'ВОВ. Битвы'
        this.pageUrls = ['name', 'startDateStr']
        this.spreadsheetId = process.env.GOOGLE_SHEET_ID_BATTLES
        this.range = 'A1:AP'
        this.model = BattlesModel

        this.colCorresponds = {
            'loadStatus': 'статус загрузки',
            'mapFiles': 'файлы карт',
            'name': 'название',
            'startDate': 'дата начала',
            'endDate': 'дата окончания',
            'allies': 'участник1',
            'enemies': 'противник1',
            'ally_troops': 'численность1',
            'ally_tank_cnt': 'танки1',
            'ally_airplans_cnt': 'самолеты1',
            'ally_ships_cnt': 'корабли1',
            'ally_submarines_cnt': 'подлодки1',
            'ally_losses': 'потери1',
            'ally_deads': 'убитые1',
            'ally_prisoners': 'пленные1',
            'ally_woundeds': 'раненые1',
            'ally_missing': 'пропавшие1',
            'ally_tanks_lost': 'потеританки1',
            'ally_airplans_lost': 'потерисамолеты1',
            'ally_ships_lost': 'потерикорабли1',
            'ally_submarines_lost': 'потериподлодки1',
            'enem_troops': 'численность2',
            'enem_tanks_cnt': 'танки2',
            'enem_airplans_cnt': 'самолеты2',
            'enem_ships_cnt': 'корабли2',
            'enem_submarines_cnt': 'подлодки2',
            'enem_losses': 'потери2',
            'enem_deads': 'убитые2',
            'enem_prisoners': 'пленные2',
            'enem_woundeds': 'раненые2',
            'enem_missing': 'пропавшие2',
            'enem_tanks_lost': 'потеританки2',
            'enem_airplans_lost': 'потерисамолеты2',
            'enem_ships_lost': 'потерикорабли2',
            'enem_submarines_lost': 'потериподлодки2',
            'winner': 'победитель',
            'comment': 'комментарий',
            'correction': 'уточнение',
            'srcUrl': 'источник',
            'imgUrl': 'карта',
            'kind': 'тип',
            'place': 'место'
        }
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

    async getJsonFromRow(headerColumns, row) {

        let json = {errorArr: [], warningArr: [], lineSource: 0}

        try {

            Object.keys(headerColumns).forEach(colName => {
                json[colName] = row[headerColumns[colName]]
            })

            json.startDateStr = row[headerColumns.startDate]
            try {
                json.startDate = moment.utc(json.startDateStr, 'DD.MM.YYYY')
            } catch (err) {
                json.errorArr.push(`Не удалось распарсить дату начала ${json.startDateStr}`)
            }

            const endDateInput = row[headerColumns.startDate]
            try {
                json.endDate = moment.utc(endDateInput, 'DD.MM.YYYY')
            } catch (err) {
                json.errorArr.push(`Не удалось распарсить дату окончания ${endDateInput}`)
            }

            json.mapFiles = json.mapFiles.split(';')
            if (!Array.isArray(json.mapFiles)) json.mapFiles = [json.mapFiles]
            json.mapFiles = json.mapFiles.filter((item) => {return item != ''})

            let maps = []
            json.mapFiles.forEach((mapFile) => {
                let featurePath = FileHelper.composePath('loadDatabase', 'новые карты', mapFile)
                if (!featurePath.includes('.geojson')) {
                    featurePath = featurePath.trim() + '.geojson'
                }
                const map = FileHelper.getJsonFromFile(featurePath)
                maps.push(map)
            })
            json.maps = maps

            let centerOfFirstMaps
            let hullCoords = []
            for (let i = 0; i < maps.length; i++) {
                const all_coords = this.getAllCoordsFromMap(maps[i])
                hullCoords.push(this.getHullCoords(all_coords))
                if (i === 0) {
                    centerOfFirstMaps = this.getCenterOfCoords(all_coords)
                }
            }

            if (centerOfFirstMaps) {
                json.point = centerOfFirstMaps
            } else {
                let place = row[headerColumns.place]
                if (place)
                    place = place.trim()

                if (!place || place.toLowerCase() == 'неизвестно') {
                    json.errorArr.push('Пропуск пустого города')
                } else {
                    json.place = place
                    let coords = await this.getCoords(place, row[headerColumns.point])
                    if (coords) {
                        json.point = coords
                    } else {
                        json.errorArr.push(`Не определена координата события "${place}"`)
                    }
                }
            }

            json.isWinnerUSSR = StrHelper.compareEngLanguage(json.winner, 'CCCР')
            json.isWinnerGermany = StrHelper.compareEngLanguage(json.winner, 'Германия')
            json.hullCoords = hullCoords

        } catch (e) {
            json.errorArr.push('' + e)
        }

        return json
    }

}