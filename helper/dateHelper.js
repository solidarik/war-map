import StrHelper from '../helper/strHelper.js'
import moment from 'moment'

const ROMAN_KEYS = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
  "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
  "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]

export default class DateHelper {
  static ignoreAlterDate(input) {
    if (!input) {
      return input
    }
    let procDate = StrHelper.shrinkStringBeforeDelim(input)
    procDate = StrHelper.ignoreEqualsValue(input)
    procDate = StrHelper.ignoreSpaces(procDate)
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
      let year = StrHelper.getMaxLenNumber(input)
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

  static rangeYmdToStr(firstDate, secondDate) {
    const ymdFirst = this.ymdToStr(firstDate)
    const ymdSecond = this.ymdToStr(secondDate)
    if (ymdFirst == ymdSecond) return ymdFirst
    if (!ymdFirst && !ymdSecond) return ''
    if (ymdFirst && !ymdSecond) return ymdFirst
    return ymdFirst + ' – ' + ymdSecond
  }

  static ymdToStr(inputDate) {
    const delim = '.'
    if (!inputDate) return ''
    if (inputDate.isOnlyYear) return inputDate.year + ''
    if (inputDate.isOnlyCentury) return inputDate.century + ' в.'
    if (inputDate.year == -999) return ''

    let res = '' + inputDate.year
    if (inputDate.month != -1) {
      res = ('0' + inputDate.month).slice(-2) + delim + res
    }
    if (inputDate.day != -1) {
      res = ('0' + inputDate.day).slice(-2) + delim + res
    }
    return res
  }

  static getMonthNum(input) {
    const months = [
      'янв', 'февр', 'март', 'апрел', 'ма', 'июн', 'июл', 'август', 'сентяб',
      'октяб', 'нояб', 'декаб'
    ]

    input = input.toLowerCase()

    for (let num = 0; num < months.length; num++) {
      if (input.includes(months[num])) {
        return num + 1
      }
    }

    return -1
  }

  /**
   * Возвращает имя месяца по его номеру
   * @param {int} num Номер месяца
   */
  static getTextOfMonth(num) {

    if (num < 1 || num > 12) {
      throw `Странный месяц ${num}`
    }

    const months = [
      'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август',
      'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ]
    return months[num - 1]
  }

  /**
   * Возвращает склоняемое имя месяца по его номеру
   * @param {int} num Номер месяца
   */
  static getInducementTextOfMonth(num) {

    if (num < 1 || num > 12) {
      throw `Странный месяц ${num}`
    }

    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа',
      'сентября', 'октября', 'ноября', 'декабря'
    ]
    return months[num - 1]
  }

  static getDateFromInput(input, stopWords = []) {

    if (!input) return false

    let inputText = ('' + input).trim()
    inputText = inputText.replace(/ /g, '')

    //убираем примерные слова
    inputText = inputText.replace('Дата:', '')
    inputText = inputText.replace('ок.', '')
    inputText = inputText.replace('около', '')
    inputText = inputText.replace('начало', '')
    inputText = inputText.replace('конец', '')
    inputText = inputText.trim()

    //грохаем все, что между скобками
    inputText = inputText.replace(/[(][^(]*[)]/g, '')

    //ищем стоп-слова, если находим - вылетаем со свистом
    for (let word = 0; word < stopWords.length; word++) {
      if (input.includes(stopWords)) {
        return false
      }
    }

    let outputStr = ''
    let isUserText = false
    let isOnlyYear = false
    let isOnlyCentury = false
    let isFound = false
    let d = -1
    let m = -1
    let y = -999
    let century = -1
    let date_groups = ''
    let testStr = ''

    if (!isFound && inputText.includes('в')) {

      const isNegative = inputText.includes('-')

      //если нет цирф 1..9, то конвертируем римские цифры в арабские
      if (!StrHelper.isExistNumber(input)) {
        //преобразуем все возможную кириллицу в англ. язык (для римских цифр)
        inputText = inputText.replace('X', 'X')

        //преобразуем римские цифры в арабские
        date_groups = StrHelper.getSearchGroupsInRegexp('[-]*(\\S+)[в]', inputText)
        if (date_groups && date_groups.length > 0) {
          inputText = DateHelper.romanToArabic(date_groups[0]) + 'в'
        }
      }

      date_groups = StrHelper.getSearchGroupsInRegexp('[-]*(\\d+)[в]', inputText)
      if (date_groups && date_groups.length > 0) {
        century = parseInt(date_groups[0])
        isOnlyCentury = true
        isFound = true

        date_groups = StrHelper.getSearchGroupsInRegexp('(\\d*).*до.*н.*', inputText)
        if (date_groups && date_groups.length > 0)
          century = -century
      }

      if (isNegative) {
        century = -century
      }
    }

    if (!isFound) {
      inputText = inputText.replace('г.', '').replace('гг.', '')
      inputText = inputText.replace('гг', '')
      inputText = StrHelper.removeByRegExp('г$', inputText)
    }

    if (!isFound && !inputText.includes('.')) {
      testStr = '' + parseInt(inputText)
      const testInt = parseInt(testStr)
      if (inputText.length < 7 && testInt > -2000 && testInt < 2022) {
        y = parseInt(testStr)
        isFound = true
        isOnlyYear = true
        outputStr = testStr
      }
    }

    // если год до н.э.
    if (!isFound) {
      date_groups = StrHelper.getSearchGroupsInRegexp('(\\d+).*до.*н.*', inputText)
      if (date_groups && date_groups.length > 0) {
        y = parseInt(date_groups[0])
        y = -y
        isUserText = true
        isOnlyYear = true
        isFound = true
      }
    }

    // если даты формата dd.mm.yyyy или dd / mm / yyyy
    if (!isFound) {
      date_groups = inputText.match(new RegExp('(\\d{1,4})', 'g'))
      if (date_groups && date_groups.length === 3) {
        d = parseInt(date_groups[0])
        m = parseInt(date_groups[1])
        y = parseInt(date_groups[2])
        isFound = true
      }
    }

    // если дата типа "1984, 1 мая"
    if (!isFound) {
      date_groups = StrHelper.getSearchGroupsInRegexp('(\\d*)\\s*[,]\\s*(\\d+)\\s*(\\S+)', inputText)
      if (date_groups && date_groups.length > 0) {
        y = parseInt(date_groups[0])
        if (date_groups[1] != '') {
          d = parseInt(date_groups[1])
        }
        m = parseInt(DateHelper.getMonthNum(date_groups[2]))
        isFound = true
      }
    }

    // если дата типа "15 июня 1389 (года)"
    if (!isFound) {
      date_groups = StrHelper.getSearchGroupsInRegexp('(\\d*)\\s*([^-0-9]*)\\s*(\\d*)\\s*', inputText)
      if (date_groups && date_groups.length === 3) {
        if (date_groups[0] != '') {
          d = parseInt(date_groups[0])
        }
        m = parseInt(DateHelper.getMonthNum(date_groups[1]))
        y = parseInt(date_groups[2])
        isFound = (y > 0)
        //soli console.log(isFound, d, m, y, inputText)
      }
    }

    if (!isFound) {
      throw new Error(`Не удалось распарсить дату из текста ${inputText}`)
    }

    if (y != -999) {
      if (y >= 0) {
        century = Math.floor(y / 100) + 1
      } else {
        century = Math.floor(y / 100)
        if (y % 100 == 0) {
          century -= 1
        }
      }
    }

    if (!isUserText && !isOnlyYear && !isOnlyCentury) {
      outputStr = `${StrHelper.pad(d, 2)}.${StrHelper.pad(m, 2)}.${y}`
    }

    if (isOnlyCentury) {
      m = 1
      d = 1
      if (century >= 0) {
        y = (century - 1) * 100
      } else {
        y = (century + 1) * 100
      }
    }

    const res = {
      "ymd": [y, m, d],
      "year": y,
      "month": m,
      "day": d,
      "century": century,
      "dateStr": outputStr,
      "isOnlyYear": isOnlyYear,
      "isOnlyCentury": isOnlyCentury,
      "isUserText": isUserText
    }

    return res
  }

  static convertTZ(date, tzString) {
    return (typeof date === "string" ? new Date(date) : date).toLocaleString("ru-RU", { timeZone: tzString })
  }

  static nowToStr() {
    const now = new Date()
    const day = ('0' + now.getDate()).slice(-2)
    const month = ('0' + (now.getMonth() + 1)).slice(-2)
    const year = now.getFullYear()
    const h = ('0' + now.getHours()).slice(-2)
    const m = ('0' + now.getMinutes()).slice(-2)
    const s = ('0' + now.getSeconds()).slice(-2)
    return `${[day, month, year].join('.')} ${[h, m, s].join(':')}`
  }

  static dateTimeToStr(inputDate, timeZone = 'Europe/Moscow') {
    const mskDateTime = new Date(DateHelper.convertTZ(inputDate, timeZone))
    const day = ('0' + mskDateTime.getDate()).slice(-2)
    const month = ('0' + (mskDateTime.getMonth() + 1)).slice(-2)
    const year = mskDateTime.getFullYear()
    const h = ('0' + mskDateTime.getHours()).slice(-2)
    const m = ('0' + mskDateTime.getMinutes()).slice(-2)
    const s = ('0' + mskDateTime.getSeconds()).slice(-2)
    return `${[day, month, year].join('.')} ${[h, m, s].join(':')}`
  }

  static dateToStr(inputDate, isWithoutYear = true) {
    if (!inputDate) return undefined
    let date = new Date(inputDate)
    const day = ('0' + date.getDate()).slice(-2)
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const year = date.getFullYear()
    return isWithoutYear && day == '01' && month == '01' ? year : `${day}.${month}.${year} `
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
      ? `${startDateStr} - ${endDateStr} `
      : isOnlyYear
        ? this.getYearStr(startDate)
        : startDateStr
  }

  static twoDateToStr2(startDateStr, endDateStr) {
    return endDateStr != undefined && startDateStr != endDateStr
      ? `${startDateStr} - ${endDateStr} `
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

  static yearToCentury(year) {
    let century = 0
    if (year >= 0) {
      century = Math.floor(year / 100) + 1
    } else {
      century = Math.trunc(year / 100) - 1
    }
    return Number(century)
  }

  static intCenturyToStr(intCentury) {
    const isMinus = intCentury < 0
    if (intCentury == 0) {
      intCentury = 1
    }
    const romanize = DateHelper.arabicToRoman(intCentury)
    if (isMinus) {
      return `-${romanize}`
    }
    return romanize
  }

  static arabicToRoman(num) {
    if (isNaN(num))
      return NaN;
    let digits = String(+num).split("")
    let roman = ""
    let i = 3
    while (i--)
      roman = (ROMAN_KEYS[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }

  static romanToArabic(roman) {

    var reg = /^[IVXLCDM]+$/
    if (!reg.test(roman)) return undefined

    //https://stackoverflow.com/questions/48946083/convert-roman-number-to-arabic-using-javascript
    if (roman == null)
      return undefined;

    let totalValue = 0
    let value = 0
    let prev = 0

    for (let i = 0; i < roman.length; i++) {
      let current = DateHelper.romanToInt(roman.charAt(i));
      if (current > prev) {
        // Undo the addition that was done, turn it into subtraction
        totalValue -= 2 * value;
      }
      if (current !== prev) { // Different symbol?
        value = 0; // reset the sum for the new symbol
      }
      value += current // keep adding same symbols
      totalValue += current
      prev = current
    }
    return totalValue
  }

  static romanToInt(character) {
    switch (character) {
      case 'I': return 1;
      case 'V': return 5;
      case 'X': return 10;
      case 'L': return 50;
      case 'C': return 100;
      case 'D': return 500;
      case 'M': return 1000;
      default: return -1;
    }
  }

  static getMiddleOfCentury(century) {
    const range = this.getCenturyRange(century)
    if (century < 0) {
      return range[1] + (range[0] - range[1] - 1) / 2
    } else {
      return range[0] + (range[1] - range[0] + 1) / 2
    }
  }

  static getCenturyRange(century) {

    if (century == 0) {
      century = 1
    }

    const isMinus = century < 0
    let startYear = 0
    let endYear = 0

    if (isMinus) {
      century = Math.abs(century)
    }

    startYear = (century - 1) * 100
    endYear = century * 100 - 1

    if (isMinus)
      return [-endYear, -startYear]
    else
      return [startYear, endYear]
  }
}