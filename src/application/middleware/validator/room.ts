import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { boolean, number, object, string, validate, array, date } from 'joi'
import { ROOM_STATUS } from '../../../infrastructure/constants'

@injectable()
export class CreateRoomValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      facade_id: number().required(),
      address_id: number().required(),
      apartment_id: number().optional(),
      floor_no: string().optional(),
      has_private_bathroom: boolean().optional(),
      has_private_kitchen: boolean().optional(),
      has_private_toilet: boolean().optional(),
      is_suitable_for_disability: boolean().optional(),
      label_ids: array().optional(),
      name: string().optional(),
      notes: string().optional(),
      number: string().required(),
      people_per_room: number().required(),
      rent: number().required(),
      service_fee: number().required(),
      shared_area_size: number().required(),
      size: number().required(),
      status: string().valid(ROOM_STATUS.AVAILABLE, ROOM_STATUS.OCCUPIED, ROOM_STATUS.OUT_OF_SERVICE, ROOM_STATUS.RESERVED),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class DeleteRoomsValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    const schema = object().keys({
      ids: array().min(1),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class GetRoomAndTenantsValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = { query: req.query, params: req.params }
    const schema = object().keys({
      query: object().keys({
        status: string().valid('Available', 'Reserved', 'Occupied', 'Out of service').optional(),
        label_ids: array().optional(),
        people_per_room: number().optional(),
        room_number: number().optional(),
        prefix: string().optional(),
        name: string().optional(),
        limit: number().optional(),
        offset: number().optional(),
      }),
      params: object().keys({
        facadeId: number().required(),
      }),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class ParameterRoomIdValidator extends BaseMiddleware {
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
export class UpdateRoomValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction){
    const data = { body: req.body, params: req.params }
    const schema = object().keys({
      body: object().keys({
        name: string().optional().allow(null, ''),
        rent: number().optional(),
        size: number().optional(),
        service_fee: number().optional(),
        shared_area_size: number().optional(),
        people_per_room: number().optional(),
        move_in_date: date().optional().allow(null, ''),
        number: string().optional(),
        floor_no: string().optional().allow(null, ''),
        address_id: number().optional(),
        apartment_id: number().optional().allow(null, ''),
        has_private_bathroom: boolean().optional(),
        has_private_kitchen: boolean().optional(),
        has_private_toilet: boolean().optional(),
        is_suitable_for_disability: boolean().optional(),
        label_ids: array().optional(),
        notes: string().optional().allow(null, ''),
        status: string().optional().valid(ROOM_STATUS.AVAILABLE, ROOM_STATUS.OCCUPIED, ROOM_STATUS.OUT_OF_SERVICE, ROOM_STATUS.RESERVED),
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
