import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { number, object, string, validate } from 'joi'

@injectable()
export class CreateProjectGalleryValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      id: number().required(),
      source: string().required(),
      text: string().allow(null, ''),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UpdateProjectGalleryValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      source: string().optional(),
      text: string().allow(null, ''),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}
