import { inject } from 'inversify'
import { Request } from 'express'
import * as statuscodes from 'http-status-codes'
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpPost,
  httpPut
} from 'inversify-express-utils'
import {
  ApiOperationDelete,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { ApartmentService } from './../services/apartment.service'
import { Apartment } from './../../domain/entity'
import { AuthMiddleware } from './../middleware/auth'
import {
  BACKOFFICE,
  FULL, ROOM_FULL
} from '../../infrastructure/constants'

@ApiPath({
  name: 'Apartment',
  path: '/apartment',
  security: { basicAuth: [] },
})
@controller('/apartment')
export default class ApartmentController extends BaseHttpController {
  constructor(
    @inject('ApartmentService')
    private apartmentService: ApartmentService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new apartment',
    parameters: {
      body: { description: 'New apartment', required: true, model: 'Apartment' },
    },
    responses: {
      200: { model: 'Apartment' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createApartmentValidator'
  )
  public createApartment(req: Request) {
    return Promise.resolve(Apartment.generateApartment(req.body))
      .then(this.apartmentService.createApartment)
      .then(apartment => this.json({ apartment }, statuscodes.OK))
  }

  @ApiOperationDelete({
    description: 'Delete the apartment',
    path : '/{id}',
    parameters: {
      path: {
        id: {
          description : 'Id of apartment',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the apartment' },
    },
  })
  @httpDelete('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'deleteApartmentValidator'
  )
  public deleteApartment(req: Request) {
    return this.apartmentService.deleteApartment(req.params.id)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the apartment',
    path : '/{id}',
    parameters: {
      body: { description: 'Apartment fields to update', model: 'Apartment' },
      path: {
        id: {
          description : 'Id of apartment',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPut('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateApartmentValidator')
  public updateApartment(req: Request) {
    return this.apartmentService.updateApartment(req.params.id, req.body)
      .then(apartment => this.json({ apartment }, statuscodes.OK))
  }
}
