const log = require('../helper/logHelper')
const inetHelper = require('../helper/inetHelper')
const fileHelper = require('../helper/fileHelper')

const jsonData = {
  coord: [12, 345.4],
  name: 'Проверка записи Json',
  param: false
}

fileHelper.saveJsonToFile(jsonData, 'test.log')

return

inetHelper
  .getCoordsForCityOrCountry('Вичуга')
  .then(res => {
    if (!res) console.log('Не смогли определить координаты')
    else console.log(res)
  })
  .catch(err => console.log(err))
