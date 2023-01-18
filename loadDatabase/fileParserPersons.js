import FileParser from '../loadDatabase/fileParser.js'
import PersonModel from '../models/personsModel.js'
import DateHelper from '../helper/dateHelper.js'
import Jimp from 'jimp'
import ImageHelper from '../helper/imageHelper.js'
import StrHelper from '../helper/strHelper.js'

export default class FileParserPersons extends FileParser {

    constructor(log, filepath) {
        super()
        this.log = log
        this.name = 'ВОВ. Персоны'
        this.pageUrls = ['surname', 'name']
        this.model = PersonModel
        this.filepath = filepath
        // this.maxRow = 2
    }

    async getJsonFromRow(row) {

        let json = {errorArr: [], warningArr: [], lineSource: 0}

        try {
            json.surname = row.Surname
            json.name = row.Name
            json.middlename = row.MiddleName
            json.dateBirth = DateHelper.ignoreAlterDate(row.DateBirth)
            json.dateBirthStr = row.DateBirth
            json.dateDeath = DateHelper.ignoreAlterDate(row.DateDeath)
            json.dateDeathStr = row.DateDeath
            json.dateAchievement = DateHelper.ignoreAlterDate(row.DateAchievement)
            json.dateAchievementStr = row.DateAchievement
            json.deathYearStr = DateHelper.betweenYearTwoDates(
                row.DateBirth, row.DateDeath)
            json.achievementYearStr = DateHelper.betweenYearTwoDates(
                row.DateBirth, row.DateAchievement)
            json.description = row.Description
            json.fullDescription = row.FullDescription
            json.srcUrl = row.Source

            console.log(json.surname)

            const pageUrl = this.getPageUrl(json)

            try {
                let photoUrl = row.PhotoUrl
                if (photoUrl) {
                    photoUrl = photoUrl.replaceAll('\\', '/')
                    if (photoUrl[0] == '/') {
                        const filename = StrHelper.getLastAfterDelim(photoUrl, '/')
                        photoUrl = `public/img/person/${filename}`
                    } else {
                        const middleUrl = `public/img/person-middle/${pageUrl}.png`
                        const res = await ImageHelper.loadImageToFile(photoUrl, middleUrl)
                        if (res.error) {
                            throw Error(`Не удалось обработать фото ${row.PhotoUrl}: ${res.error}`)
                        }
                        photoUrl = middleUrl
                    }

                    const destFullUrl = `public/img/person-full/${pageUrl}.png`

                    let photo = await Jimp.read(photoUrl)

                    await photo.getBufferAsync(Jimp.MIME_PNG)
                    let writeResult = await photo.writeAsync(destFullUrl)

                    const destShortUrl = `public/img/person-short/${pageUrl}.png`
                    photo.resize(256, Jimp.AUTO).quality(100)
                    writeResult = await photo.writeAsync(destShortUrl)
                    json.photoFullUrl = `/img/person-full/${pageUrl}.png`
                    json.photoShortUrl = `/img/person-short/${pageUrl}.png`
                }
            } catch (err) {
                console.error(err)
                json.warningArr.push('' + err)
            }

            json.linkUrls = row.Link.split(' http')
            json.linkUrls = json.linkUrls.filter(item => (item && item.length != 0))
            json.linkUrls = json.linkUrls.map((item, idx) => (idx == 0 ? item : 'http' + item))
            json.placeAchievement = row.PlaceAchievement
            json.placeAchievementCoords = await this.getCoords(row.PlaceAchievement)
            if (!json.placeAchievementCoords)
                json.errorArr.push(`Не удалось найти координату достижения ${row.PlaceAchievement}`)
            json.placeBirth = row.PlaceBirth
            json.placeBirthCoords = await this.getCoords(row.PlaceBirth)
            if (!json.placeBirthCoords)
                json.errorArr.push(`Не удалось найти координату рождения ${row.PlaceBirth}`)
            json.placeDeath = row.PlaceDeath
            json.placeDeathCoords = await this.getCoords(row.PlaceDeath)
            if (!json.placeDeathCoords)
                json.errorArr.push(`Не удалось найти координату рождения ${row.PlaceDeath}`)
            json.activity = row.FieldActivity
        } catch(err) {
            console.log(err)
            json.errorArr.push('' + err)
        }

        return json
    }
}
