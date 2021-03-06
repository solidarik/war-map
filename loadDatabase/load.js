const chalk = require('chalk')
const log = require('../helper/logHelper')

const DbHelper = require('../loadDatabase/dbHelper')
const inetHelper = require('../helper/inetHelper')
const battlesJsonMediator = require('../loadDatabase/battlesJsonMediator')
const agreementsJsonMediator = require('../loadDatabase/agreementsJsonMediator')
const chronosJsonMediator = require('../loadDatabase/chronosJsonMediator')
const personsJsonMediator = require('../loadDatabase/personsJsonMediator')
const usersJsonMediator = require('../loadDatabase/usersJsonMediator')
const chronosReligionJsonMediator = require('../loadDatabase/chronosReligionJsonMediator')
//const loadPersons = require('../loadDatabase/loadPersons')

// loadPersons.download(
//   'http://www.historian.by/ww2/person.xlsx',
//   './public/data/persons.xlsx',
//   loadPersons.parseExcel
// )
// loadPersons.parseExcel()
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

Promise.resolve(true)
  // .then(() => {
  //   return dbHelper.clearDb('users')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFrom({
  //     source: 'dataSources/secretUsers.json',
  //     procdir: 'out/out_user_process',
  //     errdir: 'out/out_user_errors',
  //     mediator: usersJsonMediator
  //   })
  // })
  // .then(() => {
  //   return dbHelper.clearDb('chronos')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFrom({
  //     source: 'python/out_chronos',
  //     procdir: 'out/out_chronos_process',
  //     errdir: 'out/out_chronos_errors',
  //     mediator: chronosJsonMediator,
  //   })
  // })
  // .then(() => {
  //   return dbHelper.clearDb('agreements')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFrom({
  //     source: 'python/out_agreements',
  //     procdir: 'out/out_agreements_process',
  //     errdir: 'out/out_agreements_errors',
  //     mediator: agreementsJsonMediator,
  //   })
  // })
  // .then(() => {
  //   return dbHelper.clearDb('battles')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFrom({
  //     source: 'python/out_battles',
  //     procdir: 'out/out_battles_process',
  //     errdir: 'out/out_battles_errors',
  //     mediator: battlesJsonMediator,
  //   })
  // })
  // .then(() => {
  //   return dbHelper.clearDb('persons')
  // })
  // .then(() => {
  //   return dbHelper.saveFilesFrom({
  //     source: '../public/data/persons.json',
  //     procdir: 'out/out_person_process',
  //     errdir: 'out/out_person_errors',
  //     mediator: personsJsonMediator,
  //   })
  // })
  .then(() => {
      return dbHelper.clearDb('chronosReligion')
    })
    .then(() => {
      return dbHelper.saveFilesFrom({
        source: 'python/out_chronos_religion',
        procdir: 'out/out_chronos_religion_process',
        errdir: 'out/out_chronos_religion_errors',
        mediator: chronosReligionJsonMediator,
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
