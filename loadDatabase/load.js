const log = require('../helper/logHelper')
const DbHelper = require('../loadDatabase/dbHelper')
const inetHelper = require('../helper/inetHelper')
const strHelper = require('../helper/strHelper')
const historyEventsJsonMediator = require('../loadDatabase/historyEventsJsonMediator')
const agreementsJsonMediator = require('../loadDatabase/agreementsJsonMediator')
const usersJsonMediator = require('../loadDatabase/usersJsonMediator')
const dictEngRusJsonMediator = require('../loadDatabase/dictEngRusJsonMediator')
const dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol')

console.log(strHelper.compareEngLanguage('СССР белоруссия', 'CCCР'))

// ;(async () => {
//   const coords = await inetHelper.getCoordsForCityOrCountry('Ньон')
//   console.log(coords)
// })()
// return
dbHelper = new DbHelper()

// dictEngRusProtocol
//   .getEngRusObjectId("блаблабла")
//   .then(obj => console.log(obj))
//   .then(() => {
//     dbHelper.free();
//   });

// return;

Promise.resolve(true)
  // .then(() => {
  //   return dbHelper.clearDb('users')
  // })
  // .then(() => {
  //   return dbHelper.clearDb('agreements')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFromDir({
  //     source: 'data_sources/secretUsers.json',
  //     mediator: usersJsonMediator
  //   })
  // })
  // .then(() => {
  //   return dbHelper.clearDb('dictEngRus')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFromDir({
  //     source: 'data_sources/engRus.json',
  //     mediator: dictEngRusJsonMediator
  //   })
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFromDir({
  //     source: 'python/out_agreements',
  //     mediator: agreementsJsonMediator
  //   })
  // })
  .then(() => {
    return dbHelper.clearDb('historyEvents')
  })
  .then(() => {
    return dbHelper.saveFilesFromDir({
      source: 'python/out_battles',
      mediator: historyEventsJsonMediator
    })
  })
  .then(() => {
    log.success(`Успешная загрузка`)
    dbHelper.free()
  })
  .catch(err => {
    dbHelper.free()
    log.error(`Ошибка загрузки данных: ${err}`)
  })
