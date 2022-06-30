import { Request } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpGet
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import {
  BACKOFFICE, FULL, ROOM_FULL, ROOM_READ, CONTRACT_FULL, CONTRACT_READ
} from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { RoomService } from '../services/room.service'

@ApiPath({
  name: 'RoomAndTenant',
  path: '/roomAndTenants',
  security: { basicAuth: [] },
})
@controller('/roomAndTenants')
export default class RoomAndTenantsController extends BaseHttpController {
  constructor(
    @inject('RoomService')
    private readonly roomService: RoomService
  ) {
    super()
  }

  @ApiOperationGet({
    path: '/{facadeId}',
    description: 'Get all rooms and tenants who lived in these rooms for the given project facade',
    parameters: {
      path: {
        facadeId: {
          description: 'Project facade id',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
      query: {
        name: {
          description : 'Room name',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        room_number: {
          description : 'Room number',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        prefix: {
          description : 'Tenant name',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        people_per_room: {
          description : 'How many people can accomodate in the room',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        status: {
          description : 'Room status',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        label_ids: {
          description : 'Room label ids',
          type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
        },
        offset: {
          description : 'Offset value of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        limit: {
          description : 'Limit value of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        sort_order: {
          description : 'Sort order of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        sort_by: {
          description : 'Sort by field of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get the rooms and tenants' },
    },
  })
  @httpGet('/:facadeId',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getRoomAndTenantsValidator')
  public getRoomsWithTenants(req: Request) {
    return this.roomService.getRoomsWithTenants(Number(req.params.facadeId), req.query)
      .then(roomAndTenants => this.json({ roomAndTenants }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{facadeId}/contracts',
    description: 'Get all rooms and contracts where each room has terminated but move-out date is in future',
    parameters: {
      path: {
        facadeId: {
          description: 'Project facade id',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get the rooms and tenants' },
    },
  })
  @httpGet('/:facadeId/contracts',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized')
  public getRoomsWithTerminatedContracts(req: Request) {
    return this.roomService.getRoomsWithTerminatedContracts(Number(req.params.facadeId))
      .then(roomAndContracts => this.json({ roomAndContracts }, statuscodes.OK))
  }
}
