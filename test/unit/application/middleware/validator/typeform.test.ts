import * as httpMocks from 'node-mocks-http'
import 'reflect-metadata'

import { TypeformResponseValidator } from '../../../../../src/application/middleware/validator/typeform'

describe('Test typeform validators', () => {
  it('should pass when the req body is correct (fetch from response API)', () => {
    let trigger = false
    const req = httpMocks.createRequest()
    req.body.answers = []
    req.body.hidden = {}
    req.body.hidden.iduser = 'iduser'
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()

    const validator = new TypeformResponseValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should pass when the req body is correct (fetch from webhook)', () => {
    let trigger = false
    const req = httpMocks.createRequest()
    req.body.form_response = {}
    req.body.form_response.answers = []
    req.body.form_response.hidden = {}
    req.body.form_response.hidden.iduser = 'iduser'
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()

    const validator = new TypeformResponseValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })
})
