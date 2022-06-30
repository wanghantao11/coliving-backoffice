import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import * as uuid from 'uuid/v4'

import { RECAPTCHA_VERIFY_URL } from '../../infrastructure/constants/common'
import { getDataFromResponse } from '../../infrastructure/utils/common'

export const AuthMiddleware = {
  generateId: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.body.iduser = uuid()
    next()
  },
  needPermisson: (permission: number[]) => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.locals.permission = permission
    next()
  },
  allowAuthTypes: (types: string[]) => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.locals.allowAuthTypes = types
    next()
  },
  isVerifiedCaptcha: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> =>
    axios.post(RECAPTCHA_VERIFY_URL, undefined, {
      params: {
        secret: process.env.CAPTCHA_SECRET_KEY,
        response: req.body.captcha,
      },
    })
      .then(getDataFromResponse)
      .then(({ success }) => success
        ? next()
        : Promise.reject({ message: 'NOT_AUTHENTICATED', reason: 'Recapcha verification failed' }))
      .catch(next),
}
