const ServerProtocol = require('../libs/serverProtocol')
const BattlesModel = require('../models/battlesModel')
const AgreementsModel = require('../models/agreementsModel')
const ChronosModel = require('../models/chronosModel')
const PersonsModel = require('../models/personsModel')

class BattlesProtocol extends ServerProtocol {
  init() {
    super.addHandler('clQueryDataByYear', this.getDataByYear)
    super.addHandler('clGetCurrentYear', this.getCurrentYear)
  }

  getCurrentYear(socket, msg, cb) {
    let res = {}
    res.year = undefined // todo
    cb(JSON.stringify(res))
  }

  getDataByYear(socket, msg, cb) {
    let res = {}

    try {
      let data = JSON.parse(msg)
      let startDate = new Date(data.year, 0, 1).toISOString()
      let endDate = new Date(data.year, 11, 31).toISOString()

      const searchDates = {
        $gte: startDate,
        $lt: endDate,
      }

      const defaultSearchParam = {
        startDate: searchDates,
      }

      const promices = [
        BattlesModel.find(defaultSearchParam),
        AgreementsModel.find(defaultSearchParam),
        ChronosModel.find(defaultSearchParam),
        PersonsModel.find({
          dateBirth: searchDates,
        }),
        PersonsModel.find({
          dateAchievement: searchDates,
        }),
        PersonsModel.find({
          dateDeath: searchDates,
        }),
      ]

      Promise.all(promices)
        .then((res) => {
          cb(
            JSON.stringify({
              battles: res[0],
              agreements: res[1],
              chronos: res[2],
              personsBirth: res[3],
              personsAchievement: res[4],
              personsDeath: res[5],
            })
          )
        })
        .catch((error) => {
          cb(JSON.stringify({ error: error }))
        })
    } catch (err) {
      res.err = 'Ошибка парсинга даты: ' + err
      res.events = ''
      cb(JSON.stringify(res))
    }
  }
}

module.exports = new BattlesProtocol()
