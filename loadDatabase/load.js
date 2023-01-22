import chalk from 'chalk'
import FileHelper from '../helper/fileHelper.js'
import DbHelper from '../loadDatabase/dbHelper.js'
import inetHelper from '../helper/inetHelper.js'
import DateHelper from '../helper/dateHelper.js'

import Log from '../helper/logHelper.js'
if (FileHelper.isFileExists('load.log')) {
  FileHelper.deleteFile('load.log')
}
const log = Log.create('load.log')

import XlsGoogleParserChronos from './xlsGoogleParserChronos.js'
import XlsGoogleParserAgreements from './xlsGoogleParserAgreements.js'
import XlsGoogleParserBattles from './xlsGoogleParserBattles.js'
import XlsGoogleParserPersons from './xlsGoogleParserPersons.js'
import FileParserPersons from './fileParserPersons.js'

log.success(chalk.greenBright(`Запуск процесса загрузки ${DateHelper.nowToStr()}`))

const checkedCoordsPath = 'loadDatabase\\dataSources\\checkedCoords.json'
inetHelper.loadCoords(checkedCoordsPath)

const dbHelper = new DbHelper()

const xlsGoogleParserChronos = new XlsGoogleParserChronos(log)
const xlsGoogleParserAgreements = new XlsGoogleParserAgreements(log)

const wowSheetId = process.env.GOOGLE_SHEET_ID_BATTLES
const xlsGoogleParserBattles = new XlsGoogleParserBattles(log, wowSheetId, 'wow')

const wmwSheetId = process.env.GOOGLE_SHEET_ID_BATTLES_WMW
const xlsGoogleParserBattlesWMW = new XlsGoogleParserBattles(log, wmwSheetId, 'wmw')

const xlsGoogleParserPersons = new XlsGoogleParserPersons(log)

const fileParserPersons = new FileParserPersons(log, './public/data/persons.json')

Promise.resolve(true)
  .then(() => {
    return dbHelper.connect()
  })
  // .then(() => {
  //   return xlsGoogleParserChronos.processData(dbHelper)
  // })
  // .then(() => {
  //   return xlsGoogleParserAgreements.processData(dbHelper)
  // })
  .then(() => {
    return xlsGoogleParserBattles.processData(dbHelper, true)
  })
  .then(() => {
    return xlsGoogleParserBattlesWMW.processData(dbHelper, false)
  })
  .then(() => {
    return xlsGoogleParserPersons.processData(dbHelper)
  })
  // .then(() => {
  //   return fileParserPersons.processData(dbHelper)
  // })
  .then(() => {
    log.success(chalk.greenBright(`Окончание процесса загрузки ${DateHelper.nowToStr()}`))
    dbHelper.free()
    inetHelper.saveCoords(checkedCoordsPath)
  })
  .catch((err) => {
    dbHelper.free()
    inetHelper.saveCoords(checkedCoordsPath)
    log.error(`Ошибка загрузки данных: ${err}`)
  })
