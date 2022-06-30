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

import { MemberTagsService } from './../services/memberTags.service'
import { MemberTags } from './../../domain/entity'
import { AuthMiddleware } from './../middleware/auth'
import {
  BACKOFFICE,
  FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ
} from '../../infrastructure/constants'

@ApiPath({
  name: 'MemberTags',
  path: '/member-tags',
  security: { basicAuth: [] },
})
@controller('/member-tags')
export default class MemberTagsController extends BaseHttpController {
  constructor(
    @inject('MemberTagsService')
    private memberTagsService: MemberTagsService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new member tag',
    parameters: {
      body: { description: 'New member tag', required: true, model: 'MemberTags' },
    },
    responses: {
      200: { model: 'MemberTags' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, APPLICATION_FULL, CONTRACT_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createMemberTagValidator'
  )
  public createMemberTag(req: Request, res: Response) {
    return Promise.resolve(MemberTags.generateMemberTags({ client_id: res.locals.clientId, ...req.body }))
      .then(this.memberTagsService.createMemberTag)
      .then(tag => this.json({ tag }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/all',
    description: 'Get all member tags for the client',
    responses: {
      200: { model: 'MemberTags' },
      400: { description: 'Failed to get member tags' },
    },
  })
  @httpGet('/all',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized'
  )
  public getMemberTagsByClientId(req: Request, res: Response) {
    return this.memberTagsService.getMemberTagsByClientId(res.locals.clientId)
      .then(tags => this.json({ tags }, statuscodes.OK))
  }

  @ApiOperationDelete({
    path: '/{id}',
    description: 'Delete the member tag',
    parameters: {
      path: {
        id: {
          description : 'Id of member tag',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the member tag' },
    },
  })
  @httpDelete('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, APPLICATION_FULL, CONTRACT_FULL]),
    'isAuthenticated',
    'isAuthorized'
  )
  public deleteLabel(req: Request) {
    return this.memberTagsService.deleteMemberTag(req.params.id)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPut({
    path: '/{id}',
    description: 'Update the member tag',
    parameters: {
      path: {
        id: {
          description: 'Id of member tag',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
      body: { description: 'Member tag fields to update', model: 'MemberTags' },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPut('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, APPLICATION_FULL, CONTRACT_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateMemberTagValidator')
  public updateMemberTag(req: Request) {
    return this.memberTagsService.updateMemberTag(req.params.id, req.body)
      .then(tag => this.json({ tag }, statuscodes.OK))
  }
}
