import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  requestParam
} from 'inversify-express-utils'
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { Project } from './../../domain/entity/project'
import { uploadImage } from './../firebase/accomodation'
import { AuthMiddleware } from './../middleware/auth'
import { ProjectService } from './../services/project.service'

import {
  BACKOFFICE, COMMUNITY, TENANT, GUEST,
  FULL, ACCOMMODATION_FULL, ACCOMMODATION_READ
} from '../../infrastructure/constants'

@ApiPath({
  name: 'Project',
  path: '/project',
  security: { basicAuth: [] },
})
@controller('/project')
export default class ProjectController extends BaseHttpController {
  constructor(
    @inject('ProjectService')
    private projectService: ProjectService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new project',
    parameters: {
      body: { description: 'New project', required: true, model: 'Project' },
    },
    responses: {
      200: { model: 'Project' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost(
    '/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createProjectValidator'
  )
  public createProject(req: Request, res: Response) {
    return Project.generateProject({ client_id: res.locals.clientId, ...req.body })
      .then(this.projectService.createProject)
      .then(project => this.json({ project }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the project',
    path : '/{id}',
    parameters: {
      body: { description: 'Project fields to update', model: 'Project' },
      path: {
        id: {
          description : 'Id of project',
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
  @httpPut(
    '/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateProjectValidator'
  )
  public updateProject(req: Request) {
    return this.projectService.updateProject(req.params.id, req.body)
      .then(project => this.json({ project }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/published',
    description: 'Get all published projects',
    parameters: {
      query: {
        offset: {
          description: 'Offset value of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        limit: {
          description: 'Limit value of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Project' },
      400: { description: 'Failed to get the projects' },
    },
  })
  @httpGet('/published',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT, GUEST]),
    'isAuthenticated',
    'isAuthorized',
    'getPublishedProjectsValidator')
  public getAllPublishedProjects(req: Request) {
    return this.projectService.getAllPublishedProjects(req.query.offset, req.query.limit)
      .then(projects => this.json({ projects }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{id}',
    description: 'Get the project by the project facade id',
    parameters: {
      path: {
        id: {
          description: 'Id of project facade',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Project' },
      400: { description: 'Failed to get the project' },
    },
  })
  @httpGet('/:id',
    AuthMiddleware.allowAuthTypes([COMMUNITY, BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL, ACCOMMODATION_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getProjectByFacadeIdValidator')
  public getProjectByFacadeId(@requestParam('id') id: number) {
    return this.projectService.getProjectByFacadeId(id)
      .then(project => this.json({ project }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Upload the project image',
    path : '/{id}/gallery',
    parameters: {
      body: { name: 'img', description: 'Url of the image to upload', required: true },
      path: {
        id: {
          description : 'Id of project',
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
  @httpPut(
    '/:id/gallery',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'uploadProjectImageValidator'
  )
  public uploadProjectImage(req: Request) {
    return uploadImage(req.params.id, req.body.img)
      .then(imageUrlObj => this.json(imageUrlObj, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Publish the project to community',
    path : '/{id}/publish',
    parameters: {
      path: {
        id: {
          description : 'Id of project',
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
  @httpPut(
    '/:id/publish',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'publishedProjectValidator')
  public publishProject(@requestParam('id') id: number) {
    return this.projectService.publishProject(id)
      .then(project => this.json({ project }, statuscodes.OK))
  }

  @ApiOperationDelete({
    path: '/{id}',
    description: 'Delete the project',
    parameters: {
      query: {
        id: {
          description : 'Id of project',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the project' },
    },
  })
  @httpDelete('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'deleteProjectValidator')
  public deleteProject(req: Request) {
    return this.projectService.deleteProject(req.params.id)
      .then(() => this.json({}, statuscodes.OK))
  }
}
