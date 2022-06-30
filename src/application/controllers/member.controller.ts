import { Request } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  httpPut
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import {
  BACKOFFICE,
  FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ
} from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { MemberService } from './../services/member.service'

@ApiPath({
  name: 'Member',
  path: '/member',
  security: { basicAuth: [] },
})
@controller('/member')
export default class MemberController extends BaseHttpController {
  constructor(
    @inject('MemberService')
    private readonly memberService: MemberService
  ) {
    super()
  }

  @ApiOperationGet({
    path: '/{iduser}',
    description: 'Get the given member',
    parameters: {
      path: {
        iduser: {
          description : 'Id of member',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'User' },
      400: { description: 'Failed to get the member' },
    },
  })
  @httpGet('/:iduser',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getMemberValidator')
  public getMember(req: Request) {
    return this.memberService.getMember(req.params.iduser)
      .then(member => this.json({ member }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{iduser}/notes',
    description: 'Get the given member notes',
    parameters: {
      path: {
        iduser: {
          description : 'Id of member',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'AdminMemberNotes' },
      400: { description: 'Failed to get the member notes' },
    },
  })
  @httpGet('/:iduser/notes',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getMemberNotesValidator')
  public getMemberNotes(req: Request) {
    return this.memberService.getMemberNotes(req.params.iduser)
      .then(notes => this.json({ notes }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{iduser}/preferences',
    description: 'Get the given member preferences',
    parameters: {
      path: {
        iduser: {
          description : 'Id of member',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'UserPreferences' },
      400: { description: 'Failed to get the member preferences' },
    },
  })
  @httpGet('/:iduser/preferences',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getMemberPreferencesValidator')
  public getMemberPreferences(req: Request) {
    return this.memberService.getMemberPreferences(req.params.iduser)
      .then(preferences => this.json({ preferences }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{iduser}/profile',
    description: 'Get the given member profile',
    parameters: {
      path: {
        iduser: {
          description : 'Id of member',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'UserProfiles' },
      400: { description: 'Failed to get the member profiles' },
    },
  })
  @httpGet('/:iduser/profile',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getMemberProfileValidator')
  public getMemberProfile(req: Request) {
    return this.memberService.getMemberProfile(req.params.iduser)
      .then(profile => this.json({ profile }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{iduser}/subscriptions',
    description: 'Get the given member subscriptions',
    parameters: {
      path: {
        iduser: {
          description : 'Id of member',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'Application' },
      400: { description: 'Failed to get the member subscriptions' },
    },
  })
  @httpGet('/:iduser/subscriptions',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getMemberSubscriptionsValidator')
  public getMemberSubscriptions(req: Request) {
    return this.memberService.getMemberSubscriptions(req.params.iduser)
      .then(subscriptions => this.json({ subscriptions }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{iduser}/wished-roomies',
    description: 'Get the given member wished roomies',
    parameters: {
      path: {
        iduser: {
          description : 'Id of member',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get the member wished roomies' },
    },
  })
  @httpGet('/:iduser/wished-roomies',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getMemberWishedRoomiesValidator')
  public getMemberWishedRoomies(req: Request) {
    return this.memberService.getMemberWishedRoomies(req.params.iduser)
      .then(roomies => this.json({ roomies }, statuscodes.OK))
  }

  @ApiOperationPost({
    path: '/notes',
    description: 'Create a member note',
    parameters: {
      body: { description: 'New member note', required: true, model: 'AdminMemberNotes' },
    },
    responses: {
      200: { model: 'AdminMemberNotes' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/notes',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'createMemberNotesValidator')
  public createMemberNotes(req: Request) {
    return this.memberService.createMemberNotes(req.body)
      .then(notes => this.json({ notes }, statuscodes.OK))
  }

  @ApiOperationPut({
    path: '/{iduser}/notes',
    description: 'Update the member note',
    parameters: {
      path: {
        id: {
          description: 'Id of member',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
      body: { description: 'Member note fields to update', model: 'AdminMemberNotes' },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPut('/:iduser/notes',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'updateMemberNotesValidator')
  public updateMemberNotes(req: Request) {
    return this.memberService.updateMemberNotes(req.params.iduser, req.body)
      .then(notes => this.json({ notes }, statuscodes.OK))
  }

  @ApiOperationPost({
    path: '/{iduser}/approve',
    description: 'Approve the member',
    parameters: {
      path: {
        id: {
          description: 'Id of member',
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
  @httpPost('/:iduser/approve',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized')
  public approveMemberToTenant(req: Request) {
    return this.memberService.approveMemberToTenant(req.params.iduser)
      .then(member => this.json({ member }, statuscodes.OK))
  }
}
