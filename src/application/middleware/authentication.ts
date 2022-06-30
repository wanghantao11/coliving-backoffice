import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import * as httpContext from 'express-http-context'

import { hasAuthType } from './../../infrastructure/utils/common'
import { verify } from '../auth/jwt/service'

export type AuthRole = 'backoffice' | 'community' | 'noauth'

@injectable()
export class IsAuthenticated extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    let { authorization } = req.headers
    if (!authorization && req.query.authorization) {
      authorization = `Bearer ${req.query.authorization}`
    }

    if (!authorization) {
      return Promise.reject({ message: 'NOT_AUTHENTICATED', reason: 'Missing authorization token in the request header' }).catch(next)
    } else {
      const token: string = authorization.split(' ')[1]
      return verify(token)
        .then((decoded: any) => {
          if (!hasAuthType(res.locals.allowAuthTypes, decoded.authType)) {
            return Promise.reject({ message: 'NOT_AUTHENTICATED', reason: 'Missing authentication type' })
          } else {
            res.locals.userId = decoded.id
            res.locals.clientId = decoded.clientId
            res.locals.projectId = decoded.projectId
            res.locals.apartmentId = decoded.apartmentId
            res.locals.authType = decoded.authType as AuthRole
            res.locals.authToken = token
            res.locals.facadeIds = decoded.facadeIds
            httpContext.set('iduser', res.locals.userId)
            next()
          }
        })
        .catch(next)
    }
  }
}
