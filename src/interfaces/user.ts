import { TAG_STATUS } from '../infrastructure/constants'
import { User } from '../domain/entity'

export interface IUserInfo {
  first_name?: string
  last_name?: string
  birthday?: Date
  contract?: any
  email: string
  registration_time?: Date
  is_test_complete?: boolean
  interest_ids?: number[]
  facade_id?: number
  subscribed_project_ids?: number[]
  status?: TAG_STATUS
}

export interface IUserFilter {
  ageSpan?: any
  email?: string
  exclude?: string[]
  iduser?: string
  idusers?: string[]
  limit?: number
  locations?: string[]
  registrationTimeSpan?: any
  offset?: number
  userKeys?: number[]
  user_type?: string
  is_verified?: boolean
}

export interface IUser extends User {
  age: number
}
