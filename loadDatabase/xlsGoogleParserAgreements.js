import StrHelper from '../helper/strHelper.js'
import AgreementsModel from '../models/agreementsModel.js'
import XlsGoogleParser from './xlsGoogleParser.js'
import moment from 'moment'

const dateStopWords = ['посередине', 'середина', 'между', 'или',
    '—', '-', '—', 'первая', 'вторая', 'ранее', 'традиции', 'тексту', 'мира',
    'неизвестно', 'монастырь']

export default class XlsGoogleParserAgreements extends XlsGoogleParser {

    constructor(log) {
        super()
        this.log = log
        this.name = 'ВОВ. Международные отношения'
        this.pageUrls = ['kind', 'place']
        this.spreadsheetId = process.env.GOOGLE_SHEET_ID_AGREEMENTS
        this.range = 'A1:J'
        this.model = AgreementsModel
        this.colCorresponds = {
            'loadStatus': 'статус загрузки',
            'kind': 'тип',
            'place': 'место',
            'startDate': 'начало',
            'endDate': 'окончание',
            'player1': 'участник1',
            'player2': 'участник2',
            'results': 'результаты',
            'srcUrl': 'источник',
            'imgUrl': 'карта'
        }
    }

    async getJsonFromRow(headerColumns, row) {

        let json = {errorArr: [], warningArr: [], lineSource: 0}

        try {
            json.kind = row[headerColumns.kind].trim()
            json.place = row[headerColumns.place].trim()
            json.player1 = row[headerColumns.player1]
            json.player2 = row[headerColumns.player2]
            json.results = StrHelper.capitalizeFirstLetter(row[headerColumns.results])
            json.srcUrl = row[headerColumns.srcUrl]
            json.imgUrl = row[headerColumns.imgUrl]

            const startDateInput = row[headerColumns.startDate]
            try {
                json.startDate = moment.utc(startDateInput, 'DD.MM.YYYY')
                json.startDateStr = startDateInput
            } catch (err) {
                json.errorArr.push(`Не удалось распарсить дату начала ${startDateInput}`)
            }

            const endDateInput = row[headerColumns.startDate]
            try {
                json.endDate = moment.utc(endDateInput, 'DD.MM.YYYY')
                json.endDateStr = endDateInput
            } catch (err) {
                json.errorArr.push(`Не удалось распарсить дату окончания ${endDateInput}`)
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