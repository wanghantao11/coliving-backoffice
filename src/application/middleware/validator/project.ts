import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { array, boolean, date, number, object, string, validate } from 'joi'

import { ProjectDao } from '../../../domain/dao'
import { checkIsContractDataReadyForProject } from '../../../infrastructure/utils/contract'
import { PROJECT_STATUS } from '../../../infrastructure/constants'

@injectable()
export class CreateProjectValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.body

    const gallerySchema = object().keys({
      id: number().allow(null),
      project_id: number().allow(null),
      source: string().uri().allow(null, ''),
      text: string().allow('', null),
      created_at: date().optional(),
      updated_at: date().optional(),
    })

    const schema = object().keys({
      facade_id: number().not().empty().required(),
      about_location: string().allow('', null),
      about_location_en: string().allow('', null),
      about_project: string().allow('', null),
      about_project_en: string().allow('', null),
      about_other_info: string().allow('', null),
      about_other_info_en: string().allow('', null),
      apartments: number().allow(null),
      city: string().allow('', null),
      community_features: array().items(string()).allow(null, []),
      country: string().allow('', null),
      cover_image_source: string().uri().allow('', null),
      cover_image_text: string().allow('', null),
      distance_to_public_transport: string().allow('', null),
      floor_map_source: string().uri().allow('', null),
      floor_map_text: string().allow('', null),
      gallery: array().items(gallerySchema).allow(null, []),
      is_published: boolean().allow(null),
      key_features: array().items(string()).allow(null, []),
      move_in_date: date().allow(null),
      name: string().not().empty().required(),
      published_at: date().allow(null),
      room_features: array().items(string()).allow(null, []),
      room_rent_from: number().allow(null),
      room_rent_to: number().allow(null),
      room_size_from: number().allow(null),
      room_size_to: number().allow(null),
      roomies_from: number().allow(null),
      roomies_to: number().allow(null),
      service_fee: number().allow(null),
      shared_area_size_from: number().allow(null),
      shared_area_size_to: number().allow(null),
      status: string().allow(null, ''),
      street: string().allow('', null),
      third_party_services: array().items(string()).allow(null, []),
      zip: string().allow('', null),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UpdateProjectValidator extends BaseMiddleware {
  constructor(
    @inject('ProjectDao') private projectDao: ProjectDao
  ) {
    super()
  }

  public handler(req: Request, res: Response, next: NextFunction) {
    const data = { body: req.body, params: req.params }
    const gallerySchema = object().keys({
      id: number().allow(null),
      project_id: number().allow(null),
      source: string().uri().allow(null, ''),
      text: string().allow('', null),
      created_at: date().optional(),
      updated_at: date().optional(),
    })
    const schema = object().keys({
      body: object().keys({
        about_location: string().allow(null, ''),
        about_location_en: string().allow(null, ''),
        about_project: string().allow(null, ''),
        about_project_en: string().allow(null, ''),
        about_other_info: string().allow(null, ''),
        about_other_info_en: string().allow(null, ''),
        apartments: number().allow(null),
        city: string().optional(),
        community_features: array().items(string()).allow(null, []),
        country: string().optional(),
        cover_image_source: string().uri().optional(),
        cover_image_text: string().allow(null, ''),
        distance_to_public_transport: string().allow(null, ''),
        floor_map_source: string().uri().allow(null, ''),
        floor_map_text: string().allow(null, ''),
        gallery: array().items(gallerySchema).allow(null, []),
        is_published: boolean().optional(),
        key_features: array().items(string()).allow(null, []),
        move_in_date: date().allow(null),
        name: string().optional(),
        published_at: date().allow(null),
        room_features: array().items(string()).allow(null, []),
        room_rent_from: number().allow(null),
        room_rent_to: number().allow(null),
        room_size_from: number().allow(null),
        room_size_to: number().allow(null),
        roomies_from: number().allow(null),
        roomies_to: number().allow(null),
        service_fee: number().allow(null),
        shared_area_size_from: number().allow(null),
        shared_area_size_to: number().allow(null),
        status: string().allow(null, ''),
        street: string().optional(),
        third_party_services: array().items(string()).allow(null, []),
        zip: string().optional(),
      }),
      params: object().keys({
        id: number().required(),
      }),
    })

    if (data.body.status && data.body.status === PROJECT_STATUS.AVAILABLE) {
      return this.projectDao.getProjectDataForContractByProjectId(Number(data.params.id))
        .then(contractData => !contractData || contractData.rooms.length === 0 ? Promise.reject({ message: 'NOT_ALLOWED', reason: `Contract data not found for project ${data.params.id}` }) : contractData)
        .then(({ rooms, ...rest }) => checkIsContractDataReadyForProject(rooms.map(room => ({ ...room, ...rest }))))
        .then(isContractDataReady => !isContractDataReady ? Promise.reject({ message: 'NOT_ALLOWED', reason: `Contract data is not ready for project ${data.params.id}` }) : null)
        .then(() => validate(data, schema, err => err
          ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' })
          : next()
        ))
        .catch(next)
    } else {
      validate(data, schema, err => err
        ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
        : next()
      )
    }
  }
}

@injectable()
export class GetProjectByFacadeIdValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.params
    const schema = object().keys({
      id: number().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' }).catch(next)
      : next()
    )
  }
}

@injectable()
export class PublishedProjectValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.params
    const schema = object().keys({
      id: number().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' }).catch(next)
      : next()
    )
  }
}

@injectable()
export class GetPublishedProjectsValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.query
    const schema = object().keys({
      offset: number().default(0),
      limit: number().default(10),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' }).catch(next)
      : next()
    )
  }
}

@injectable()
export class UploadProjectImageValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = {params: req.params, body: req.body }
    const schema = object().keys({
      params: object().keys({
        id: number().required(),
      }),
      body: object().keys({
        img: string().required(),
      }),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' }).catch(next)
      : next()
    )
  }
}

@injectable()
export class DeleteProjectValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    const data = req.params
    const schema = object().keys({
      id: number().required(),
    })

    validate(data, schema, err => err
      ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data' }).catch(next)
      : next()
    )
  }
}
