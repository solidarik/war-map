export default class StrHelper {
  static toTranslitStr(input) {
    if (!input || input == '') return ''

    input = input.toLowerCase().trim()

    const rus =
      'й,ц,у,к,е,н,г,ш,щ,з,х,ъ,ф,ы,в,а,п,р,о,л,д,ж,э,я,ч,с,м,и,т,ь,б,ю'
    const tr =
      'y,c,u,k,e,n,g,sh,sch,z,h,,f,yi,v,a,p,r,o,l,d,j,e,ya,ch,s,m,i,t,,b,yu'

    const rusArr = rus.split(',')
    const trArr = tr.split(',')
    const allowArr = '1234567890qwertyuiopasdfghjklzxcvbnm'.split('')

    let output = ''
    for (let i = 0; i < input.length; i++) {
      const word = input.charAt(i)
      const rusIdx = rusArr.indexOf(word)
      const isRusWord = rusIdx > -1
      const isAllowWord = allowArr.indexOf(word) > -1
      output += isRusWord ? trArr[rusIdx] : isAllowWord ? word : '_'
    }
    return output.replace(/[_]+/g, '_')
  }

  static isExistNumber(input) {
    if (!input || input == '') return false
    const numbers = StrHelper.getAllNumbers(input)
    return numbers.length > 0
  }

  static isRussianLetter(input) {
    return input.length === 1 && /[А-Яа-я]/i.test(input)
  }

  static isEnglishLetter(input) {
    return input.length === 1 && /[A-Za-z]/i.test(input)
  }

  static isNumeric(input) {
    input = input + ''
    //https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
    return !isNaN(input) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(input)) // ...and ensure strings of whitespace fail
  }

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

  static replaceEnd(input, end) {
    const inputLen = input.length
    const endLen = end.length
    const output = input.substring(0, inputLen - endLen)
    return (output + end)
  }

  static removeShortStrings(inputText, regstring, onlyEnd = true) {
    if (!regstring) {
      const shortRegExp = onlyEnd ? `[а-яa-z]{1,2}[.]$` : `[а-яa-z]{1,2}[.]`
      //[а-яa-z]{1,2}[.]*\s
      regstring = new RegExp(shortRegExp, 'g')
    }
    return inputText.replace(regstring, '').trim()
  }


  static generatePageUrl(input, len = 50) {
    if (Array.isArray(input)) {
      input = input.map(elem => elem.trim()).filter((elem) => elem.length > 0).join('_')
    }

    let output = this.toTranslitStr(input)
    if (output.length > len) {
      output = output.substring(0, len)
    }

    if (output[output.length - 1] == '_') {
      output = output.substring(0, len - 1)
    }

    return output
  }

  static compareEngLanguage(input, template) {
    return (
      0 <= this.strToEngSymbols(input).indexOf(this.strToEngSymbols(template))
    )
  }

  static ellipseLongString(input, len = 100, end = '...') {
    if (!input) return input
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

  static pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
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

  static getMaxLenNumber(input) {
    if (input === undefined) return undefined
    let numbers = this.getAllNumbers(input)
    if (numbers.length === 0) return undefined
    let res = numbers[0]
    for (let i = 1; i < numbers.length; i++) {
      if (res.length < numbers[i].length) {
        res = numbers[i]
      }
    }
    return res
  }

  static getAllIntegerNumbers(input) {
    // К примеру, есть строка: '123 adsf asdf  234324 22'
    // Получаем из нее массив строковых чисел: ['123', '234324', '22']"""
    input = input.replace('\n', '')
    const r = new RegExp(`[0-9]+`, 'g')
    let result = []
    let m
    while ((m = r.exec(input)) != null) {
      (m[0] != '.') && result.push(m[0])
    }
    return result
  }

  static getAllNumbers(input, floatDelim = '.') {
    // К примеру, есть строка: '123 adsf asdf  234324 22'
    // Получаем из нее массив строковых чисел: ['123', '234324', '22']"""
    input = input.replace('\n', '')
    input = input.replace(',', floatDelim)
    input = input.replace('.', floatDelim)
    //return input.replace(/[(][^)]*[)]+/g, '')
    const r = new RegExp(`[0-9${floatDelim}]+`, 'g')
    const existNumbers = new RegExp(`[0-9]+`, 'g')
    let result = []
    let m
    while ((m = r.exec(input)) != null) {
      (m[0] != '.' && existNumbers.exec(m[0])) && result.push(m[0])
    }
    // let result = input.match(regexp) || []
    return result
  }

  static getSearchGroupsInRegexp(regStr, input) {
    let res = []
    const matches = input.match(new RegExp(regStr))
    if (!matches || matches.length < 1)
      return

    for (let iMatch = 1; iMatch < matches.length; iMatch++) {
      res.push(matches[iMatch])
    }
    return res
  }

  static removeByRegExp(regStr, input) {
    if (!input) return input
    input = '' + input
    const r = new RegExp(regStr, 'g')
    return input.replace(r, '')
  }

  static varToString(varObj) {
    return Object.keys(varObj)[0]
  }

  static capitalizeFirstLetter(input) {
    if (!input) {
      return ''
    }
    return input.charAt(0).toUpperCase() + input.slice(1)
  }

  static capitalizeFirstLetterAllWords(input) {
    if (!input) {
      return ''
    }
    return input.split(' ').map(this.capitalizeFirstLetter).join(' ')
  }
}
