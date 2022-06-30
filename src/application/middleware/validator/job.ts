import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'

@injectable()
export class CreateMonthlyRentValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const now = new Date()
    const dayOfMonth = now.getUTCDate()

    if (dayOfMonth === 1) {
      next()
    } else {
      res.sendStatus(200)
    }
  }
}
