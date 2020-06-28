class StrHelper {
  static strToEngSymbols(input) {
    if (!input || input == '') return ''

    const rus = 'УКЕНХВАРОМС'
    const eng = 'YKEHXBAPOMC'

    let output = ''
    rus.split('').forEach((s, i) => {
      output = input.replace(new RegExp(s, 'g'), eng[i])
    })
    return output
  }

  static compareEngLanguage(input, template) {
    return (
      0 <= this.strToEngSymbols(input).indexOf(this.strToEngSymbols(template))
    )
  }

  static ellipseLongString(input, len = 100, end = '...') {
    return input.length > len ? input.substring(0, len) + end : input
  }

  static shrinkStringBeforeDelim(input, delim = ',') {
    if (!input) return input
    input = '' + input
    const indexOf = input.indexOf(delim)
    return indexOf > 0 ? input.substr(0, indexOf) : input
  }

  static ignoreEqualsValue(input) {
    if (!input) return input
    input = '' + input
    return input.replace(/[(][^)]*[)]/g, '')
  }

  static ignoreSpaces(input) {
    if (!input) return input
    input = '' + input
    return input.replace(/\s/g, '')
  }

  static getTwoStringByLastDelim(input, delim = '.') {
    const lastIndexOf = input.lastIndexOf(delim)
    const ret = [
      input.substr(0, lastIndexOf).trim(),
      input.substr(lastIndexOf + 1, input.length).trim(),
    ]
    return ret
  }

  static hexToRgbA(hex, opacity) {
    var c
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('')
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]]
      }
      c = '0x' + c.join('')
      return [(c >> 16) & 255, (c >> 8) & 255, c & 255, opacity || 0]
    }
    throw new Error(`Bad Hex ${hex}`)
  }

  static numberWithCommas(input, comma = ',') {
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, comma)
  }

  static getNumber(value) {
    if (value == undefined) return 0
    value = this.getAllNumbers(value)
    0 < value.length && (value = value[0])
    const tryFloat = parseFloat(value)
    const isNaN =
      typeof Number.isNaN !== 'undefined'
        ? Number.isNaN(tryFloat)
        : tryFloat !== tryFloat
        ? true
        : false
    return isNaN ? 0 : tryFloat
  }

  static getAllNumbers(input, floatDelim = '.') {
    // К примеру, есть строка: '123 adsf asdf  234324 22'
    // Получаем из нее массив строковых чисел: ['123', '234324', '22']"""
    input = input.replace('\n', '')
    input = input.replace(',', floatDelim)
    input = input.replace('.', floatDelim)
    //return input.replace(/[(][^)]*[)]+/g, '')
    const r = new RegExp(`[0-9${floatDelim}]+`, 'g')
    let result = []
    let m
    while ((m = r.exec(input)) != null) {
      result.push(m[0])
    }
    // let result = input.match(regexp) || []
    return result
  }

  static varToString(varObj) {
    return Object.keys(varObj)[0]
  }
}

module.exports = StrHelper
