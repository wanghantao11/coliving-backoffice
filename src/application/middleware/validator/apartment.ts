import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { number, object, string, validate } from 'joi'

@injectable()
export class CreateApartmentValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      facade_id: number().required(),
      name: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UpdateApartmentValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = { body: req.body, params: req.params }
    const schema = object().keys({
      body: object().keys({
        name: string().optional(),
      }),
      params: object().keys({
        id: number().required(),
      }),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class DeleteApartmentValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.params
    const schema = object().keys({
      id: number().optional(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}
