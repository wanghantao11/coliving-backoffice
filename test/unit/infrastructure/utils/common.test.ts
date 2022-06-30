import 'reflect-metadata'

import {
  convertDateToISOString,
  convertStringToBoolean,
  hasPermission,
  formatEmail,
  excludeKeysFromObject,
  convertStringToMd5Hash,
  createRandomCode
} from '../../../../src/infrastructure/utils/common'

describe('Test the utils function hasPermission()', () => {
  it('should pass when values and scope has common element', async () => {
    const scope = [1, 2, 3, 4, 5]
    const values = [2, 6]
    const res = hasPermission(scope, values)
    expect(res).toBeTruthy()
  })

  it('should not pass when values and scope has no common element', async () => {
    const scope = [1, 2, 3, 4, 5]
    const values = [7, 6]
    const res = hasPermission(scope, values)
    expect(res).toBeFalsy()
  })

  it('should not pass when values is empty', async () => {
    const scope = [1, 2, 3, 4, 5]
    const values = []
    const res = hasPermission(scope, values)
    expect(res).toBeFalsy()
  })

  it('should not pass when scope is empty', async () => {
    const scope = []
    const values = [7, 6]
    const res = hasPermission(scope, values)
    expect(res).toBeFalsy()
  })
})

describe('Test the utils function convertDateToISOString()', () => {
  it('should convert a past date', async () => {
    const input = new Date('05 October 2019 14:48 UTC')
    const res = convertDateToISOString(input)
    expect(res).toBe('2019-10-05T14:48:00.000Z')
  })

  it('should convert a future date', async () => {
    const input = new Date('2111-10-05 14:48 UTC')
    const res = convertDateToISOString(input)
    expect(res).toBe('2111-10-05T14:48:00.000Z')
  })

  it('should return empty string for converting an empty date', async () => {
    const input = new Date('')
    const res = convertDateToISOString(input)
    expect(res).toBe('')
  })

  it('should return empty string for converting an null date', async () => {
    const input = null
    const res = convertDateToISOString(input)
    expect(res).toBe('')
  })
})

describe('Test the utils function formatEmail()', () => {
  it('should lowercase the email', () => {
    const email = 'A@b.Com'
    const _email = formatEmail(email)
    expect(_email).toBe('a@b.com')
  })

  it('should trim the space of the email', () => {
    const email = '  A@b.Com      '
    const _email = formatEmail(email)
    expect(_email).toBe('a@b.com')
  })
})

describe('Test the utils function excludeKeysFromObject()', () => {
  it('should exclude the fields provided', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const _obj = excludeKeysFromObject('a', 'b')(obj)
    expect(_obj).toEqual({ c: 3 })

  })

  it('should pass even if object is empty', () => {
    const obj = {}
    const _obj = excludeKeysFromObject('a', 'b')(obj)
    expect(_obj).toEqual({})
  })

  it('should return data directly if data is not object', () => {
    const obj = null
    const _obj = excludeKeysFromObject('a', 'b')(obj)
    expect(_obj).toEqual(null)
  })
})

describe('Test the utils function convertStringToBoolean()', () => {
  it('should convert a true string to true', () => {
    const res = convertStringToBoolean('True')
    expect(res).toEqual(true)
  })

  it('should convert a whitespaced true string to true', () => {
    const res = convertStringToBoolean('  TRuE ')
    expect(res).toEqual(true)
  })

  it('should convert a false string to false', () => {
    const res = convertStringToBoolean('FALSe')
    expect(res).toEqual(false)
  })

  it('should convert a empty string to false', () => {
    const res = convertStringToBoolean('')
    expect(res).toEqual(false)
  })
})

describe('Testing the utils function convertStringToMd5Hash()', () => {
  it('should convert string to md5hash', () => {
    const res = convertStringToMd5Hash('test')
    expect(res).toEqual('098f6bcd4621d373cade4e832627b4f6')
  })

  it('should convert string to md5hash', () => {
    const res = convertStringToMd5Hash('')
    expect(res).toEqual('')
  })

  it('should convert string to md5hash', () => {
    const res = convertStringToMd5Hash(null)
    expect(res).toEqual('')
  })
})


describe('Testing the utils function createRandomCode()', () => {
  it('should create random code based on size', () => {
    const res = createRandomCode({ size: 1 })
    expect(res).toHaveLength(1)
  })
})
