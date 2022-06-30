import * as httpMocks from 'node-mocks-http'
import 'reflect-metadata'
import {
  CreateAddressValidator,
  DeleteAddressValidator,
  UpdateAddressValidator
} from '../../../../../src/application/middleware/validator/address'

describe('Test address validators', () => {
  let trigger
  let req
  let res
  const next = () => (trigger = true)

  beforeEach(() => {
    trigger = false
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
  })
  it('should pass when all data is given for address creation', async () => {
    req.body = {
      facade_id: 1,
      country: 'Sweden',
      city: 'Stockholm',
      zip: '10 990',
      street: 'Drottninggatan 123',
    }
    const validator = new CreateAddressValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should not pass when street is missing for address creation', async () => {
    req.body = {
      project_id: 1,
      country: 'Sweden',
      city: 'Stockholm',
      zip: '10 990',
    }
    const validator = new CreateAddressValidator()
    validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'))
  })

  it('should not pass when country is missing for address creation', async () => {
    req.body = {
      project_id: 1,
      city: 'Stockholm',
      zip: '10 990',
      street: 'Drottninggatan 123',
    }
    const validator = new CreateAddressValidator()
    validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'))
  })

  it('should pass when nothing is sent in for address update', async () => {
    req.body = {}
    const validator = new UpdateAddressValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should pass when number is passed for address deletion', async () => {
    req.params = { id: '1' }
    const validator = new DeleteAddressValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should fail when non-number is passed for address deletion', async () => {
    req.params = { id: 'string' }
    const validator = new DeleteAddressValidator()
    validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'))
  })
})
