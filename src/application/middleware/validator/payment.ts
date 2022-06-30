import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { array, boolean, date, number, object, string, validate } from 'joi'

@injectable()
export class CreateChargeValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = { params: req.params, body: req.body }
    const schema = object().keys({
      body: object().keys({
        has_saved_card: boolean().optional(),
        idempotency_key: string().required(),
        source: string().optional(),
      }),
      params: object().keys({
        id: number().required(),
      }),
    })

    validate(data, schema, err => err
      ? Promise.reject({
        message: 'NOT_VALIDATED',
        reason: 'Invalid request data',
        detail: err.details,
      }).catch(next)
      : next()
    )
  }
}

@injectable()
export class GetPaymentsForAdminValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.query
    const schema = object().keys({
      facade_id: number().optional(),
      id: number().optional(),
      iduser: string().optional(),
      email: string().optional(),
      name: string().optional(),
      created_from: date().optional(),
      created_to: date().optional(),
      is_overdue: string().optional(),
      status: array().items(string()).optional(),
      limit: number().optional(),
      offset: number().optional(),
      sort_order: string().valid(['ASC', 'DESC']),
      sort_by: string().valid(['created_from', 'id', 'first_name', 'status']),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class StripeResponseValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const { id, data, type } = req.body
    const { created, status } = data.object

    if (id && type && created && status) {
      next()
    } else {
      return Promise.reject({
        message: 'NOT_VALIDATED',
        reason: 'Invalid stripe webhook event data',
      }).catch(next)
    }
  }
}

@injectable()
export class GetPaymentForTenantValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.params
    const schema = object().keys({
      id: number().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({
        message: 'NOT_VALIDATED',
        reason: 'Invalid request data',
        detail: err.details,
      }).catch(next)
      : next()
    )
  }
}
