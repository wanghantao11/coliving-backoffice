import * as httpMocks from 'node-mocks-http'
import 'reflect-metadata'
import { GetRoomAndTenantsValidator } from '../../../../../src/application/middleware/validator/room'

describe('Test getRoomAndTenants validators', () => {
  it('should pass when the facadeId is number', async () => {
    let trigger = false
    const req = httpMocks.createRequest()
    req.params = {
      facadeId : '1',
    }
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()

    const validator = new GetRoomAndTenantsValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should pass when the facadeId is number and proper query', async () => {
    let trigger = false
    const req = httpMocks.createRequest()
    req.params = {
      facadeId : '1',
    }
    req.query = {
      status: 'Reserved',
      name: 'Lab',
      people_per_room: 2,
    }
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()

    const validator = new GetRoomAndTenantsValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should not pass when the facadeId is number and invalid property', async () => {
    const req = httpMocks.createRequest()
    req.params = {
      facadeId : '1',
    }
    req.query = {
      status: 'Reserved',
      name: 'Lab',
      people_per_room: 2,
      invalid_key: 'invalid_value',
    }
    const res = httpMocks.createResponse()

    const validator = new GetRoomAndTenantsValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })

  it('should not pass when the facadeId is number and invalid value', async () => {
    const req = httpMocks.createRequest()
    req.params = {
      facadeId : '1',
    }
    req.query = {
      status: 'Out Of Service',
      name: 'Lab',
      people_per_room: 2,
    }
    const res = httpMocks.createResponse()

    const validator = new GetRoomAndTenantsValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })

  it('should not pass when the facadeId is not number', async () => {
    const req = httpMocks.createRequest()
    req.params = {
      facadeId : 'test',
    }
    const res = httpMocks.createResponse()

    const validator = new GetRoomAndTenantsValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })

  it('should not pass when the facadeId is not provided', async () => {
    const req = httpMocks.createRequest()
    req.params = {}
    const res = httpMocks.createResponse()

    const validator = new GetRoomAndTenantsValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })

  it('should not pass when the facadeId is empty string', async () => {
    const req = httpMocks.createRequest()
    req.params = {
      facadeId : '',
    }
    const res = httpMocks.createResponse()

    const validator = new GetRoomAndTenantsValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })
})
