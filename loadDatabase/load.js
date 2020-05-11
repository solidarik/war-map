const chalk = require('chalk')
const log = require('../helper/logHelper')
const dateHelper = require('../helper/dateHelper')

const DbHelper = require('../loadDatabase/dbHelper')
const inetHelper = require('../helper/inetHelper')
const strHelper = require('../helper/strHelper')
const historyEventsJsonMediator = require('../loadDatabase/historyEventsJsonMediator')
const agreementsJsonMediator = require('../loadDatabase/agreementsJsonMediator')
const chronosJsonMediator = require('../loadDatabase/chronosJsonMediator')
const personsJsonMediator = require('../loadDatabase/personsJsonMediator')
const usersJsonMediator = require('../loadDatabase/usersJsonMediator')
const dictEngRusJsonMediator = require('../loadDatabase/dictEngRusJsonMediator')
const dictEngRusProtocol = require('../socketProtocol/dictEngRusProtocol')
const loadPersons = require('../loadDatabase/loadPersons')

// loadPersons.download(
//   'http://www.historian.by/ww2/person.xlsx',
//   './public/data/persons.xlsx',
//   loadPersons.parseExcel
// )
// console.info('cron job completed')
// return

// ;(async () => {
//   const coords = await inetHelper.getCoordsForCityOrCountry('Ньон')
//   console.log(coords)
// })()
// return
const checkedCoordsPath = 'loadDatabase\\dataSources\\checkedCoords.json'
inetHelper.loadCoords(checkedCoordsPath)

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
  //   return dbHelper.saveFilesFrom({
  //     source: 'dataSources/secretUsers.json',
  //     mediator: usersJsonMediator
  //   })
  // })
  // .then(() => {
  //   return dbHelper.clearDb('dictEngRus')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFrom({
  //     source: 'dataSources/engRus.json',
  //     mediator: dictEngRusJsonMediator
  //   })
  // })
  // .then(() => {
  //   return dbHelper.clearDb('chronos')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFrom({
  //     source: 'python/out_chronos',
  //     procdir: 'python/out_chronos_process',
  //     errdir: 'python/out_chronos_errors',
  //     mediator: chronosJsonMediator,
  //   })
  // })
  // .then(() => {
  //   return dbHelper.clearDb('agreements')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFrom({
  //     source: 'python/out_agreements',
  //     procdir: 'python/out_agreements_process',
  //     errdir: 'python/out_agreements_errors',
  //     mediator: agreementsJsonMediator,
  //   })
  // })
  // .then(() => {
  //   return dbHelper.clearDb('historyEvents')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFrom({
  //     source: 'python/out_battles',
  //     procdir: 'python/out_battles_process',
  //     errdir: 'python/out_battles_errors',
  //     mediator: historyEventsJsonMediator,
  //   })
  // })
  .then(() => {
    return dbHelper.clearDb('persons')
  })
  .then(() => {
    return dbHelper.saveFilesFrom({
      source: '../public/data/persons.json',
      procdir: 'out/out_person_process',
      errdir: 'out/out_person_errors',
      mediator: personsJsonMediator,
    })
  })
  .then(() => {
    log.success(chalk.cyan(`окончание процесса загрузки`))
    dbHelper.free()
    inetHelper.saveCoords(checkedCoordsPath)
  })
  .catch((err) => {
    dbHelper.free()
    inetHelper.saveCoords(checkedCoordsPath)
    log.error(`ошибка загрузки данных: ${err}`)
  })
