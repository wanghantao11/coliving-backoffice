import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { number, object, validate } from 'joi'

@injectable()
export class CreateApplicationValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      facade_id: number().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({
        message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details,
      }).catch(next)
      : next()
    )
  }
}

@injectable()
export class DeleteApplicationValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.params
    const schema = object().keys({
      projectId: number().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({
        message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details,
      }).catch(next)
      : next()
    )
  }
}

@injectable()
export class CountApplicationValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.query
    const schema = object().keys({
      facadeId: number().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({
        message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details,
      }).catch(next)
      : next()
    )
  }
}
