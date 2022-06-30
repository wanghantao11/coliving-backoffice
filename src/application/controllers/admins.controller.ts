import { inject } from 'inversify'
import { Request, Response } from 'express'
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

import {
  BACKOFFICE,
  FULL, ADMIN_FULL, ADMIN_READ, INCIDENT_READ
} from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { AdminService } from './../services/admin.service'

@ApiPath({
  name: 'Admins',
  path: '/admins',
  security: { basicAuth: [] },
})
@controller('/admins')
export default class AdminsController extends BaseHttpController {
  constructor(
    @inject('AdminService')
    private adminService: AdminService
  ) {
    super()
  }

  @ApiOperationGet({
    description: 'Get all admin users for the organization',
    responses: {
      200: { model: 'Admin' },
      400: { description: 'Failed to get the admin users' },
    },
  })
  @httpGet(
    '/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ADMIN_FULL, ADMIN_READ]),
    'isAuthenticated',
    'isAuthorized'
  )
  public getAdminsByClientId(req: Request, res: Response) {
    return this.adminService.getAdminsByClientId(res.locals.clientId)
      .then(admins => this.json({ admins }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/host-and-site-admin/{facadeId}',
    description: 'Get all hosts and admins for the given project',
    parameters: {
      path: {
        facadeId: {
          description : 'Id of project facade',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'Admin' },
      400: { description: 'Failed to get hosts and admins' },
    },
  })
  @httpGet(
    '/host-and-site-admin/:facadeId',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, INCIDENT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getAdminsValidator'
  )
  public getHostsOrSiteAdminsByFacadeId(req: Request) {
    return this.adminService.getHostsOrSiteAdminsByFacadeId(Number(req.params.facadeId))
      .then(admins => this.json({ admins }, statuscodes.OK))
  }
}
