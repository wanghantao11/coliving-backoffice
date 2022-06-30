import { inject } from 'inversify'
import { Request } from 'express'
import * as statuscodes from 'http-status-codes'
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpPost,
  httpPut
} from 'inversify-express-utils'
import {
  ApiOperationDelete,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { ProjectGalleryService } from './../services/projectGallery.service'
import { AuthMiddleware } from './../middleware/auth'
import {
  BACKOFFICE,
  FULL, ACCOMMODATION_FULL
} from '../../infrastructure/constants'

@ApiPath({
  name: 'ProjectGallery',
  path: '/project-gallery',
  security: { basicAuth: [] },
})
@controller('/project-gallery')
export default class ProjectGalleryController extends BaseHttpController {
  constructor(
    @inject('ProjectGalleryService')
    private projectGalleryService: ProjectGalleryService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new project gallery image',
    parameters: {
      body: { description: 'New project gallery image', required: true, model: 'ProjectGallery' },
    },
    responses: {
      200: { model: 'ProjectGallery' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createProjectGalleryValidator'
  )
  public createProjectGallery(req: Request) {
    return this.projectGalleryService.createProjectImage(req.body)
      .then(projectGallery => this.json({ projectGallery }, statuscodes.OK))
  }

  @ApiOperationDelete({
    description: 'Delete the the project gallery',
    path : '/{id}',
    parameters: {
      path: {
        id: {
          description : 'Id of the project image',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the project image' },
    },
  })
  @httpDelete('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized'
  )
  public deleteProjectGallery(req: Request) {
    return this.projectGalleryService.deleteProjectImage(req.params.id)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the project image',
    path : '/{id}',
    parameters: {
      body: { description: 'The url of the admin profile image', required: true, model: 'ProjectGallery' },
      path: {
        id: {
          description : 'Id of project image',
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
    'isAuthorized',
    'updateProjectGalleryValidator')
  public updateProjectGallery(req: Request) {
    return this.projectGalleryService.updateProjectImage(req.params.id, req.body)
      .then(projectGallery => this.json({ projectGallery }, statuscodes.OK))
  }
}
