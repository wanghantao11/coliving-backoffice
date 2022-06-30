import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { array, boolean, date, number, object, string, validate } from 'joi'

@injectable()
export class UpdateUserPreferencesValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      has_single_room: boolean().optional(),
      has_double_room: boolean().optional(),
      has_private_bathroom: boolean().optional(),
      has_private_toilet: boolean().optional(),
      has_room_type_preference: boolean().optional(),
      is_suitable_for_disability: boolean().optional(),
      locations: array().items(string()).allow(null, []),
      move_in_date_from: date().allow(null),
      move_in_date_to: date().allow(null),
      period_of_stay: string().optional(),
      rent_from: number().allow(null),
      rent_to: number().allow(null),
      roomies: array().items(number()).allow(null, []),
      needs_contact_back: boolean().optional(),
      needs_manual_offer: boolean().optional(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}
