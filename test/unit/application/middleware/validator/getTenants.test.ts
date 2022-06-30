import * as httpMocks from 'node-mocks-http'
import 'reflect-metadata'
import { GetTenantsValidator } from '../../../../../src/application/middleware/validator/tenant'

describe('Test getTenants validators', () => {
  it('should not pass when data is not given correctly', () => {
    const req = httpMocks.createRequest()
    req.query = {
      age_from: '',
    }
    const res = httpMocks.createResponse()

    const validator = new GetTenantsValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })
})
