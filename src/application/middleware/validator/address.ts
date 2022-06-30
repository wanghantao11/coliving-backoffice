import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { number, object, string, validate } from 'joi'

@injectable()
export class CreateAddressValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      facade_id: number().required(),
      careof: string().allow(null, ''),
      city: string().required(),
      country: string().required(),
      street: string().required(),
      zip: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UpdateAddressValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      careof: string().allow(null, ''),
      city: string().optional(),
      country: string().optional(),
      street: string().optional(),
      zip: string().optional(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

export class DeleteAddressValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction){
    const data = req.params
    const schema = object().keys({
      id: number().required(),
    })
    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next())
  }
}
