const log = require('../helper/logHelper')
const strHelper = require('../helper/strHelper')
const dateHelper = require('../helper/dateHelper')
const assert = require('assert')
const moment = require('moment')

const it_name = (v) => {
  return `${v[0]} == ${v[1]}`
}

const check_equal = (v, func) => {
  if (Array.isArray(v[1])) {
    assert.equal(func(v[0]).join(), v[1].join())
  } else if (v[1] && typeof v[1].isoWeekday === 'function') {
    if (!func(v[0]).isSame(v[1])) {
      log.warn(`${func(v[0])} ${v[1]}, result: ${func(v[0]).isSame(v[1])}`)
    }
    assert.equal(true, func(v[0]).isSame(v[1]))
  } else {
    assert.equal(func(v[0]), v[1])
  }
}

describe('without equal value', () => {
  const v = ['01(05). 05 . 23', '01. 05 . 23']
  it(it_name(v), () => {
    check_equal(v, strHelper.ignoreEqualsValue)
  })
})

describe('without spaces', () => {
  const v = ['01(05). 05 . 23', '01(05).05.23']
  it(it_name(v), () => {
    check_equal(v, strHelper.ignoreSpaces)
  })
})

describe('without multiple equals', () => {
  const v = ['01(05).05(10).24', '01.05.24']
  it(it_name(v), () => {
    check_equal(v, strHelper.ignoreEqualsValue)
  })
})

describe('check getTwoStringByLastDelim', () => {
  const v = ['hello everybody. something', ['hello everybody', 'something']]
  it(it_name(v), () => {
    check_equal(v, strHelper.getTwoStringByLastDelim)
  })
})

describe('check undefined alterDate', () => {
  const v = [undefined, undefined]
  it(it_name(v), () => {
    check_equal(v, dateHelper.ignoreAlterDate)
  })
})

describe('check  alterDate', () => {
  const v = ['01(05).05(10).24', moment.utc('01.05.1924', 'DD.MM.YYYY')]
  it(it_name(v), () => {
    check_equal(v, dateHelper.ignoreAlterDate)
  })

  const v2 = ['01.05(02.12).24', moment.utc('01.05.1924', 'DD.MM.YYYY')]
  it(it_name(v2), () => {
    check_equal(v2, dateHelper.ignoreAlterDate)
  })

  const v3 = ['01-05(02-12)-24', moment.utc('01.05.1924', 'DD.MM.YYYY')]
  it(it_name(v3), () => {
    check_equal(v3, dateHelper.ignoreAlterDate)
  })

  const v4 = ['1924', moment.utc('01.01.1924', 'DD.MM.YYYY')]
  it(it_name(v4), () => {
    check_equal(v4, dateHelper.ignoreAlterDate)
  })

  const v5 = ['1924', moment.utc('01.01.1954', 'DD.MM.YYYY')]
  it(`False equal dates ${it_name(v5)}`, () => {
    assert.equal(false, dateHelper.ignoreAlterDate(v5[0]).isSame(v5[1]))
  })
})

describe('test human date', () => {
  const v5 = ['авг 1924', moment.utc('01.08.1924', 'DD.MM.YYYY')]
  it(it_name(v5), () => {
    check_equal(v5, dateHelper.ignoreAlterDate)
  })
})

describe('test mocha test system', () => {
  it('test assert', () => {
    assert.equal(false, false)
    assert.equal(true, true)
    assert.equal(undefined, undefined)
  })
})
