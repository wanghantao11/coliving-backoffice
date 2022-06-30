import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut
} from 'inversify-express-utils'
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { ProjectFacade } from './../../domain/entity'
import { AuthMiddleware } from './../middleware/auth'
import { ProjectFacadeService } from './../services/projectFacade.service'
import { AddressService } from './../services/address.service'
import { ApartmentService } from './../services/apartment.service'
import { LabelService } from './../services/label.service'
import { RoomService } from './../services/room.service'

import {
  BACKOFFICE, COMMUNITY, TENANT,
  FULL, ACCOMMODATION_FULL, ACCOMMODATION_READ, ROOM_FULL, ROOM_READ
} from '../../infrastructure/constants'

@ApiPath({
  name: 'ProjectFacade',
  path: '/project-facade',
  security: { basicAuth: [] },
})
@controller('/project-facade')
export default class ProjectFacadeController extends BaseHttpController {
  constructor(
    @inject('ProjectFacadeService')
    private projectFacadeService: ProjectFacadeService,
    @inject('AddressService')
    private addressService: AddressService,
    @inject('ApartmentService')
    private apartmentService: ApartmentService,
    @inject('LabelService')
    private labelService: LabelService,
    @inject('RoomService')
    private roomService: RoomService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new project facade',
    parameters: {
      body: { description: 'New project facade', required: true, model: 'ProjectFacade' },
    },
    responses: {
      200: { model: 'ProjectFacade' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost(
    '/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createProjectFacadeValidator'
  )
  public createProjectFacade(req: Request, res: Response) {
    return ProjectFacade.generateProjectFacade({ client_id: res.locals.clientId, ...req.body })
      .then(this.projectFacadeService.createProjectFacade)
      .then(project => this.json({ project }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the project facade',
    path : '/{id}',
    parameters: {
      path: {
        id: {
          description : 'Id of project facade',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPut(
    '/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateProjectFacadeValidator'
  )
  public updateProjectFacade(req: Request, res: Response) {
    return this.projectFacadeService.updateProjectFacade(
      req.params.id,
      { client_id: res.locals.clientId, ...req.body })
      .then(project => this.json({ project }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/my-all',
    description: 'Get all published projects',
    parameters: {
      query: {
        offset: {
          description: 'Offset value of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        limit: {
          description: 'Limit value of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Project' },
      400: { description: 'Failed to get the projects' },
    },
  })
  @httpGet('/my-all',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL, ACCOMMODATION_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getProjectFacadesValidator')
  public getAllMyProjectFacades(req: Request, res: Response) {
    return this.projectFacadeService.getAllMyProjectFacades(
      res.locals.clientId,
      req.query.offset,
      req.query.limit)
      .then(projects => this.json({ projects }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/tenant',
    description: 'Get the project facade for the tenant',
    responses: {
      200: { model: 'ProjectFacade' },
      400: { description: 'Failed to get the project facade' },
    },
  })
  @httpGet('/tenant',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized')
  public getProjectFacadeForTenant(req: Request, res: Response) {
    return this.projectFacadeService.getProjectFacade(res.locals.projectId)
      .then(data => this.json({ data }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{id}/addresses',
    description: 'Get all addresses for the project facade',
    parameters: {
      path: {
        id: {
          description: 'Id of the project facade',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Address' },
      400: { description: 'Failed to get the addresses' },
    },
  })
  @httpGet('/:id/addresses',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ]),
    'isAuthenticated',
    'isAuthorized',
    'parameterFacadeIdValidator')
  public getAddressesByFacadeId(req: Request) {
    return this.addressService.getAddressesByFacadeId(req.params.id)
      .then(addresses => this.json({ addresses }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{id}/apartments',
    description: 'Get all apartments for the project facade',
    parameters: {
      path: {
        id: {
          description: 'Id of the project facade',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Apartment' },
      400: { description: 'Failed to get the apartments' },
    },
  })
  @httpGet('/:id/apartments',
    AuthMiddleware.allowAuthTypes([BACKOFFICE, COMMUNITY]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ]),
    'isAuthenticated',
    'isAuthorized',
    'parameterFacadeIdValidator')
  public getApartmentsByProjectId(req: Request) {
    return this.apartmentService.getApartmentsByFacadeId(req.params.id)
      .then(apartments => this.json({ apartments }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{id}/labels',
    description: 'Get all labels for the project facade',
    parameters: {
      path: {
        id: {
          description: 'Id of the project facade',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Label' },
      400: { description: 'Failed to get the labels' },
    },
  })
  @httpGet('/:id/labels',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ]),
    'isAuthenticated',
    'isAuthorized',
    'parameterFacadeIdValidator')
  public getLabelsByFacadeId(req: Request) {
    return this.labelService.getLabelsByFacadeId(req.params.id)
      .then(labels => this.json({ labels }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{id}/rooms',
    description: 'Get all addresses for the project facade',
    parameters: {
      path: {
        id: {
          description: 'Id of the project facade',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
      query: {
        today: {
          description: 'Current date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'Room' },
      400: { description: 'Failed to get the rooms' },
    },
  })
  @httpGet('/:id/rooms',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ]),
    'isAuthenticated',
    'isAuthorized',
    'parameterFacadeIdValidator')
  public getRoomsByFacadeId(req: Request) {
    return this.roomService.getRoomsByFacadeId(req.params.id, req.query.today)
      .then(rooms => this.json({ rooms }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{id}',
    description: 'Get the project facade by the admin',
    parameters: {
      path: {
        id: {
          description: 'Id of the project facade',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'ProjectFacade' },
      400: { description: 'Failed to get the project facade' },
    },
  })
  @httpGet('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL, ACCOMMODATION_READ]),
    'isAuthenticated',
    'isAuthorized',
    'parameterFacadeIdValidator')
  public getProjectFacade(req: Request) {
    return this.projectFacadeService.getProjectFacade(req.params.id)
      .then(data => this.json({ data }, statuscodes.OK))
  }

  @ApiOperationDelete({
    path: '/{id}',
    description: 'Delete the project facade',
    parameters: {
      path: {
        id: {
          description : 'Id of project facade',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the project facade' },
    },
  })
  @httpDelete('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'parameterFacadeIdValidator')
  public deleteProjectFacade(req: Request) {
    return this.projectFacadeService.deleteProjectFacade(req.params.id)
      .then(id => this.json({ id }, statuscodes.OK))
  }
}
