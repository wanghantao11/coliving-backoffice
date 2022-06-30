import { inject } from 'inversify'
import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import {
  BaseHttpController,
  controller,
  httpPost
} from 'inversify-express-utils'
import {
  ApiOperationPost,
  ApiPath
} from 'swagger-express-ts'

import { addMemberToApartmentChannel, addMemberToProjectChannel } from './../getstream/chat'
import { TENANT } from '../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { ProjectService } from './../services/project.service'
import { TenantService } from './../services/tenant.service'

@ApiPath({
  name: 'StreamChat',
  path: '/stream-chat',
  security: { basicAuth: [] },
})
@controller('/stream-chat')
export default class GetstreamChatController extends BaseHttpController {
  constructor(
    @inject('ProjectService')
    private projectService: ProjectService,
    @inject('TenantService')
    private tenantService: TenantService
  ) {
    super()
  }

  @ApiOperationPost({
    path: '/apartment-channel/add-member',
    description: 'Add the tenant to the apartment chat channel',
    parameters: {},
    responses: {
      200: {},
      400: { description: 'Failed to add' },
    },
  })
  @httpPost('/apartment-channel/add-member',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized'
  )
  public addMemberToApartmentChannel(req: Request, res: Response) {
    return addMemberToApartmentChannel(res.locals.userId, Number(res.locals.apartmentId))
      .then(data => this.json(data, statuscodes.OK))
  }

  @ApiOperationPost({
    path: '/project-channel/add-member',
    description: 'Add the tenant to the project chat channel',
    parameters: {},
    responses: {
      200: {},
      400: { description: 'Failed to add' },
    },
  })
  @httpPost('/project-channel/add-member',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized'
  )
  public addMemberToProjectChannel(req: Request, res: Response) {
    const facadeId = Number(res.locals.projectId)
    return this.tenantService.getHostsByFacadeId(facadeId)
      .then(hosts => hosts.length > 0 ? this.projectService.getProjectByFacadeId(facadeId)
        .then(project => addMemberToProjectChannel(
          res.locals.userId, facadeId, project.name, project.cover_image_source, hosts[0]))
        : Promise.reject({ message: 'NOT_FOUND', reason: `No host is found for project facade ${facadeId}` }))
      .then(data => this.json(data, statuscodes.OK))
  }
}
