const strHelper = require('../helper/strHelper')

let value = strHelper.getNumber('более 23482289737,345 1000.523 важно 555100')
value = strHelper.numberWithCommas(value)

console.log(`>>>>>>>> value ${value}`)
