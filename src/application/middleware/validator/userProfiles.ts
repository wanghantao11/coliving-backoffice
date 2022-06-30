import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { array, boolean, number, object, string, validate } from 'joi'

@injectable()
export class UpdateUserProfileValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      interest_ids: array().items(number()),
      display_name: string().optional(),
      hometown: string().optional(),
      occupation: string().optional(),
      schools: array().items(string()),
      food_preference: string().optional(),
      gluten_intolerent: boolean().optional(),
      wheat_intolerent: boolean().optional(),
      lactose_intolerent: boolean().optional(),
      allergic_to_milk: boolean().optional(),
      allergic_to_egg: boolean().optional(),
      allergic_to_shellfish: boolean().optional(),
      allergic_to_fish: boolean().optional(),
      allergic_to_nuts: boolean().optional(),
      fun_facts: object().optional(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}
