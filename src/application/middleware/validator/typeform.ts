import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { get } from 'lodash'
import { object, validate, string, array } from 'joi'

@injectable()
export class TypeformResponseValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const schema = object().keys({
      iduser: string().required(),
      rawData: array().required(),
    })

    res.locals.rawData = get(req.body, 'form_response.answers') || get(req.body, 'answers')
    res.locals.iduser = get(req.body, 'form_response.hidden.iduser') || get(req.body, 'hidden.iduser')
    res.locals.iduser = res.locals.iduser.trim()

    const data = res.locals

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}
