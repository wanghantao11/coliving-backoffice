import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { number, object, string, validate } from 'joi'

@injectable()
export class CreateAdminValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      first_name: string().required(),
      last_name: string().required(),
      email: string().email().required(),
      role_id: number().required(),
      type: string().required(),
    })
    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UpdateAdminValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      first_name: string().optional(),
      last_name: string().optional(),
      img_url: string().optional(),
      language: string().optional(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class EmailValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      email: string().email().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class ResendEmailValidator extends EmailValidator {}

@injectable()
export class ForgotPasswordValidator extends EmailValidator {}

@injectable()
export class LoginAdminValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      email: string().email().required(),
      password: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class SetAdminPasswordValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      id: number().required(),
      password: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class VerifyCodeValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      verificationCode: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class DeleteAdminValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.params
    const schema = object().keys({
      id: number().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UpdateAdminImageValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = { params: req.params, body: req.body }
    const schema = object().keys({
      params: object().keys({
        id: number().required(),
      }),
      body: object().keys({
        img: string().required(),
      }),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}
