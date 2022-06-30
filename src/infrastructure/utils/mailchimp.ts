import axios from 'axios'
import { errorEventLogger } from './loggers'
import {
  INTEREST_MAILCHIMP_MAPPING,
  PROJECT_MAILCHIMP_TAG_MAPPING,
  EMAIL_MARKETING_STATUS,
  TAG_STATUS,
  CONTRACT_STATUS,
  EVENT_MAILCHIMP_TAGS
} from '../constants'
import {
  IMailchimpContact,
  IMailchimpMergeFields,
  IUserInfo,
  IMailchimpBatchOperation
} from '../../interfaces'
import { convertStringToMd5Hash, isObjectEmpty } from './common'

const mailChimpAxios = axios.create({
  baseURL: process.env.MAILCHIMP_API,
  auth: {
    username: 'any',
    password: process.env.MAILCHIMP_API_KEY,
  },
})

mailChimpAxios.interceptors.request.use(config => {
  if (process.env.NODE_ENV !== 'production') {
    throw new axios.Cancel('Only send request in production')
  }
  config.headers['Content-Type'] = 'application/json'
  return config
})

mailChimpAxios.interceptors.response.use(
  response => response,
  ({ response }) =>
    response && errorEventLogger.error({ data: response.data })
)

export const importUser = (list_id: string) => (
  member: Partial<IMailchimpContact>
) =>
  mailChimpAxios.post(
    `/lists/${list_id}/members`,
    JSON.stringify({ ...member })
  )

export const archiveUser = (list_id: string) => ({ email_address }: Partial<IMailchimpContact>) =>
  mailChimpAxios.delete(`/lists/${list_id}/members/${convertStringToMd5Hash(email_address)}`)

export const importUsers = (list_id: string) => (
  members: Array<Partial<IMailchimpContact>>
) =>
  mailChimpAxios.post(
    `/lists/${list_id}`,
    JSON.stringify({ members, update_existing: true })
  )

export const updateUser = (list_id: string) => ({ email_address, ...data }: Partial<IMailchimpContact>) =>
  mailChimpAxios.patch(
    `/lists/${list_id}/members/${convertStringToMd5Hash(email_address)}`,
    JSON.stringify({ ...data })
  )

export const updateUserTags = (list_id: string) => ({
  email_address,
  tags,
}: Partial<IMailchimpContact>) =>
  mailChimpAxios.post(
    `/lists/${list_id}/members/${convertStringToMd5Hash(email_address)}/tags`,
    JSON.stringify({ tags })
  )

export const batchOperations = (operations: IMailchimpBatchOperation[]) =>
  mailChimpAxios.post('/batches', JSON.stringify({ operations }))

export const formatUser = ({
  first_name,
  last_name,
  birthday,
  email,
  contract,
  registration_time,
  is_test_complete,
  interest_ids,
  subscribed_project_ids,
  facade_id,
  status = TAG_STATUS.ACTIVE,

}: Partial<IUserInfo>): Partial<IMailchimpContact> => {
  // init
  const tags = []
  const merge_fields: Partial<IMailchimpMergeFields> = {}
  const formattedUser: Partial<IMailchimpContact> = {
    email_address: email,
    status: EMAIL_MARKETING_STATUS.SUBSCRIBED,
  }
  // merge_fields
  if (first_name) {
    merge_fields.FNAME = first_name
  }
  if (last_name) {
    merge_fields.LNAME = last_name
  }
  if (birthday) {
    merge_fields.BIRTHDAY = birthday.toLocaleDateString('en-US')
  }
  if (registration_time) {
    merge_fields.REGTIME = registration_time.toLocaleDateString('en-US')
  }
  if (!isObjectEmpty(merge_fields)) {
    formattedUser.merge_fields = merge_fields
  }
  // interests
  if (interest_ids) {
    const interests = interest_ids.reduce((result, id) => {
      result[INTEREST_MAILCHIMP_MAPPING[id]] = true
      return result
    }, {})
    formattedUser.interests = interests
  }

  // tags
  if (facade_id) {
    tags.push({
      status,
      name: (PROJECT_MAILCHIMP_TAG_MAPPING[facade_id] || { tenant: null })
        .tenant,
    })
  }
  if (subscribed_project_ids) {
    tags.push(
      ...subscribed_project_ids.map(id => ({
        status,
        name: (PROJECT_MAILCHIMP_TAG_MAPPING[id] || { subscription: null })
          .subscription,
      }))
    )
  }
  if (is_test_complete) {
    tags.push({
      status,
      name: EVENT_MAILCHIMP_TAGS.ROOMIE_TEST_COMPLETE,
    })
  }
  if (contract) {
    if (PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id] && contract.status === CONTRACT_STATUS.PENDING) {
      tags.push({
        status,
        name:
          PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id].contract.generated,
      })
    }
    if (PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id] && contract.status === CONTRACT_STATUS.REJECTED) {
      tags.push({
        status: TAG_STATUS.INACTIVE,
        name:
          PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id].contract.generated,
      })
    }
    if (PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id] && contract.status === CONTRACT_STATUS.SIGNED) {
      tags.push({
        status,
        name:
          PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id].contract.signed,
      })
    }
  }
  formattedUser.tags = tags
  return formattedUser
}
