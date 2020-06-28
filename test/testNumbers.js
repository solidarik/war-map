const log = require('../helper/logHelper')
const strHelper = require('../helper/strHelper')
const dateHelper = require('../helper/dateHelper')
const assert = require('assert')

describe('getNumber return number', () => {
  it('simple test', () => {
    assert.equal(0, strHelper.getNumber('0'))
    assert.equal(10, strHelper.getNumber('10'))
    assert.equal(10, strHelper.getNumber('10 + 20'))
    assert.notEqual(10, strHelper.getNumber('1000'))
  })

  it('mnemonic test', () => {
    assert.equal(10, strHelper.getNumber('более 10'))
  })
})
