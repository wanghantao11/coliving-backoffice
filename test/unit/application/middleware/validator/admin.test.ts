import * as httpMocks from 'node-mocks-http'
import 'reflect-metadata'
import { DeleteAdminValidator, LoginAdminValidator, ResendEmailValidator, UpdateAdminValidator } from '../../../../../src/application/middleware/validator/admin'

describe('Test admin validators', () => {
  let trigger
  let req
  let res
  const next = () => (trigger = true)

  beforeEach(() => {
    trigger = false
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
  })

  it('should pass when only first name is given', async () => {
    req.body = {
      first_name: 'new first name',
    }
    const validator = new UpdateAdminValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should pass when both first name and last name are given', async () => {
    req.body = {
      first_name: 'new first name',
      last_name: 'new last name',
    }
    const validator = new UpdateAdminValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should not pass when last name is empty', async () => {
    req.body = {
      first_name: 'new first name',
      last_name: '',
    }
    const validator = new UpdateAdminValidator()
    validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'))
  })

  it('should not pass when email is not given', async () => {
    req.body = {}
    const validator = new ResendEmailValidator()
    validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'))
  })

  it('should not pass if email is invalid', async () => {
    req.body = { email:'random', password:'123'}
    const validator = new LoginAdminValidator()
    validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'))
  })

  it('should not pass if admin id is invalid', async () => {
    req.params = { id:'random' }
    const validator = new DeleteAdminValidator()
    validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'))
  })
})
