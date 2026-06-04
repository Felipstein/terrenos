import { describe, expect, it } from 'vitest'
import { keys } from '../../src/infra/dynamo/keys'

describe('single-table keys', () => {
  it('monta a PK da conta', () => {
    expect(keys.accountPk('abc')).toBe('ACCT#abc')
  })

  it('monta a SK do terreno com o prefixo usado no list', () => {
    expect(keys.terrenoSk('t1')).toBe('TERRENO#t1')
    expect(keys.terrenoSk('t1').startsWith(keys.terrenoSkPrefix)).toBe(true)
  })
})
