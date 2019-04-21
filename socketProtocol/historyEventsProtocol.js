const log = require('../helper/logHelper')
const ServerProtocol = require('../libs/serverProtocol')
const HistoryEventsModel = require('../models/historyEventsModel')
const AgreementsModel = require('../models/agreementsModel')

class HistoryEventsProtocol extends ServerProtocol {
  init() {
    super.addHandler('clQueryEvents', this.getEventsByYear)
    super.addHandler('clGetCurrentYear', this.getCurrentYear)
  }

  getCurrentYear(socket, msg, cb) {
    let res = {}
    res.year = undefined // todo
    cb(JSON.stringify(res))
  }

  getEventsByYear(socket, msg, cb) {
    let res = {}

    try {
      let data = JSON.parse(msg)
      let startDate = new Date(data.year, 0, 1).toISOString()
      let endDate = new Date(data.year, 11, 31).toISOString()

      HistoryEventsModel.find(
        {
          startDate: {
            $gte: startDate,
            $lt: endDate
          }
        },
        (err, events) => {
          res.err = err
          res.events = events

          AgreementsModel.find(
            {
              startDate: {
                $gte: startDate,
                $lt: endDate
              }
            },
            (err, agreements) => {
              res.err = err
              res.agreements = agreements
              cb(JSON.stringify(res))
            }
          )
        }
      )
    } catch (err) {
      res.err = 'Ошибка парсинга даты: ' + err
      res.events = ''
      cb(JSON.stringify(res))
    }
  }
}

module.exports = new HistoryEventsProtocol()
