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
}

module.exports = StrHelper
