import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { number, object, string, validate } from 'joi'
import { verify } from './../../auth/jwt/service'

@injectable()
export class SendInvitationValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      email: string().email().required(),
      img_url: string().required(),
      first_name: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class ReplyInvitationValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      inviter_id: string().required(),
      invitee_id: string().required(),
      status: string().valid('Pending', 'Accepted', 'Rejected').required(),
      invitation_code: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : verify(req.body.invitation_code)
        .then(() => next())
        .catch(next)
    )
  }
}

@injectable()
export class DeletePreferredRoommateValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.params
    const schema = object().keys({
      id: number().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class ConnectPreferredRoommateValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      email: string().email().required(),
      first_name: string().required(),
      last_name: string().required(),
      client_id: number().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : verify(req.body.invitation_code)
        .then(() => next())
        .catch(next)
    )
  }
}
