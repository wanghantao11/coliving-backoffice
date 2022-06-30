import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { array, boolean, date, number, object, string, validate } from 'joi'

@injectable()
export class CreateIncidentReportValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      facade_id: number().required(),
      category: string().required(),
      description: string().required(),
      estimated_done_date: date().allow(null),
      is_private: boolean().required(),
      location: string().allow(null),
      owner_comment: string().allow(null),
      owner_id: number().required(),
      photos: array().items(string()).allow(null, []),
      priority: string().required(),
      reporter_id: number().required(),
      status: string().allow('', null),
      subcategory: string().required(),
      title: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class CreateIncidentReportByTenantValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      category: string().required(),
      description: string().required(),
      is_private: boolean().allow(null),
      location: string().allow(null),
      photos: array().items(string()).allow(null, []),
      subcategory: string().required(),
      title: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UpdateIncidentReportByAdminValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      category: string().optional(),
      closed_at: date().optional(),
      decline_reason: string().optional().allow(''),
      description: string().optional(),
      estimated_done_date: date().optional().allow(null),
      is_private: boolean().optional(),
      location: string().optional(),
      owner_comment: string().optional(),
      owner_id: number().optional(),
      photos: array().items(string()).allow(null, []),
      priority: string().optional(),
      status: string().optional(),
      subcategory: string().optional(),
      title: string().optional(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

export class GetIncidentReportValidator extends BaseMiddleware {
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
export class GetIncidentReportForAdminValidator extends GetIncidentReportValidator {}

@injectable()
export class GetIncidentReportForTenantValidator extends GetIncidentReportValidator {}

@injectable()
export class GetIncidentReportsForAdminValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.query
    const schema = object().keys({
      status: array().items(string()).optional(),
      offset: number().default(0),
      limit: number().default(10),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class GetIncidentReportsForTenantValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.query
    const schema = object().keys({
      status: array().items(string()).optional(),
      offset: number().default(0),
      limit: number().default(10),
      closed_at: date().optional(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class DeleteIncidentPhotoValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      img: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UpdateIncidentReportByTenantValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      feedback: string().optional(),
      satisfaction_level: string().optional(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}
