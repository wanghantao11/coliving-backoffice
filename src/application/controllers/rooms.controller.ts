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
  BACKOFFICE, COMMUNITY,
  FULL, ROOM_FULL, ROOM_READ
} from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { RoomService } from './../services/room.service'

@ApiPath({
  name: 'Rooms',
  path: '/rooms',
  security: { basicAuth: [] },
})
@controller('/rooms')
export default class RoomsController extends BaseHttpController {
  constructor(
    @inject('RoomService')
    private roomService: RoomService
  ) {
    super()
  }

  @ApiOperationGet({
    description: 'Get the rooms',
    parameters: {
      query: {
        ids: {
          description: 'Id of the rooms',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
        },
      },
    },
    responses: {
      200: { model: 'Room' },
      400: { description: 'Failed to get the room' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE, COMMUNITY]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL, ROOM_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getRoomsValidator')
  public getRooms(req: Request) {
    return this.roomService.getRooms(req.query.ids)
      .then(rooms => this.json({ rooms }, statuscodes.OK))
  }
}
