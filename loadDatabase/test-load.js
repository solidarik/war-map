const log = require('../helper/logHelper')
const inetHelper = require('../helper/inetHelper')
const fileHelper = require('../helper/fileHelper')
// const fs = require('fs')

let promises = [
  inetHelper.getCoordsForCityOrCountry('Бразилия'),
  inetHelper.getCoordsForCityOrCountry('Бразилиа')
]

let mainPromise = new Promise(resolve => {
  Promise.all(promises).then(
    res => {
      if (0 == res[0].length) console.log('Не смогли определить координаты')
      else console.log(res)
    },
    err => {
      console.log('error by promise all')
      resolve({ error: err })
    }
  )
})

mainPromise.then(
  res => console.log('all right', res),
  err => console.log('fuck')
)
