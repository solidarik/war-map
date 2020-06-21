const inetHelper = require('../helper/inetHelper')
const dateHelper = require('../helper/dateHelper')

const checkedCoordsPath = 'loadDatabase\\dataSources\\checkedCoords.json'
inetHelper.loadCoords(checkedCoordsPath)

const places = ''
const date = dateHelper.ignoreAlterDate(places)

console.log(`>>>>>>>> date ${date}`)
