import chalk from 'chalk'
import GeoHelper from '../helper/geoHelper.js'
import inetHelper from '../helper/inetHelper.js'
import DateHelper from '../helper/dateHelper.js'
import ServiceModel from '../models/serviceModel.js'
import StrHelper from '../helper/strHelper.js'

export default class SuperParser {

    async getCoords(inputPlace, inputCoords = undefined) {

        if (!inputPlace && !inputCoords) {
            return false
        }

        let coords = inetHelper.getLonLatSavedCoords(inputPlace)
        if (coords) {
            return GeoHelper.coordsToBaseFormat(coords)
        }

        if (inputCoords) {
            coords = GeoHelper.getCoordsFromHumanCoords(inputCoords)
            if (coords.length == 2) {
                inetHelper.addCoord(inputPlace, {lat: coords[1] , lon: coords[0]})
                return GeoHelper.fromLonLat(coords)
            }
        }

        // start search coordinates in wiki
        // const res = await inetHelper.searchCoordsByName(inputPlace)
        // if (res) {
        //     coords = res
        //     return GeoHelper.fromLonLat(coords)
        // }
        // end search

        // throw `Не удалось найти координату для ${inputPlace}`

        return false
    }

    getPageUrl(json) {
        const pageUrlsLocal = this.pageUrls.map((colName) => json[colName])
        return StrHelper.generatePageUrl(pageUrlsLocal)
    }

    async processData(dbHelper) {

        const modelName = this.model.collection.collectionName
        await dbHelper.clearModel(this.model)
        this.log.info(chalk.yellow(`Загрузка ${this.name}`))

        let insertObjects = []
        let pageUrlsGlobal = []
        let loadStatuses = []
        let totalCount = 0
        let successCount = 0
        let skipCount = 0

        const rows = await this.getDataGenerator()
        for await (const row of rows) {

            totalCount += 1
            const isSkip = row.isSkip ? row.isSkip : false

            const isError = row.errorArr.length > 0
            const errorStatus = row.errorArr.join('\r\n').replace('Error: ', '')

            const isWarning = row.warningArr.length > 0
            const warningStatus = '\r\nЗамечания: ' + row.warningArr.join('\r\n').replace('Error: ', '')
            let loadStatus = ''

            if (isSkip) {
                skipCount += 1
                loadStatus = `Пропущено согласно флагу`
            }
            else
            if (isError) {
                // this.log.error(`Ошибка обработки json: ${JSON.stringify(json)}`)
                loadStatus = errorStatus
            } else {
                successCount += 1
                loadStatus = isWarning ? 'Успешно, с замечаниями' : 'Успешно'
            }

            if (isWarning) {
                loadStatus += warningStatus
            }
            loadStatus = loadStatus.replaceAll('undefined', 'Пусто')

            row.isOnMap = !isError && !isSkip
            if (!isSkip) {
                insertObjects.push(row)
            }

            row.loadStatus = loadStatus
            row.pageUrl = this.getPageUrl(row)
            if (pageUrlsGlobal.includes(row.pageUrl)) {
                row.pageUrl = StrHelper.replaceEnd(row.pageUrl, '_' + Number(totalCount))
            }
            pageUrlsGlobal.push(row.pageUrl)
            loadStatuses.push(loadStatus)
        }

        if (typeof this.updateBackStatuses === 'function') {
            await this.updateBackStatuses(loadStatuses)
        }

        if (totalCount == 0) return this.log.error('Ошибка отсутствия данных')

        const savedCount = insertObjects.length
        const statusText = [successCount, savedCount, skipCount, totalCount].join(' / ')
        this.log.info(chalk.cyanBright(`Кол-во на карте/загруженных/пропущенных/всего: ${statusText}`))

        let res = await this.model.insertMany(insertObjects)

        if (!res) {
            this.log.error(chalk.red(`Ошибка при сохранении данных ${JSON.stringify(res)}`))
        }

        let serviceObjects = [
            { name: 'successObjectCount', value: successCount },
            { name: 'skipObjectCount', value: skipCount },
            { name: 'savedCount', value: savedCount },
            { name: 'totalCount', value: totalCount },
            { name: 'statusText', value: statusText },
            { name: 'checkedTime', value: DateHelper.dateTimeToStr(new Date()) }
        ]

        serviceObjects = serviceObjects.map(obj => { return { ...obj, 'model': modelName } })

        res = await ServiceModel.deleteMany({'model': modelName})
        res = await ServiceModel.insertMany(serviceObjects)

        if (!res) {
            this.log.error(chalk.red(`Ошибка при сохранении статуса ${JSON.stringify(res)}`))
        }

        return true
    }

}
