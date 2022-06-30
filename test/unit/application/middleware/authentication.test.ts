import * as dotenv from 'dotenv'
dotenv.config()
import * as httpMocks from 'node-mocks-http'
import 'reflect-metadata'

import { signInBackOffice, signInCommunity } from '../../../../src/application/auth/jwt/service'
import { IsAuthenticated } from '../../../../src/application/middleware/authentication'
import { BACKOFFICE, COMMUNITY } from '../../../../src/infrastructure/constants'

describe('Test authentication middleware', () => {
  const validator = new IsAuthenticated()

  it('should pass when auth type is correct and token is correct for backoffice', async () => {
    const token = await signInBackOffice(1, 2, [], '', BACKOFFICE)

    let trigger = false
    const req = httpMocks.createRequest()
    req.headers.authorization = `Bearer ${token}`
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()
    res.locals.allowAuthTypes = [BACKOFFICE]
    await validator.handler(req, res, next)
    expect(trigger).toBeTruthy()
  })

  it('should not pass when auth type is not correct for backoffice', async () => {
    const token = await signInBackOffice(1, 2, [], '', BACKOFFICE)
    const req = httpMocks.createRequest()
    req.headers.authorization = `Bearer ${token}`
    const res = httpMocks.createResponse()
    res.locals.allowAuthTypes = [COMMUNITY]
    await validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_AUTHENTICATED')
      }
    })
  })

  it('should not pass when auth type is correct but token is incorrect for backoffice', async () => {
    const token = await signInBackOffice(1, 2, [], '', BACKOFFICE)
    const req = httpMocks.createRequest()
    req.headers.authorization = `Bearer ${token}hack`
    const res = httpMocks.createResponse()
    res.locals.allowAuthTypes = [BACKOFFICE]
    await validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_AUTHENTICATED')
      }
    })
  })

  it('should pass when auth type is correct and token is correct for community', async () => {
    const token = await signInCommunity(1, COMMUNITY)

    let trigger = false
    const req = httpMocks.createRequest()
    req.headers.authorization = `Bearer ${token}`
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()
    res.locals.allowAuthTypes = [COMMUNITY]
    await validator.handler(req, res, next)
    expect(trigger).toBeTruthy()
  })

  it('should not pass when auth type is correct but token is incorrect for community', async () => {
    const token = await signInCommunity(1, COMMUNITY)
    const req = httpMocks.createRequest()
    req.headers.authorization = `Bearer ${token}hack`
    const res = httpMocks.createResponse()
    res.locals.allowAuthTypes = [COMMUNITY]
    await validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_AUTHENTICATED')
      }
    })
  })

  it('should not pass when auth type is correct but token is empty', async () => {
    const emptyToken = ''
    const req = httpMocks.createRequest()
    req.headers.authorization = `Bearer ${emptyToken}`
    const res = httpMocks.createResponse()
    res.locals.allowAuthTypes = [COMMUNITY]
    await validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_AUTHENTICATED')
      }
    })
  })
})
