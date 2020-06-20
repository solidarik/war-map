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

  static dateToStr(inputDate) {
    if (!inputDate) return undefined
    let date = new Date(inputDate)
    const day = ('0' + date.getDate()).slice(-2)
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const year = date.getFullYear()
    return day == '01' && month == '01' ? year : `${day}.${month}.${year}`
  }

  static getYearStr(inputDate) {
    if (!inputDate) return ''
    if (4 == length(inputDate)) return inputDate

    let date = new Date(inputDate)
    return '' + date.getFullYear()
  }

  static twoDateToStr(startDate, endDate, isOnlyYear = false) {
    const startDateStr = DateHelper.dateToStr(startDate)
    const endDateStr = DateHelper.dateToStr(endDate)
    return endDateStr != undefined && startDateStr != endDateStr
      ? `${startDateStr} - ${endDateStr}`
      : isOnlyYear
      ? this.getYearStr(startDate)
      : startDateStr
  }
}

module.exports = DateHelper
