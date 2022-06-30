import 'reflect-metadata'
import { cleanUpMetadata } from 'inversify-express-utils'
import * as httpMocks from 'node-mocks-http'

import {
  CreateApplicationValidator
} from '../../../../../src/application/middleware/validator/application'

describe('test application validators', () => {
  beforeEach(done => {
    cleanUpMetadata()
    done()
  })

  describe('test create application validator', () => {
    let req
    let res
    const next = jest.fn()

    beforeEach(() => {
      req = null
      res = null
      next.mockReset()
    })

    it('should pass the validator with valid request body', () => {
      const validator = new CreateApplicationValidator()
      req = httpMocks.createRequest({
        method: 'POST',
        url: 'v1/application/apply',
        body: {
          facade_id: 23,
        },
      })
      res = httpMocks.createResponse()
      validator.handler(req, res, next)

      expect(res.statusCode).toBe(200)
    })

    it('should fail the validator with faulty request body', async () => {
      const validator = new CreateApplicationValidator()
      req = httpMocks.createRequest({
        method: 'POST',
        url: 'v1/application/apply',
        body: {
          projectId: 23,
        },
      })
      res = httpMocks.createResponse()

      validator.handler(req, res, err => {
        if (err) {
          expect(err.message).toBe('NOT_VALIDATED')
        }
      })
    })

    it('should fail the validator with empty request body', async () => {
      const validator = new CreateApplicationValidator()
      req = httpMocks.createRequest({
        method: 'POST',
        url: 'v1/application/apply',
        body: {},
      })
      res = httpMocks.createResponse()

      validator.handler(req, res, err => {
        if (err) {
          expect(err.message).toBe('NOT_VALIDATED')
        }
      })
    })
  })
})
