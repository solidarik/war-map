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
    return this.strToEngSymbols(input).includes(this.strToEngSymbols(template))
  }
}

module.exports = StrHelper
