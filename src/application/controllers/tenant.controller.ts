import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpPost,
  httpGet
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { TENANT } from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { TenantService } from './../services/tenant.service'

@ApiPath({
  name: 'Tenant',
  path: '/tenant',
  security: { basicAuth: [] },
})
@controller('/tenant')
export default class TenantController extends BaseHttpController {
  constructor(
    @inject('TenantService')
    private tenantService: TenantService
  ) {
    super()
  }

  @ApiOperationPost({
    path : '/login',
    description: 'Login to tenant app for the tenant',
    parameters: {
      body: {
        properties: {
          email: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
          password: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
        },
        required: true,
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to login' },
    },
  })
  @httpPost('/login',
    'loginTenantValidator')
  public tenantLogin(req: Request) {
    return this.tenantService.login(req.body.email, req.body.password)
      .then(token => this.json({ token }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/documents',
    description: 'Get the tenant documents',
    responses: {
      200: {},
      400: { description: 'Failed to get the tenant documents' },
    },
  })
  @httpGet('/documents',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized')
  public getTenantDocuments(req: Request, res: Response) {
    return this.tenantService.getTenantDocumentsByFacadeId(Number(res.locals.projectId))
      .then(documents => this.json({ documents }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/hosts',
    description: 'Get the hosts for the given project facade',
    responses: {
      200: {},
      400: { description: 'Failed to get hosts' },
    },
  })
  @httpGet('/hosts',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized'
  )
  public getHostsByFacadeId(req: Request, res: Response) {
    return this.tenantService.getHostsByFacadeId(Number(res.locals.projectId))
      .then(host => this.json({ host }, statuscodes.OK))
  }

  @ApiOperationGet({
    description: 'Get the tenant details',
    parameters: {
      query: {
        iduser: { description: 'Id of the tenant', type: SwaggerDefinitionConstant.Parameter.Type.STRING },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get tenant details' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized')
  public getTenantDetailById(req: Request) {
    return this.tenantService.getTenantDetailById(req.query.iduser)
      .then(tenant => this.json({ tenant }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{iduser}',
    description: 'Get the tenant by the id',
    parameters: {
      path: {
        iduser: { description: 'Id of the member', type: SwaggerDefinitionConstant.Parameter.Type.STRING },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get tenant' },
    },
  })
  @httpGet('/:iduser',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'getOtherTenantValidator')
  public getOtherTenantById(req: Request) {
    return this.tenantService.getOtherTenantDetailById(req.params.iduser)
      .then(tenant => this.json({ tenant }, statuscodes.OK))
  }

}
