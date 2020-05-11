const strHelper = require('../helper/strHelper')
const moment = require('moment')

class DateHelper {
  static ignoreAlterDate(input) {
    if (!input) {
      return input
    }
    let procDate = strHelper.shrinkStringBeforeDelim(input)
    procDate = strHelper.ignoreEqualsValue(input)
    procDate = strHelper.ignoreSpaces(procDate)
    procDate = procDate.replace(/-/g, '.')
    if (procDate.length == 4) {
      procDate = `01.01.${procDate}`
    }
    const dmy = procDate.split('.')
    let d = parseInt(dmy[0])
    d = d < 10 ? '0' + d : d.toString()
    let m = parseInt(dmy[1])
    m = m < 10 ? '0' + m : m.toString()
    let y = parseInt(dmy[2])
    if (y < 100) {
      y = '19' + y.toString()
    }
    return moment.utc(`${d}.${m}.${y}`, 'DD.MM.YYYY')
  }
}

module.exports = DateHelper