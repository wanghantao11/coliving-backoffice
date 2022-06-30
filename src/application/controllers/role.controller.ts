import { inject } from 'inversify'
import { Request } from 'express'
import * as statuscodes from 'http-status-codes'
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

import { BACKOFFICE, FULL, ROLE_FULL, ROLE_READ } from './../../infrastructure/constants'
import { RoleService } from './../services/role.service'
import { AuthMiddleware } from './../middleware/auth'

@ApiPath({
  name: 'Role',
  path: '/role',
  security: { basicAuth: [] },
})
@controller('/role')
export default class RoleController extends BaseHttpController {
  constructor(
    @inject('RoleService')
    private roleService: RoleService
  ) {
    super()
  }

  @ApiOperationGet({
    path: '/{clientId}',
    description: 'Get roles for the client',
    parameters: {
      path: {
        clientId: {
          description: 'Id of client',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Role' },
      400: { description: 'Failed to get the roles' },
    },
  })
  @httpGet('/:clientId',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROLE_FULL, ROLE_READ]),
    'isAuthenticated',
    'isAuthorized'
  )
  public getRolesByClientId(req: Request) {
    return this.roleService.getRolesByClientId(req.params.clientId)
      .then(roles => this.json(roles, statuscodes.OK))
  }
}
