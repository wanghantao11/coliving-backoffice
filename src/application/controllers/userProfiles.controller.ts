import { Request, Response } from 'express'
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
  ApiPath
} from 'swagger-express-ts'

import { COMMUNITY, TENANT } from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { UserProfilesService } from './../services/userProfiles.service'

@ApiPath({
  name: 'UserProfiles',
  path: '/userProfiles',
  security: { basicAuth: [] },
})
@controller('/userProfiles')
export default class UserProfilesController extends BaseHttpController {
  constructor(
    @inject('UserProfilesService')
    private userProfilesService: UserProfilesService
  ) {
    super()
  }

  @ApiOperationGet({
    description: 'Get the user profile',
    responses: {
      200: { model: 'UserProfiles' },
      400: { description: 'Failed to get the user profile' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    'isAuthenticated',
    'isAuthorized')
  public getUserProfile(req: Request, res: Response) {
    return this.userProfilesService.getUserProfile(res.locals.userId)
      .then(userProfile => this.json({ userProfile }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the user profile',
    parameters: {
      body: { description: 'User profile fields to update', required: true, model: 'UserProfiles' },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPut('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'updateUserProfileValidator')
  public updateUserProfile(req: Request, res: Response) {
    return this.userProfilesService.updateUserProfile(res.locals.userId, req.body)
      .then(userProfile => this.json({ userProfile }, statuscodes.OK))
  }

}
