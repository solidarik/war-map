const log = require('../helper/logHelper')
const inetHelper = require('../helper/inetHelper')
const fileHelper = require('../helper/fileHelper')

function smth() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('blablabla')
      resolve('yeeee')
    }, 5000)
  })
}

async function f() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('готово!'), 1000)
  })

  let result = await promise // будет ждать, пока промис не выполнится (*)

  console.log(result) // "готово!"
  console.log('after f')
}

f()

return

async function t() {
  console.log('before smth')
  res = await smth()
  console.log('after smth')
  return res
}

console.log('beforebefore')
console.log(t())
console.log('afterafter')

//fileHelper.saveJsonToFile(jsonData, 'test.log')

return

inetHelper
  .getCoordsForCityOrCountry('Вичуга')
  .then(res => {
    if (!res) console.log('Не смогли определить координаты')
    else console.log(res)
  })
  .catch(err => console.log(err))
