import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { date, number, object, string, validate, boolean, array } from 'joi'
import { ProjectFacadeDao } from '../../../domain/dao'
import { checkIsContractDataReady } from '../../../infrastructure/utils/contract'

@injectable()
export class AcceptOfferValidator extends BaseMiddleware {
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
export class RejectOfferValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = { body: req.body, params: req.params }
    const schema = object().keys({
      body: object().keys({
        rejection_reason: object().keys({
          move_in_date: boolean().optional(),
          exit_search: boolean().optional(),
          price: boolean().optional(),
          room_type: boolean().optional(),
          other: boolean().optional(),
        }),
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
export class RequestOfferValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      facade_id: number().required(),
      is_suitable_for_disability: boolean().required(),
      has_room_type_preference: boolean().required(),
      has_single_room: boolean().required(),
      has_double_room: boolean().required(),
      has_private_bathroom: boolean().required(),
      has_private_toilet: boolean().required(),
      rent_to: number().optional(),
      preferred_roommate_iduser: string().optional(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class RequestManualValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      facade_id: number().required(),
      project_name: string().allow('', null),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class GetOffersForAdminValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.params
    const schema = object().keys({
      iduser: string().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class SendOffersToSelectedMembersValidator extends BaseMiddleware {
  constructor(
    @inject('ProjectFacadeDao') private projectFacadeDao: ProjectFacadeDao
  ) {
    super()
  }
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      room_id: number().required(),
      facade_id: number().required(),
      facade_name: string().required(),
      offer_info_list: array().items(object().keys({ iduser: string(), is_preferences_matched: boolean(), matching_score: number().allow(null) })).required(),
      move_in_date: date().optional(),
    })

    return this.projectFacadeDao.getProjectDataForContract(req.body.room_id)
      .then(contractData => !contractData ? Promise.reject({ message: 'NOT_ALLOWED', reason: `No contract data is found for room ${req.body.room_id}` }) : contractData)
      .then(checkIsContractDataReady)
      .then(isContractDataReady => !isContractDataReady ? Promise.reject({ message: 'NOT_ALLOWED', reason: `Contract data is not ready for room ${req.body.room_id}` }) : null)
      .then(() => validate(data, schema, err => err ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
        : next()))
  }
}
