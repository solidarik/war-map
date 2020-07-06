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
    } else if (procDate.split('.').length !== 3) {
      const months = [
        'янв',
        'фев',
        'март',
        'апр',
        'май',
        'июнь',
        'июль',
        'авг',
        'сен',
        'окт',
        'ноя',
        'дек',
      ]
      let year = strHelper.getMaxLenNumber(input)
      let month = 1
      year = year.length == 2 ? '19' + year : year
      for (let i = 0; i < months.length; i++) {
        if (-1 < input.indexOf(months[i])) {
          month = i + 1
          break
        }
      }
      procDate = `01.${month}.${year}`
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

    let date = new Date('' + inputDate)
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

  static twoDateToStr2(startDateStr, endDateStr) {
    return endDateStr != undefined && startDateStr != endDateStr
      ? `${startDateStr} - ${endDateStr}`
      : startDateStr
  }

  static betweenYearTwoDates(startDate, endDate, isEndText = true) {
    const startDateMoment = this.ignoreAlterDate(startDate)
    const endDateMoment = this.ignoreAlterDate(endDate)

    if (!startDateMoment || !endDateMoment) return undefined

    const diffYear = endDateMoment.diff(startDateMoment, 'years')

    if (!isEndText) return diffYear

    if (diffYear % 10 === 1 && diffYear !== 11) return diffYear + ' год'
    else
      return (diffYear >= 5 && diffYear <= 19) ||
        diffYear % 10 > 4 ||
        diffYear % 10 === 0
        ? diffYear + ' лет'
        : diffYear + ' года'
  }
}

module.exports = DateHelper
