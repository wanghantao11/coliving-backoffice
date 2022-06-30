import * as httpMocks from 'node-mocks-http'
import 'reflect-metadata'
import {
  CreateEmergencyContactValidator,
  UpdateEmergencyContactValidator
} from '../../../../../src/application/middleware/validator/emergencyContact'

describe('Test emergencyContact validators', () => {
  it('should not pass when there is field that is not allowed to pass in', async () => {
    const req = httpMocks.createRequest()
    req.body = {
      name: 'test name',
      phone: '1234567',
      relation: 'Not Related',
      iduser: 'NOT_ALLOWED',
    }

    const res = httpMocks.createResponse()

    const validator = new CreateEmergencyContactValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })

  it('should not pass when there is empty field which is required', async () => {
    const req = httpMocks.createRequest()
    req.body = {
      name: '',
      phone: '1234567',
      relation: 'Not Related',
    }
    const res = httpMocks.createResponse()

    const validator = new CreateEmergencyContactValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })

  it('should pass when data is properly passed in ', async () => {
    let trigger = false
    const req = httpMocks.createRequest()
    req.body = {
      name: 'dwa',
      phone: '1234567',
      relation: 'Not Related',
    }
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()

    const validator = new CreateEmergencyContactValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })
})

describe('Validation: \'updateEmergencyContactValidator\', testing the validation function', () => {
  it('should not pass when data when there is field that is not allowed to pass in ', async () => {
    const req = httpMocks.createRequest()
    req.body = {
      name: 'test name',
      phone: '1234567',
      iduser: 'NOT_ALLOWED',
    }
    const res = httpMocks.createResponse()

    const validator = new UpdateEmergencyContactValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })

  it('should pass when data is properly passed in ', async () => {
    let trigger = false
    const req = httpMocks.createRequest()
    req.body = {
      relation: 'Related',
    }
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()

    const validator = new UpdateEmergencyContactValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })
})
