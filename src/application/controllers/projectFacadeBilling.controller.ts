import { Request } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPut
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { BACKOFFICE, FULL, ACCOMMODATION_FULL, ACCOMMODATION_READ } from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { ProjectFacadeBillingService } from './../services/projectFacadeBilling.service'

@ApiPath({
  name: 'ProjectFacadeBilling',
  path: '/project-facade-billing',
  security: { basicAuth: [] },
})
@controller('/project-facade-billing')
export default class ProjectFacadeBillingController extends BaseHttpController {
  constructor(
    @inject('ProjectFacadeBillingService')
    private projectFacadeBillingService: ProjectFacadeBillingService
  ) {
    super()
  }

  @ApiOperationGet({
    path: '/{id}',
    description: 'Get the project facade billing info',
    parameters: {
      path: {
        id: {
          description: 'Id of the project facade billing',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'ProjectFacadeBilling' },
      400: { description: 'Failed to get the project facade billing info' },
    },
  })
  @httpGet('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL, ACCOMMODATION_READ]),
    'isAuthenticated',
    'isAuthorized')
  public getProjectFacadeBilling(req: Request) {
    return this.projectFacadeBillingService.getProjectFacadeBilling(req.params.id)
      .then(projectFacadeBilling => this.json({ projectFacadeBilling }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the project facade billing info',
    path : '/{id}',
    parameters: {
      body: { description: 'Project facade billing fields to update', model: 'projectFacadeBilling' },
      path: {
        id: {
          description : 'Id of project facade billing',
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
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized')
  public updateProjectFacadeBilling(req: Request) {
    return this.projectFacadeBillingService.updateProjectFacadeBilling(req.params.id, req.body)
      .then(projectFacadeBilling => this.json({ projectFacadeBilling }, statuscodes.OK))
  }
}
