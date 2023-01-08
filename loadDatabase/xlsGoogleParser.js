import XlsHelper from '../helper/xlsHelper.js'
import authentication from '../loadDatabase/googleAuthentication.js'
import SuperParser from '../loadDatabase/superParser.js'

import { google } from 'googleapis'

export default class XlsGoogleParser extends SuperParser {

    async updateBackStatuses(loadStatuses) {
        const statusColumnName = XlsHelper.getColumnNameByNumber(this.headerColumns.loadStatus + 1)
        const statusRowStart = 2
        const statusRowEnd = loadStatuses.length + 1
        const statusRange = `${statusColumnName}${statusRowStart}:${statusColumnName}${statusRowEnd}`

        let authClient = undefined
        try {
            authClient = await authentication.authenticate()
        } catch(err) {
            throw `auth client error ${err}`
        }

        if (loadStatuses.length == 0) {
            throw `Ошибка получения статусов`
        }

        const resource = {
            range: statusRange,
            majorDimension: "COLUMNS",
            values: [loadStatuses]
        }

        try {
            const sheets = google.sheets({ version: 'v4' })

            await sheets.spreadsheets.values.update({
                auth: authClient,
                spreadsheetId: this.spreadsheetId,
                range: statusRange,
                valueInputOption: "USER_ENTERED",
                resource: resource
            })

            // if (JSON.stringify(sheetUpdateStatus) != '{}') {
            //     this.log.warn(`Ответ от Google Sheet: ${JSON.stringify(sheetUpdateStatus)}`)
            // }
        } catch(err) {
            this.log.error(`Проблема обновления Google: ${err}`)
        }
    }

    fillHeaderColumns(headerRow) {
        let headerColumns = {}
        for (let iCol = 0; iCol < headerRow.length; iCol++) {
            const xlsColName = headerRow[iCol].toLowerCase()
            for (let colModel in this.colCorresponds) {
                const colSearch = this.colCorresponds[colModel]
                if (xlsColName.includes(colSearch)) {
                    headerColumns[colModel] = iCol
                }
            }
        }
        return headerColumns
    }

    async * getDataGenerator() {

        const sheets = google.sheets({ version: 'v4' })

        const sheetData = await sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            key: process.env.GOOGLE_API_KEY,
            range: this.range
        })
        if (!sheetData) return this.log.error('The Google API returned an error')

        const rows = sheetData.data.values
        if (!rows.length) return this.log.error('No data found')

        this.headerColumns = this.fillHeaderColumns(rows[0])
        const maxRow = this.maxRow ? this.maxRow : rows.length
        for (let row = 1; row < maxRow; row++) {
            const json = await this.getJsonFromRow(this.headerColumns, rows[row])
            json.lineSource = row + 1
            json.isSkip = json.isChecked ? json.isChecked == '0' : false
            yield json
        }

        return true
    }

}
