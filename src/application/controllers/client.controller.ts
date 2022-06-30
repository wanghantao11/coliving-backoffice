import { inject } from 'inversify'
import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
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

import {
  BACKOFFICE,
  FULL, CLIENT_FULL, CLIENT_READ
} from './../../infrastructure/constants'
import { uploadLogo } from './../firebase/client'
import { AuthMiddleware } from './../middleware/auth'
import { ClientService } from './../services/client.service'
import { RoleService } from './../services/role.service'

@ApiPath({
  name: 'Client',
  path: '/client',
  security: { basicAuth: [] },
})
@controller('/client')
export default class ClientController extends BaseHttpController {
  constructor(
    @inject('ClientService')
    private clientService: ClientService,
    @inject('RoleService')
    private roleService: RoleService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new client',
    parameters: {
      body: { description: 'New client', required: true, model: 'Client' },
    },
    responses: {
      200: { model: 'Client' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CLIENT_FULL]),
    'isAuthenticated',
    'isAuthorized')
  public createClient(req: Request) {
    return this.clientService.createClient(req.body)
      .then(client => this.json({client}, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Upload the client logo',
    path : '/{id}/logo',
    parameters: {
      body: { name: 'img', description: 'Url of the logo to upload' },
      path: {
        id: {
          description : 'Id of client',
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
  @httpPut('/:id/logo',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CLIENT_FULL]),
    'isAuthenticated',
    'isAuthorized')
  public uploadClientLogo(req: Request) {
    return uploadLogo(req.params.id, req.body.img)
      .then(res => this.json(res, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/',
    description: 'Get the client details',
    responses: {
      200: { model: 'Client' },
      400: { description: 'Failed to get client' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CLIENT_FULL, CLIENT_READ]),
    'isAuthenticated',
    'isAuthorized'
  )
  public getClient(req: Request, res: Response) {
    return this.clientService.getClient(res.locals.clientId)
      .then(client => this.json({ client }, statuscodes.OK))
  }

  @ApiOperationDelete({
    description: 'Delete the client',
    path : '/{id}',
    parameters: {
      path: {
        id: {
          description : 'Id of client',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the client' },
    },
  })
  @httpDelete('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CLIENT_FULL]),
    'isAuthenticated',
    'isAuthorized'
  )
  public deleteClient(req: Request) {
    return this.clientService.deleteClient(req.params.id)
  }
}
