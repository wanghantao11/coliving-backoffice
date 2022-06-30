import axios from 'axios'
import { errorEventLogger } from './loggers'

// This file contains all email util functions

const emailAxios = axios.create({
  baseURL: process.env.EMAIL_SERVICE_API,
})

emailAxios.interceptors.request.use(
  config => {
    if (process.env.NODE_ENV === 'test') {
      throw new axios.Cancel('No email will be sent in test env')
    }
    const token = process.env.FUNCTIONS_API_KEY
    config.headers.Authorization = `Bearer ${token}`
    return config
  }
)

emailAxios.interceptors.response.use(
  response => response,
  ({ response }) =>
    response && errorEventLogger.error({ data: response.data })
)

export const emailAxiosPost = (endpointURL, params) => emailAxios.post(endpointURL, params)
  .catch(({ message }) => Promise.reject({ message }))

export const emailAxiosGet = endpointURL => emailAxios.get(endpointURL)

export const emailAxiosDelete = endpointURL => emailAxios.delete(endpointURL)

export const sendSetPasswordEmail = (email, code, hostname, endpoint) => {
  const link = `${hostname}/set-password/${code}`
  return emailAxiosPost(endpoint, { email, link })
    .then(res => res.data)
}

export const sendPinCodeEmail = ({ email, code }) =>
  emailAxiosPost('/mail/pin-code', { email, code })

export const sendCallbackAutoReplyEmail = ({ email, first_name }) =>
  emailAxiosPost('/mail/callback-auto-reply', { email, first_name })
