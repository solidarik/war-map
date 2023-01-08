import ServerProtocol from '../libs/serverProtocol.js'
import BattlesModel from '../models/battlesModel.js'
import AgreementsModel from '../models/agreementsModel.js'
import ChronosModel from '../models/chronosModel.js'
import PersonsModel from '../models/personsModel.js'

class BattlesProtocol extends ServerProtocol {

  constructor() {
    super()
    this.init()
  }

  init() {
    super.addHandler('clQueryDataByYear', this.getDataByYear)
    super.addHandler('clGetCurrentYear', this.getCurrentYear)
    super.addHandler('clGetPersons', this.getPersons)
    super.addHandler('clGetPersonItem', this.getPersonItem)
  }

  getCurrentYear(socket, msg, cb) {
    let res = {}
    res.year = undefined // todo
    cb(JSON.stringify(res))
  }

  getPersonItem(socket, msg, cb) {

    let data = JSON.parse(msg)
    let res = {}
    try {
      PersonsModel.find({ '_id': data.id })
        .then(
          (res) => {
            if (res.length == 0) {
              throw new Error('Person by id is not Found')
            } else {
              cb(
                JSON.stringify(res[0])
              )
            }
          })
        .catch((error) => {
          cb(JSON.stringify({ error: error }))
        })
    } catch (err) {
      res.err = 'Ошибка возврата персоны: ' + err
      res.events = ''
      cb(JSON.stringify(res))
    }
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
        ChronosModel.find({'start.year': data.year}),
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

export default new BattlesProtocol()
