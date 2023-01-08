import Log from '../helper/logHelper.js'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

import config from 'config'
import chalk from 'chalk'

export default class DbHelper {
  async connect() {
    if (process.env.MONGOOSE_DEBUG) {
      mongoose.set('debug', true)
    }

    mongoose.set('strictQuery', true)

    mongoose.Promise = global.Promise
    this.db = await mongoose.connect(config.mongoose.uri, config.mongoose.options)
  }

  clearModel(model) {
    return new Promise((resolve, reject) => {
      model.deleteMany({}, (err) => {
        if (err) reject(err)

        resolve(true)
        this.log.info(chalk.gray(`Удаление коллекции: ${model.collection.collectionName}`))
      })
    })
  }

  constructor(db = undefined, log = undefined) {
    this.isOuter = db != undefined
    this.db = db
    if (!log) {
      log = Log.create()
    }
    this.log = log
  }

  free() {
    if (this.isOuter) return
    setTimeout(() => {
      this.db && this.db.disconnect()
      this.log.info(chalk.gray('Отключение от базы'))
    }, 100)
  }

}
