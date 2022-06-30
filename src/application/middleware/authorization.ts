import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { BACKOFFICE } from './../../infrastructure/constants'
import { Authorization } from './../auth/authorization'

@injectable()
export class IsAuthorized extends BaseMiddleware {
  constructor(
    @inject('Authorization')
    private authorization: Authorization
  ) {
    super()
  }

  public handler(
    req: Request,
    res: Response,
    next: NextFunction) {
    if (res.locals.authType === BACKOFFICE) {
      return this.authorization.authorize(res.locals.userId, res.locals.permission)
        .then(isAuthorized => !isAuthorized ?
          Promise.reject({ message: 'NOT_AUTHORIZED', reason: 'Admin authorization failed' }) : next())
        .catch(next)
    }
    next()
  }
}
