import { Request } from 'express'
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

import { Room } from './../../domain/entity/room'
import { BACKOFFICE, FULL, ROOM_FULL, ROOM_READ } from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { RoomService } from './../services/room.service'

@ApiPath({
  name: 'Room',
  path: '/room',
  security: { basicAuth: [] },
})
@controller('/room')
export default class RoomController extends BaseHttpController {
  constructor(
    @inject('RoomService')
    private roomService: RoomService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new room',
    parameters: {
      body: { description: 'New room', required: true, model: 'Room' },
    },
    responses: {
      200: { model: 'Room' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost(
    '/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createRoomValidator'
  )
  public createRoom(req: Request) {
    return Room.generateRoom(req.body)
      .then(this.roomService.createRoom)
      .then(room => this.json({ room }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the room',
    path: '/{id}',
    parameters: {
      body: { description: 'Room fields to update', required: true, model: 'Room' },
      path: {
        id: {
          description: 'Id of room',
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
  @httpPut('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateRoomValidator')
  public updateRoom(req: Request) {
    return this.roomService.updateRoom(req.params.id, req.body)
      .then(room => this.json({ room }, statuscodes.OK))
  }

  @ApiOperationDelete({
    path: '/{id}',
    description: 'Delete the room',
    parameters: {
      query: {
        id: {
          description: 'Id of room',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the room' },
    },
  })
  @httpDelete('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized')
  public deleteRoom(req: Request) {
    return this.roomService.deleteRoom(req.params.id)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationDelete({
    description: 'Delete the rooms by the room ids',
    parameters: {},
    responses: {
      200: {},
      400: { description: 'Failed to delete the rooms' },
    },
  })
  @httpDelete('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'deleteRoomsValidator'
  )
  public deleteRooms(req: Request) {
    return this.roomService.deleteRooms(req.body.ids)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{id}/labels',
    description: 'Get all labels for the room',
    parameters: {
      path: {
        id: {
          description: 'Id of the room',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Label' },
      400: { description: 'Failed to get the lables for the room' },
    },
  })
  @httpGet('/:id/labels',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ]),
    'isAuthenticated',
    'isAuthorized')
  public getLabelsByRoomId(req: Request) {
    return this.roomService.getLabelsByRoomId(req.params.id)
      .then(labels => this.json({ labels }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{id}/pending-offers',
    description: 'Get all pending offers sent by admin for the room',
    parameters: {
      path: {
        id: {
          description: 'Id of the room',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Offer' },
      400: { description: 'Failed to get the pending offers for the room' },
    },
  })
  @httpGet('/:id/pending-offers',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ]),
    'isAuthenticated',
    'isAuthorized')
  public getPendingOffersSentByAdminByRoomId(req: Request) {
    return this.roomService.getPendingOffersSentByAdminByRoomId(req.params.id)
      .then(offers => this.json({ offers }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{id}',
    description: 'Get the room',
    parameters: {
      path: {
        id: {
          description: 'Id of the room',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Room' },
      400: { description: 'Failed to get the room' },
    },
  })
  @httpGet('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ]),
    'isAuthenticated',
    'isAuthorized')
  public getRoom(req: Request) {
    return this.roomService.getRoom(req.params.id)
      .then(room => this.json({ room }, statuscodes.OK))
  }

  @ApiOperationGet({
    description: 'Get tenancy by room id',
    parameters: {
      path: {
        id: {
          description: 'Id of the room',
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
      200: { model: 'Tenancy' },
      400: { description: 'Tenancy not found' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpGet('/:id/tenancy',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ]),
    'isAuthenticated',
    'isAuthorized')
  public getTenancy(req: Request) {
    return this.roomService.getTenancyBy({ room_id: req.params.id, ...req.query })
      .then(tenancies => this.json({ tenancies }, statuscodes.OK))
  }
}
