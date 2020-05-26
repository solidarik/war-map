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

  static shrinkStringBeforeDelim(input, delim = ',') {
    const indexOf = input.indexOf(delim)
    return indexOf > 0 ? input.substr(0, indexOf) : input
  }

  static ignoreEqualsValue(input) {
    return input.replace(/[(][^)]*[)]/g, '')
  }

  static ignoreSpaces(input) {
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

  static getNumber(value) {
    if (value == undefined) return 0
    const tryFloat = parseFloat(value)
    const isNaN =
      typeof Number.isNaN !== 'undefined'
        ? Number.isNaN(tryFloat)
        : tryFloat !== tryFloat
        ? true
        : false
    return isNaN ? 0 : tryFloat
  }

  static varToString(varObj) {
    return Object.keys(varObj)[0]
  }
}

module.exports = StrHelper
