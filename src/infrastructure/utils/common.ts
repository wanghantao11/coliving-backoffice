import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { isObject } from 'lodash'

import { SALT_ROUNDS } from './../constants/common'

export const checkPassword = (password, passwordHash) => bcrypt.compare(password, passwordHash)

export const convertDateToISOString = (date: Date): string => {
  try {
    return date ? date.toISOString() : ''
  } catch (e) {
    return ''
  }
}

export const convertStringToBoolean = (input: string): boolean =>
  input ? input.toLowerCase().trim() === 'true' : false

export const convertStringToMd5Hash = (input: string): string =>
  input ? crypto.createHash('md5').update(input).digest('hex') : ''

export const createRandomCode = (config: { size: number }): string =>
  config.size <= 0 ? '' : crypto.randomBytes(Math.ceil(config.size / 2)).toString('hex').slice(0, config.size)

export const excludeKeysFromObject = (...keys) => data => {
  if (!isObject(data)) {
    return data
  }
  keys.forEach(key => {
    delete data[key]
  })
  return data
}

export const formatEmail = (email: string): string => !email ? '' : email.toLowerCase().trim()

export const formatDueDate = (createdAt: Date, dueDay: number): Date =>
  !dueDay ? createdAt : new Date(createdAt.setDate(dueDay))

export const getDataFromResponse = ({ data }) => data

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, SALT_ROUNDS)

export const hasAuthType = (typeArr, value) => typeArr.includes(value)

export const hasPermission = (scopes: number[], values: number[]): boolean =>
  Boolean(values.filter(value => scopes.includes(value)).length)

export const isObjectEmpty = (obj: any): boolean => Object.keys(obj).length === 0 && obj.constructor === Object
