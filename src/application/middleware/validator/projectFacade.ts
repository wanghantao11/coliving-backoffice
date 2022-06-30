import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { boolean, date, number, object, string, validate } from 'joi'

@injectable()
export class CreateProjectFacadeValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      name: string().not().empty().required(),
      address: string().allow('', null),
      post_area: string().not().empty().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UpdateProjectFacadeValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = { params: req.params, body: req.body }
    const schema = object().keys({
      body: object().keys({
        client_id: number().optional(),
        name: string(),
        address: string().allow('', null),
        cover_image_source: string().uri().allow('', null),
        cover_image_text: string().allow('', null),
        post_area: string(),
        published: boolean().optional().allow(null),
        published_at: date().optional().allow(null),
        landlord_name: string().optional(),
        landlord_email: string().optional(),
        landlord_org_no: string().optional(),
        landlord_street: string().optional(),
        landlord_zip: string().optional(),
        landlord_post_area: string().optional(),
        property_unit_designation: string().optional(),
        coliving_hub: string().optional(),
        is_auto_offer_flow: boolean().optional(),
      }),
      params: object().keys({
        id: number().required(),
      }),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class GetProjectFacadesValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.query
    const schema = object().keys({
      limit: number().optional().default(10),
      offset: number().optional().default(0),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class ParameterFacadeIdValidator extends BaseMiddleware {
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
