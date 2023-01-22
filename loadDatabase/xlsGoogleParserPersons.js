import PersonModel from '../models/personsModel.js'
import XlsGoogleParser from './xlsGoogleParser.js'
import DateHelper from '../helper/dateHelper.js'
import Jimp from 'jimp'
import ImageHelper from '../helper/imageHelper.js'
import StrHelper from '../helper/strHelper.js'

export default class XlsGoogleParserPersons extends XlsGoogleParser {

    constructor(log) {
        super()
        this.log = log
        this.name = 'ВОВ. Герои'
        this.pageUrls = ['surname', 'name']
        this.spreadsheetId = process.env.GOOGLE_SHEET_ID_PERSONS
        this.range = 'A1:Q'
        this.model = PersonModel
        // this.maxRow = 5

        this.colCorresponds = {
            'loadStatus': 'статус загрузки',
            'surname': 'фамилия',
            'name': 'имя',
            'middlename': 'отчество',
            'dateBirthStr': 'дата рождения',
            'placeBirth': 'место рождения',
            'isInvertor': 'изобретатель',
            'activity': 'профессия',
            'description': 'краткое описание',
            'photoUrl': 'фото',
            'dateDeathStr': 'дата смерти',
            'placeDeath': 'место смерти',
            'dateAchievementStr': 'дата подвига',
            'placeAchievement': 'место подвига',
            'fullDescription': 'полное описание',
            'srcUrl': 'источник',
            'links': 'дописточники'
        }
    }

    async getJsonFromRow(headerColumns, row) {

        let json = {errorArr: [], warningArr: [], lineSource: 0}

        try {
            json.surname = row[headerColumns.surname]
            json.name = row[headerColumns.name]
            json.middlename = row[headerColumns.middlename]

            json.dateBirth = DateHelper.ignoreAlterDate(row[headerColumns.dateBirthStr])
            json.dateBirthStr = row[headerColumns.dateBirthStr]
            json.dateDeath = DateHelper.ignoreAlterDate(row[headerColumns.dateDeathStr])
            json.dateDeathStr = row[headerColumns.dateDeathStr]
            json.dateAchievement = DateHelper.ignoreAlterDate(row[headerColumns.dateAchievementStr])
            json.dateAchievementStr = row[headerColumns.dateAchievementStr]

            json.deathYearStr = DateHelper.betweenYearTwoDates(
                json.dateBirthStr, json.dateDeathStr)
            json.achievementYearStr = DateHelper.betweenYearTwoDates(
                json.dateBirthStr, json.dateAchievementStr)

            json.description = row[headerColumns.description]
            json.fullDescription = row[headerColumns.fullDescription]
            json.srcUrl = row[headerColumns.srcUrl]

            const pageUrl = this.getPageUrl(json)

            try {
                let photoUrl = row[headerColumns.photoUrl]
                if (photoUrl) {
                    photoUrl = photoUrl.replaceAll('\\', '/')
                    if (photoUrl[0] == '/') {
                        const filename = StrHelper.getLastAfterDelim(photoUrl, '/')
                        photoUrl = `public/img/person/${filename}`
                    } else {
                        const middleUrl = `public/img/person-middle/${pageUrl}.png`
                        const res = await ImageHelper.loadImageToFile(photoUrl, middleUrl)
                        if (res.error) {
                            throw Error(`Не удалось обработать фото ${row[headerColumns.photoUrl]}`)
                        }
                        photoUrl = middleUrl
                    }

                    const destFullUrl = `public/img/person-full/${pageUrl}.png`

                    let photo = await Jimp.read(photoUrl)

                    await photo.getBufferAsync(Jimp.MIME_PNG)
                    let writeResult = await photo.writeAsync(destFullUrl)

                    const destShortUrl = `public/img/person-short/${pageUrl}.png`
                    photo.resize(600, Jimp.AUTO).quality(100)
                    writeResult = await photo.writeAsync(destShortUrl)
                    json.photoFullUrl = `/img/person-full/${pageUrl}.png`
                    json.photoShortUrl = `/img/person-short/${pageUrl}.png`
                }
            } catch (err) {
                // console.error(err)
                json.warningArr.push('' + err)
            }

            if (row[headerColumns.links]) {
                json.linkUrls = row[headerColumns.links].split(' http')
                json.linkUrls = json.linkUrls.filter(item => (item && item.length != 0))
                json.linkUrls = json.linkUrls.map((item, idx) => (idx == 0 ? item : 'http' + item))
            }

            json.placeAchievement = row[headerColumns.placeAchievementStr]
            json.placeAchievementCoords = await this.getCoords(row[headerColumns.placeAchievement])
            if (!json.placeAchievementCoords)
                json.warningArr.push(`Не удалось найти координату достижения ${json.placeAchievement}`)

            json.placeBirth = row[headerColumns.placeBirth]
            json.placeBirthCoords = await this.getCoords(json.placeBirth)
            if (!json.placeBirthCoords)
                json.errorArr.push(`Не удалось найти координату рождения ${json.placeBirth}`)

            json.placeDeath = row[headerColumns.placeDeath]
            json.placeDeathCoords = await this.getCoords(json.placeDeath)
            if (!json.placeDeathCoords)
                json.errorArr.push(`Не удалось найти координату рождения ${json.placeDeath}`)
            json.activity = row[headerColumns.activity]

            json.isInvertor = row[headerColumns.isInvertor] == 'да' ? true : false
        } catch(err) {
            console.log(err)
            json.errorArr.push('' + err)
        }

        return json
    }

}