import * as httpMocks from 'node-mocks-http'
import 'reflect-metadata'
import {
  SendInvitationValidator,
  ReplyInvitationValidator,
  DeletePreferredRoommateValidator
} from '../../../../../src/application/middleware/validator/userPreferredRoommates'

describe('Test userPreferredRoommates SendInvitationValidator', () => {
  it('should pass when data is properly passed', () => {
    let trigger = false
    const req = httpMocks.createRequest()
    req.body = {
      email: '123@test.com',
      img_url: 'img_url',
      first_name: 'first',
    }
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()
    const validator = new SendInvitationValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should pass when any required data is not provided', () => {
    const req = httpMocks.createRequest()
    req.body = {
      img_url: 'img_url',
      first_name: 'first',
    }
    const res = httpMocks.createResponse()
    const validator = new SendInvitationValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })
})

describe('Test userPreferredRoommates ReplyInvitationValidator', () => {
  it('should not pass since the code is not valid', () => {
    const req = httpMocks.createRequest()
    req.body = {
      inviter_id: '123@test.com',
      invitee_id: 'img_url',
      status: 'first',
      invitation_code: 'invalid',
    }
    const res = httpMocks.createResponse()
    const validator = new ReplyInvitationValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })
})

describe('Test userPreferredRoommates DeletePreferredRoommateValidator', () => {
  it('should pass since id is provided as a number', () => {
    let trigger = false
    const req = httpMocks.createRequest()
    req.params = {
      id: '1',
    }
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()
    const validator = new DeletePreferredRoommateValidator()
    validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should not pass since id is not provided as a number', () => {
    const req = httpMocks.createRequest()
    req.params = {
      id: 'string',
    }
    const res = httpMocks.createResponse()
    const validator = new DeletePreferredRoommateValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })

  it('should not pass since id is not provided ', () => {
    const req = httpMocks.createRequest()
    req.params = {}
    const res = httpMocks.createResponse()
    const validator = new DeletePreferredRoommateValidator()
    validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_VALIDATED')
      }
    })
  })
})
