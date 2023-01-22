
import fileHelper from '../helper/fileHelper.js'
import fs from 'fs'

const outFileName = './loadDatabase/personFile.csv'
const persons = fileHelper.getJsonFromFile('./public/data/persons.json')

let allRows = []
let keys = []

persons.forEach(person => {
    Object.keys(person).forEach(key => {
        if (-1 == keys.indexOf(key)) {
            keys.push(key)
        }
    })
})

const delim = '\t'
allRows.push(keys.join(delim))

persons.forEach(person => {
    let row = []
    keys.forEach(key => {
        let value = person[key]
        value = value ? `"${value}"` : '""'
        if (key.toLowerCase().indexOf('description') > -1) {
            value = value.replaceAll('\r\n\r\n', 'newline')
        }
        value = value.replaceAll('\r\n', ' ')
        console.log(value)
        row.push(value)
    })
    allRows.push(row.join(delim))
})

const BOM = "\uFEFF";
const data = BOM + allRows.join('\n')
fs.writeFileSync(outFileName, data)