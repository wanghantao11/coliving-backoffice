import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { array, date, number, object, string, validate } from 'joi'

@injectable()
export class GetInterestedMembersValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.query
    const schema = object().keys({
      facade_id: number().required(),
      email: string().optional(),
      name: string().optional(),
      subscribed_from: date().optional(),
      subscribed_to: date().optional(),
      tag_ids: array().optional(),
      limit: number().optional(),
      offset: number().optional(),
      sort_order: string().valid(['ASC', 'DESC']),
      sort_by: string().valid(['subscribed_at', 'email', 'birthday', 'first_name', 'move_in_date_from']),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class GetPendingOfferMembersValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.query
    const schema = object().keys({
      facade_id: number().required(),
      email: string().optional(),
      name: string().optional(),
      sent_from: date().optional(),
      sent_to: date().optional(),
      tag_ids: array().optional(),
      limit: number().optional(),
      offset: number().optional(),
      sort_order: string().valid(['ASC', 'DESC']),
      sort_by: string().valid(['sent_at', 'first_name', 'apartment_name', 'room_name', 'move_in_date_from']),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class GetContractMembersValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.query
    const schema = object().keys({
      facade_id: number().required(),
      email: string().optional(),
      name: string().optional(),
      sent_from: date().optional(),
      sent_to: date().optional(),
      signed_from: date().optional(),
      signed_to: date().optional(),
      status: string().optional(),
      tag_ids: array().optional(),
      limit: number().optional(),
      offset: number().optional(),
      sort_order: string().valid(['ASC', 'DESC']),
      sort_by: string().valid(['signed_at', 'first_name', 'apartment_name', 'room_name', 'move_in_date_from']),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}
