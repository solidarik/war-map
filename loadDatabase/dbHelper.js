const log = require('../helper/logHelper')
const fileHelper = require('../helper/fileHelper')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')
const path = require('path')

class DbHelper {
  getLocalDb() {
    if (process.env.MONGOOSE_DEBUG) {
      mongoose.set('debug', true)
    }

    mongoose.Promise = global.Promise
    mongoose.connect(config.mongoose.uri, config.mongoose.options)
    return mongoose
  }

  clearDb(filter = '') {
    return new Promise((resolve, reject) => {
      const modelDirectory = fileHelper.composePath('../models/')
      let modelFiles = fileHelper.getFilesFromDir(modelDirectory, '.js')
      let promises = []
      modelFiles.forEach((modelFilePath) => {
        if ('' == filter || modelFilePath.includes(filter)) {
          promises.push(
            new Promise((resolve, reject) => {
              let model = require(modelFilePath)
              model.deleteMany({}, (err) => {
                if (err) reject(err)

                resolve(true)
                info(`removed collection: ${modelFilePath}`)
              })
            })
          )
        }
      })

      Promise.all(promises)
        .then((res) => resolve(true))
        .catch((err) => reject(err))
    })
  }

  constructor(db) {
    this.isOuter = db != undefined
    this.db = db != undefined ? db : this.getLocalDb()
  }

  free() {
    if (this.isOuter) return
    setTimeout(() => {
      this.db.disconnect()
      info(chalk.yellow('db disconnected'))
    }, 100)
  }

  saveFilesFrom(input) {
    return new Promise((resolve, reject) => {
      let mediator = input.mediator

      let files = []

      let source = fileHelper.composePath(input.source)
      let procdir = fileHelper.composePath(input.procdir)
      let errdir = fileHelper.composePath(input.errdir)

      fileHelper.clearDirectory(procdir)
      fileHelper.clearDirectory(errdir)

      let dataTypeStr = 'файл'
      if (fileHelper.isDirectory(source)) {
        dataTypeStr = 'директорию'
        files = fileHelper.getFilesFromDir(source)
      } else {
        files.push(source)
      }

      info(`начинаем обрабатывать ${dataTypeStr} ${chalk.cyan(input.source)}`)

      let promises = []

      files.forEach((filePath) => {
        let json = fileHelper.getJsonFromFile(filePath)
        let filename = fileHelper.getFileNameFromPath(filePath)
        let procpath = path.join(procdir, filename)
        let errpath = path.join(errdir, filename)

        json.forEach((jsonItem) => {
          promises.push(
            new Promise((resolve) => {
              let newJsonItem = undefined
              mediator
                .processJson(jsonItem)
                .then((jsonItem) => {
                  if (jsonItem.hasOwnProperty('error')) {
                    throw `ошибка на предварительном этапе обработки ${jsonItem.error}`
                  }
                  newJsonItem = jsonItem
                  return mediator.isExistObject(newJsonItem)
                })
                .then((isExistObject) => {
                  if (isExistObject) resolve(true)
                  return mediator.addObjectToBase(newJsonItem)
                })
                .then((res) => {
                  fileHelper.saveJsonToFileSync(newJsonItem, procpath)
                  resolve(true)
                })
                .catch((err) => {
                  let msg = `ошибка при обработке файла ${filename} элемент ${JSON.stringify(
                    jsonItem
                  )}: ${err}`
                  fileHelper.saveJsonToFileSync(newJsonItem, errpath)
                  log.error(msg)
                  resolve({ error: new Error(msg) })
                })
            })
          )
        })
      })
      log.info(`количество входящих элементов, промисов: ${promises.length}`)

      Promise.all(promises).then(
        (res) => {
          let countObjects = 0
          res.forEach((r) => {
            countObjects += r.hasOwnProperty('error') ? 0 : 1
          })
          const status = `количество успешно обработанных элементов: ${countObjects} из ${res.length}`
          log.info(status)
          if (countObjects == res.length) {
            log.info(chalk.green('успешная загрузка'))
          } else {
            log.warn('не все файлы были обработаны успешно')
          }
          resolve(status)
        },
        (err) => {
          let msg = `непредвиденная ошибка в процессе обработки ${err}`
          log.error(msg)
          resolve(msg)
        }
      )
    })
  }

  fillDictCountries() {
    const filePath = fileHelper.composePath(
      'samara',
      'data',
      'countries_centroid.json'
    )
    let obj = fileHelper.getJsonFromFile(filePath)
    obj.forEach((item, i, arr) => {
      if (i == 0) {
        info(fromLonLat([56.004, 54.695]))
        let country = {
          iso: item['ISO3'],
          eng: item['NAME'],
          region: item['REGION'],
          subregion: item['SUBREGION'],
        }
        log.info('iso: ' + item['ISO3'])
        log.info(JSON.stringify(item))
      }
    })
    info(obj.length)
  }

  getSamaraSource() {
    const firstSource = new DictSourcesModel({
      sourceCode: 'samara_json',
      sourceNameRus: 'Данные, предоставленные коллегами из Самары',
      sourceNameEng: 'Data from Samara colleagues',
    })

    let query = DictSourcesModel.findOne({
      sourceCode: firstSource.sourceCode,
    })
    query.then((doc) => {
      if (!doc) {
        firstSource.save((err) => {
          if (!err) success('object created')
          else error('object did not create', err)
        })
      }
    })
  }
}

module.exports = DbHelper
