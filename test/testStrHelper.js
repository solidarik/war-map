const strHelper = require('../helper/strHelper')
const assert = require('assert')

const f = (input) => strHelper.generatePageUrl(input)

describe('translit url', () => {
  it('simple string', () => {
    assert.equal('hello_world', f('hello world'))
  })

  it('array string', () => {
    assert.equal('hello_world_strana', f(['HELLO', 'World', 'страна']))
  })

  it('spec symbols', () => {
    assert.equal('da_zdravstvuet_mirnyiy_atom', f('да%здравствует%мирный%атом'))
  })

  it('unicode symbols', () => {
    assert.equal(
      'unicode_character_u_263a_',
      f(' Unicode Character “☺” (U+263A)')
    )
  })
})
