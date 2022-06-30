import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { number, object, validate, string, boolean, array, date } from 'joi'

@injectable()
export class GetSubscribedMembersValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = { query: req.query, params: req.params }
    const schema = object().keys({
      query: object().keys({
        email: string().optional(),
        name: string().optional(),
        has_double_room: boolean().required(),
        has_single_room: boolean().required(),
        has_private_bathroom: boolean().required(),
        has_shared_bathroom: boolean().required(),
        has_private_toilet: boolean().required(),
        has_shared_toilet: boolean().required(),
        include_unspecified_age: boolean().required(),
        include_unspecified_move_in_date: boolean().required(),
        exclude_users_with_offers: boolean().required(),
        exclude_current_tenants: boolean().required(),
        is_only_matching_rent: boolean().required(),
        is_only_suitable_for_disability: boolean().required(),
        is_only_today: boolean().required(),
        is_only_test_complete: boolean().required(),
        tag_ids: array().optional(),
        rent: number().required(),
        age_from: number().optional(),
        age_to: number().optional(),
        subscribe_from: date().optional(),
        subscribe_to: date().optional(),
        matching_score: number().optional(),
        move_in_date_from: date().optional(),
        limit: number().optional(),
        offset: number().optional(),
        sort_order: string().valid(['ASC', 'DESC']),
        sort_by: string().valid(['subscribed_at', 'age', 'email', 'note', 'move_in_date_to', 'score']),
      }),
      params: object().keys({
        facadeId: number().required(),
        apartmentId: number().required(),
      }),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class GetMemberValidator extends BaseMiddleware {
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
export class GetMemberNotesValidator extends GetMemberValidator { }

@injectable()
export class GetMemberPreferencesValidator extends GetMemberValidator { }

@injectable()
export class GetMemberProfileValidator extends GetMemberValidator { }

@injectable()
export class GetMemberSubscriptionsValidator extends GetMemberValidator { }

@injectable()
export class GetMemberWishedRoomiesValidator extends GetMemberValidator { }

@injectable()
export class CreateMemberNotesValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      iduser: string().required(),
      description: string().required(),
      tag_ids: array().items(number()).optional(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UpdateMemberNotesValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = { body: req.body, params: req.params }
    const schema = object().keys({
      body: object().keys({
        description: string().required(),
        tag_ids: array().items(number()).optional(),
      }),
      params: object().keys({
        iduser: string().required(),
      }),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}
