import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { number, object, validate, array } from 'joi'

@injectable()
export class GetRoomsValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.query
    const schema = object().keys({
      ids: array().items(number()).allow(null, []),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}
