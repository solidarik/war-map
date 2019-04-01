const log = require('../helper/logHelper')
const fileHelper = require('../helper/fileHelper')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')

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
      modelFiles.forEach(modelFilePath => {
        if ('' == filter || modelFilePath.includes(filter)) {
          promises.push(
            new Promise((resolve, reject) => {
              let model = require(modelFilePath)
              model.deleteMany({}, err => {
                if (err) reject(err)

                resolve(true)
                info(`Removed collection: ${modelFilePath}`)
              })
            })
          )
        }
      })

      Promise.all(promises)
        .then(res => resolve(true))
        .catch(err => reject(err))
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

  saveFilesFromDir(input) {
    return new Promise((resolve, reject) => {
      let mediator = input.mediator

      let files = []

      let source = fileHelper.composePath(input.source)

      let dataTypeStr = 'файл'
      if (fileHelper.isDirectory(source)) {
        dataTypeStr = 'директорию'
        files = fileHelper.getFilesFromDir(source)
      } else {
        files.push(source)
      }

      info(`Начинаем обрабатывать ${dataTypeStr} ${chalk.blue(input.source)}`)

      let promises = []
      let countObjects = 0
      files.forEach(filePath => {
        console.log(filePath)
        let json = fileHelper.getJsonFromFile(filePath)
        json.forEach(jsonItem => {
          promises.push(
            new Promise((resolve, reject) => {
              let newJsonItem = undefined

              mediator
                .processJson(jsonItem)
                .then(procJsonItem => {
                  newJsonItem = procJsonItem
                  return mediator.isExistObject(procJsonItem)
                })
                .then(isExistObject => {
                  if (isExistObject) return true

                  return mediator.addObjectToBase(newJsonItem)
                })
                .then(res => {
                  countObjects += 1
                  resolve(true)
                })
                .catch(err => {
                  let msg = `Ошибка при обработке файла ${fileHelper.getFileNameFromPath(
                    filePath
                  )} элемент ${JSON.stringify(jsonItem)}: ${err}`
                  log.error(msg)
                  reject(msg)
                })
            })
          )
        })
      })
      log.info(`Количество входящих элементов, промисов: ${promises.length}`)
      Promise.all(promises)
        .then(res => {
          log.info(
            `Количество успешно обработанных элементов: ${countObjects} из ${
              res.length
            }`
          )
          resolve(res)
        })
        .catch(err => {
          let msg = `Ошибка в процессе обработки ${err}`
          log.error(msg)
          reject(msg)
        })
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
          subregion: item['SUBREGION']
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
      sourceNameEng: 'Data from Samara colleagues'
    })

    let query = DictSourcesModel.findOne({
      sourceCode: firstSource.sourceCode
    })
    query.then(doc => {
      if (!doc) {
        firstSource.save(err => {
          if (!err) success('object created')
          else error('object did not create', err)
        })
      }
    })
  }
}

module.exports = DbHelper
