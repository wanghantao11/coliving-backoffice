import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import * as crypto from 'crypto'
import { SIGN_KEY } from '../../../infrastructure/constants/contract'

@injectable()
export class OneflowResponseValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const { signature, callback_id } = req.body
    const hash = crypto.createHash('sha1')
    if (hash.update(callback_id + SIGN_KEY).digest('hex') === signature) {
      next()
    } else {
      return Promise.reject({message: 'NOT_VALIDATED', reason: 'Invalid oneflow sign key'}).catch(next)
    }
  }
}
