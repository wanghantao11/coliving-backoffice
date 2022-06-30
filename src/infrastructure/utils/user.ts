import { MILLISECONDS_IN_A_YEAR } from './../constants/common'
import { convertDateToISOString } from './common'
import { USER_TYPE } from '../constants'
// This file contains all user util functions

export const checkForMissingLocation = locationArr => {
  if (locationArr) {
    let exist03 = false
    let exist03All = false
    let exist09 = false
    let exist09All = false
    let exist12 = false
    let exist12All = false
    for (const location of locationArr) {
      if (location.substring(0, 2) === '12' && !exist12All) {
        if (location === '12000') {
          exist12All = true
        } else {
          exist12 = true
        }
      } else if (location.substring(0, 2) === '09' && !exist09All) {
        if (location === '09000') {
          exist09All = true
        } else {
          exist09 = true
        }
      } else if (location.substring(0, 2) === '03' && !exist03All) {
        if (location === '03000') {
          exist03All = true
        } else {
          exist03 = true
        }
      }
    }
    if (exist03 && !exist03All) {
      locationArr.push('03000')
    }
    if (exist09 && !exist09All) {
      locationArr.push('09000')
    }
    if (exist12 && !exist12All) {
      locationArr.push('12000')
    }
  }
  return locationArr
}

export const convertAgeToBirthday = (age: number) => {
  const ageInMs = Math.ceil(age * MILLISECONDS_IN_A_YEAR)
  return new Date(new Date().getTime() - ageInMs)
}

export const convertFromDateStringToISOString = (fromDate: string): string => {
  if (!fromDate) {
    // TODO set to an old date if fromDate is not given for now
    return new Date('2018-01-01').toISOString()
  }

  return convertDateToISOString(new Date(fromDate))
}

export const convertToDateStringToISOString = (toDate: string): string => {
  if (!toDate) {
    // TODO set to tomorrow if toDate is not given for now
    return new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
  }

  return convertDateToISOString(new Date(toDate))
}

export const otherUserMapping = userArr => {
  const data = []

  if (userArr === undefined || userArr.length === 0) {
    return data
  }

  for (let i = 0; i < userArr.length; i += 1) {
    data[i] = {}
    data[i].id = userArr[i].user_key
    data[i].first_name = userArr[i].first_name
    data[i].last_name = userArr[i].last_name
    data[i].birthday = userArr[i].birthday
    data[i].img_url = userArr[i].img_url
    data[i].description = userArr[i].description
  }

  return data
}

export const isCandidate = ({user_type}) => user_type === USER_TYPE.CANDIDATE

export const isUserCandidateOrTenant = ({user_type}) => [String(USER_TYPE.CANDIDATE), String(USER_TYPE.TENANT)].includes(user_type)
