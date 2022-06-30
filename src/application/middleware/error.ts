import { errorEventLogger } from '../../infrastructure/utils/loggers'

/**
 * errorMessage
 * part of the mapping is based on the definition below
 * to handle error catched from service level
 *
 * @see https://tools.ietf.org/html/rfc7235#section-3.1
 */
export enum statusCodeMap {
  NOT_VERIFIED = 400, // verification failure
  NOT_AUTHENTICATED = 401, // authentication failure
  NOT_AUTHORIZED = 403, // valid credentials that are not adequate to gain access
  NOT_FOUND = 404, // no record in db
  CONFLICT = 409, // Conflict
  NOT_ALLOWED = 412, // incorrect user type
  NOT_VALIDATED = 422, // validation failure
  INTERNAL_SERVER_ERROR = 500,
  NO_CONTENT = 204, // The server successfully processed the request and is not returning any content
}

/**
 * db error map
 * to handle error thrown from db level
 */
export const dbErrorMap = {
  23505: { status: 409, message: 'CONFLICT' },
  40001: { status: 423, message: 'LOCKED' },
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleError = () => (err, req, res, next) => {
  if (err instanceof TypeError) {
    errorEventLogger.error({
      message: { message: err.message, detail: err.stack },
    })
  } else {
    errorEventLogger.error({ err })
  }
  const { code, message } = err
  if (dbErrorMap[code]) {
    const { status, message } = dbErrorMap[code]
    res.status(status).send({ message })
  } else {
    return Object.keys(statusCodeMap).includes(message)
      ? res.status(statusCodeMap[message]).send({ message })
      : res.status(statusCodeMap.INTERNAL_SERVER_ERROR).send({ message: 'INTERNAL_SERVER_ERROR' })
  }
}
