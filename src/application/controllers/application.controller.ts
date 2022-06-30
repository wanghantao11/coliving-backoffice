import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost
} from 'inversify-express-utils'
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import {
  BACKOFFICE, COMMUNITY, TENANT,
  FULL, APPLICATION_FULL, APPLICATION_READ
} from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { ApplicationService } from './../services/application.service'

@ApiPath({
  name: 'Application',
  path: '/application',
  security: { basicAuth: [] },
})
@controller('/application')
export default class ApplicationController extends BaseHttpController {
  constructor(
    @inject('ApplicationService')
    private readonly applicationService: ApplicationService
  ) {
    super()
  }

  /* ---------------------- Endpoints for community and app ---------------------- */
  @ApiOperationPost({
    description: 'Create a new application',
    parameters: {
      body: { description: 'New application', required: true, model: 'Application' },
    },
    responses: {
      200: { model: 'Application' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    AuthMiddleware.needPermisson([FULL, APPLICATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createApplicationValidator'
  )
  public applyForProject(req: Request, res: Response) {
    return this.applicationService.applyForProject(res.locals.userId, req.body.facade_id)
      .then(application => this.json({ application }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/',
    description: 'Get the member applications',
    responses: {
      200: { model: 'Application' },
      400: { description: 'Failed to get member applications' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    AuthMiddleware.needPermisson([FULL, APPLICATION_FULL, APPLICATION_READ]),
    'isAuthenticated',
    'isAuthorized')
  public getMemberApplications(req: Request, res: Response) {
    return this.applicationService.getMemberApplications(res.locals.userId)
      .then(applications => this.json({ applications }, statuscodes.OK))
  }

  @ApiOperationDelete({
    description: 'Delete the application of the given project',
    path : '/{projectId}',
    parameters: {
      path: {
        projectId: {
          description : 'Id of project',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the application' },
    },
  })
  @httpDelete('/:projectId',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    AuthMiddleware.needPermisson([FULL, APPLICATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'deleteApplicationValidator')
  public unapplyForProject(req: Request, res: Response) {
    return this.applicationService.unapplyForProject(res.locals.userId, req.params.projectId)
      .then(() => this.json({}, statuscodes.OK))
  }

  /* ----------------------- Endpoints for backoffice ----------------------- */
  @ApiOperationGet({
    path: '/count',
    description: 'Get the total and today number of applications for the given project',
    parameters: {
      query: {
        facadeId: { description: 'Id of the project facade', type: SwaggerDefinitionConstant.Parameter.Type.STRING },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get applications count' },
    },
  })
  @httpGet('/count',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, APPLICATION_FULL, APPLICATION_READ]),
    'isAuthenticated',
    'isAuthorized',
    'countApplicationValidator')
  public getTotalCountAndTodayCountOfApplications(req: Request) {
    return this.applicationService.getTotalCountAndTodayCountOfApplications(req.query.facadeId)
      .then(count => this.json({ count }, statuscodes.OK))
  }
}
