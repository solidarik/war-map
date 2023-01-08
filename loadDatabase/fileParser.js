import SuperParser from '../loadDatabase/superParser.js'
import FileHelper from '../helper/fileHelper.js'

export default class FileParser extends SuperParser {

    async * getDataGenerator() {

        const filepath = FileHelper.composePath(this.filepath)

        const rows = FileHelper.getJsonFromFile(filepath)
        // const allFileContents = fs.readFileSync(filepath, 'utf8');
        // const rows = allFileContents.split(/\r?\n/)
        if (!rows.length) return this.log.error('No data found')
        const maxRow = this.maxRow ? this.maxRow : rows.length

        for (let row = 0; row < maxRow; row++) {
            const json = await this.getJsonFromRow(rows[row])
            json.isSkip = json.isChecked ? json.isChecked == '0' : false
            yield json
        }

        return true
    }

}
