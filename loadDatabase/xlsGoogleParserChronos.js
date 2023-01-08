import DateHelper from '../helper/dateHelper.js'
import ChronosModel from '../models/chronosModel.js'
import XlsGoogleParser from './xlsGoogleParser.js'
import StrHelper from '../helper/strHelper.js'

const dateStopWords = ['посередине', 'середина', 'между', 'или',
    '—', '-', '—', 'первая', 'вторая', 'ранее', 'традиции', 'тексту', 'мира',
    'неизвестно', 'монастырь']

export default class XlsGoogleParserChronos extends XlsGoogleParser {

    constructor(log) {
        super()
        this.log = log
        this.name = 'ВОВ. События'
        this.pageUrls = ['place', 'brief']
        this.spreadsheetId = process.env.GOOGLE_SHEET_ID_CHRONOS
        this.range = 'A1:H'
        this.model = ChronosModel

        this.colCorresponds = {
            'loadStatus': 'статус загрузки',
            'place': 'город',
            'start': 'дата',
            'brief': 'описание',
            'srcUrl': 'источник',
            'remark': 'примечание',
            'comment': 'комментарий',
            'priority': 'приоритет'
        }
    }

    async getJsonFromRow(headerColumns, row) {

        let json = {errorArr: [], warningArr: [], lineSource: 0}

        try {
            json.brief = StrHelper.capitalizeFirstLetter(row[headerColumns.brief]).trim()
            json.srcUrl = row[headerColumns.srcUrl]
            json.remark = StrHelper.capitalizeFirstLetter(row[headerColumns.remark])
            json.comment = row[headerColumns.comment]
            json.place = StrHelper.capitalizeFirstLetter(row[headerColumns.place]).trim()
            json.priority = row[headerColumns.priority]

            const dateInput = row[headerColumns.start]
            try {
                if (dateInput.includes('-')) {
                    const arrDates = dateInput.split('-')
                    json.start = DateHelper.getDateFromInput(arrDates[0], dateStopWords)
                    json.end = DateHelper.getDateFromInput(arrDates[1], dateStopWords)
                }
                else {
                    json.start =  DateHelper.getDateFromInput(dateInput, dateStopWords)
                }
            } catch (err) {
                json.errorArr.push(`Не удалось распарсить дату ${dateInput}`)
            }

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

        } catch (e) {
            json.errorArr.push('' + e)
        }

        return json
    }

}