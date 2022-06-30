import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  httpPut,
  httpDelete
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiOperationPut,
  ApiPath
} from 'swagger-express-ts'

import { COMMUNITY, TENANT } from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { UserPreferencesService } from './../services/userPreferences.service'

@ApiPath({
  name: 'UserPreferences',
  path: '/userPreferences',
  security: { basicAuth: [] },
})
@controller('/userPreferences')
export default class UserPreferencesController extends BaseHttpController {
  constructor(
    @inject('UserPreferencesService')
    private userPreferencesService: UserPreferencesService
  ) {
    super()
  }

  @ApiOperationGet({
    description: 'Get the user preferences',
    responses: {
      200: { model: 'UserPreferences' },
      400: { description: 'Failed to get the user preferences' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    'isAuthenticated',
    'isAuthorized')
  public getUserPreferences(req: Request, res: Response) {
    return this.userPreferencesService.getUserPreferences(res.locals.userId)
      .then(userPreferences => this.json({ userPreferences }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the user preferences',
    parameters: {
      body: { description: 'User preferences fields to update', required: true, model: 'UserPreferences' },
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
    'updateUserPreferencesValidator')
  public updateUserPreferences(req: Request, res: Response) {
    return this.userPreferencesService.updateUserPreferences(res.locals.userId, req.body)
      .then(userPreferences => this.json({ userPreferences }, statuscodes.OK))
  }

  /**
   * POST /userPreferences/preferred-roommate/send
   *
   * @name sendInvitation
   * @param req
   * ```
   * req.body.email
   * req.body.img_url
   * req.body.first_name
   * ```
   * @param res res.locals.userId
   */
  @httpPost('/preferred-roommate/send',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized',
    'sendInvitationValidator'
  )
  public sendInvitation(req: Request, res: Response) {
    const { img_url, first_name, email } = req.body
    return this.userPreferencesService.sendInvitation({ img_url, first_name, iduser: res.locals.userId }, email)
      .then(invitation => this.json({ invitation }, statuscodes.OK))
  }

  /**
   * POST /userPreferences/preferred-roommate/reply
   *
   * @name replyInvitation
   * @param req
   * ```
   * req.body.inviter_id
   * req.body.invitee_id
   * req.body.status
   * req.body.invitation_code
   * ```
   */
  @httpPost('/preferred-roommate/reply', 'replyInvitationValidator')
  public replyInvitation(req: Request) {
    return this.userPreferencesService.replyInvitation(req.body)
      .then(() => this.json({}, statuscodes.OK))
  }

  /**
   * DELETE /userPreferences/preferred-roommate/:id
   *
   * @param req req.params.id
   */
  @httpDelete('/preferred-roommate/:id',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized',
    'deletePreferredRoommateValidator'
  )
  public deletePreferredRoommate(req: Request) {
    return this.userPreferencesService.deletePreferredRoommate(Number(req.params.id))
      .then(() => this.json({}, statuscodes.OK))
  }

  /**
   * GET /userPreferences/preferred-roommate/
   *
   * @param res res.locals.userId
   */
  @httpGet('/preferred-roommate/',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized'
  )
  public getPreferredRoommate(req: Request, res: Response) {
    return this.userPreferencesService.getPreferredRoommate(res.locals.userId)
      .then(preferredRoommate => this.json({ preferredRoommate }, statuscodes.OK))
  }

  /**
   * POST /userPreferences/preferred-roommate/connect
   * Connect to another (shadow) user as roommate in double-room flow
   *
   * @param req req.body
   * @param res res.locals.userId
   */
  @httpPost('/preferred-roommate/connect',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized',
    'connectPreferredRoommateValidator')
  public connectPreferredRoommate(req: Request, res: Response) {
    return this.userPreferencesService.connectPreferredRoommate(res.locals.userId, req.body)
      .then(() => this.json({}, statuscodes.OK))
  }
}
