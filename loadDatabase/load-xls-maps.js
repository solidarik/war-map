const xlsx = require('xlsx')
var workbook = xlsx.readFile('Битвы 3-8.xlsx')

let first_sheet_name = workbook.SheetNames[0]
let cell_address = 'A1'

let worksheet = workbook.Sheets[first_sheet_name]

let roa = xlsx.utils.sheet_to_json(worksheet)
console.log(roa.length)

let desired_cell = worksheet[cell_address]

let desired_value = (desired_cell ? desired_cell.v : undefined)

console.log(desired_value)