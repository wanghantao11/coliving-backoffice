import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpGet,
  queryParam
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { AuthMiddleware } from './../middleware/auth'
import { ProjectService } from './../services/project.service'

import {
  BACKOFFICE, COMMUNITY,
  FULL, ACCOMMODATION_FULL, ACCOMMODATION_READ
} from '../../infrastructure/constants'

@ApiPath({
  name: 'Projects',
  path: '/projects',
  security: { basicAuth: [] },
})
@controller('/projects')
export default class ProjectsController extends BaseHttpController {
  constructor(
    @inject('ProjectService')
    private projectService: ProjectService
  ) {
    super()
  }

  @ApiOperationGet({
    description: 'Get projects based on given query filters',
    parameters: {
      query: {
        ids: {
          description: 'Project facade ids',
          type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
        },
      },
    },
    responses: {
      200: { model: 'Project' },
      400: { description: 'Failed to get the projects' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE, COMMUNITY]),
    AuthMiddleware.needPermisson([FULL, ACCOMMODATION_FULL, ACCOMMODATION_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getProjectsValidator')
  public getProjectsByFacadeIds(@queryParam('ids') ids: number[]) {
    return this.projectService.getProjectsByFacadeIds(ids)
      .then(projects => this.json({ projects }, statuscodes.OK))
  }
}
