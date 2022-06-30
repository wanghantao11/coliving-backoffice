import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
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

import {
  BACKOFFICE, COMMUNITY, TENANT, GUEST,
  FULL, USER_FULL, USER_READ
} from './../../infrastructure/constants'

import { hashPassword, formatEmail } from './../../infrastructure/utils/common'
import { uploadImage } from './../firebase/user'
import { AuthMiddleware } from './../middleware/auth'
import { UserService } from './../services/user.service'
import { signInGuest } from '../../application/auth/jwt/service'

@ApiPath({
  name: 'User',
  path: '/user',
  security: { basicAuth: [] },
})
@controller('/user')
export default class UserController extends BaseHttpController {
  constructor(
    @inject('UserService')
    private userService: UserService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new user and his profile and preferences',
    parameters: {
      body: { description: 'New user', required: true, model: 'User' },
    },
    responses: {
      200: {},
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/',
    AuthMiddleware.generateId,
    'createUserValidator')
  public createUser(req: Request) {
    return Promise.resolve(req.body)
      .then(({ password, email, ...rest }) => hashPassword(password)
        .then(hashedPassword => ({ password: hashedPassword, email: formatEmail(email), ...rest })))
      .then(this.userService.createUser)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the user',
    parameters: {
      body: { description: 'User fields to update', required: true, model: 'User' },
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
    'updateUserValidator')
  public updateUser(req: Request, res: Response) {
    return this.userService.updateUserByExternalId(res.locals.userId, req.body)
      .then(user => this.json({ user }, statuscodes.OK))
  }

  @ApiOperationDelete({
    description: 'Delete the user',
    parameters: {},
    responses: {
      200: {},
      400: { description: 'Failed to delete the user' },
    },
  })
  @httpDelete('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    'isAuthenticated',
    'isAuthorized'
  )
  public deleteUser(req: Request, res: Response) {
    return this.userService
      .deleteUserByExternalId(res.locals.userId)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationGet({
    description: 'Get the user',
    responses: {
      200: { model: 'User' },
      400: { description: 'Failed to get the user' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    'isAuthenticated',
    'isAuthorized'
  )
  public findUser(req: Request, res: Response) {
    return this.userService
      .findMeByExternalId(res.locals.userId)
      .then(res => this.json(res, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/login',
    description: 'Login to community site for the user',
    parameters: {
      body: {
        properties: {
          email: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
          password: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
        },
        required: true,
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to login' },
    },
  })
  @httpPost('/login',
    'loginUserValidator')
  public userLogin(req: Request) {
    return this.userService.login(req.body.email, req.body.password)
      .then(token => this.json({ token }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/guest-token',
    description: 'Get the guest token',
    responses: {
      200: {},
      400: { description: 'Failed to get the guest token' },
    },
  })
  @httpGet('/guest-token')
  public getGuestToken() {
    return signInGuest(GUEST)
      .then(token => this.json({ token }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/count',
    description: 'Count the user',
    responses: {
      200: {},
      400: { description: 'Failed to get the user count' },
    },
  })
  @httpGet(
    '/count',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT, BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, USER_FULL, USER_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getOtherUserCountValidator'
  )
  public getUserCount(req: Request, res: Response) {
    return this.userService
      .getUserCount(res.locals.userId, req.query)
      .then(res => this.json(res, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/others',
    description: 'Get other users',
    responses: {
      200: {},
      400: { description: 'Failed to get the other users' },
    },
  })
  @httpGet(
    '/others',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'getOtherUsersValidator'
  )
  public getOtherUsers(req: Request, res: Response) {
    return this.userService
      .getOtherUsers(res.locals.userId, req.query)
      .then(res => this.json(res, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{iduser}',
    description: 'Get other users for the given user',
    parameters: {
      path: {
        iduser: {
          description: 'Id of the user',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get the other users' },
    },
  })
  @httpGet('/:iduser',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'findOtherUserValidator'
  )
  public findOtherUser(req: Request) {
    return this.userService
      .findUserByExternalId(req.params.iduser)
      .then(user => this.json({ user }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Upload the user profile image',
    path : '/profile/image',
    parameters: {
      body: { name: 'img', description: 'The url of the user profile image', required: true },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPut(
    '/profile/image',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'uploadUserProfileImageValidator')
  public uploadUserProfileImage(req: Request, res: Response) {
    return uploadImage(req.body.img, res.locals.userId)
      .then(res => this.json(res, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/forgot-password',
    description: 'Send the reset-password email for the user',
    parameters: {
      body: { name: 'email', description: 'The email of the user', required: true },
    },
    responses: {
      200: {},
      400: { description: 'Failed to send the email' },
    },
  })
  @httpPost('/forgot-password',
    'forgotPasswordValidator')
  public sendResetpasswordEmail(req: Request) {
    return this.userService.sendVerificationEmail(req.body.email)
      .then(code => this.userService.setCodeByEmail(req.body.email, code))
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/verify',
    description: 'Verify the one-time code for resetting user password',
    parameters: {
      body: {
        properties: {
          verificationCode: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
        },
        required: true,
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to verify the one-time code' },
    },
  })
  @httpPost('/verify')
  public verifyCode(req: Request) {
    return this.userService.verify(req.body.verificationCode)
      .then(id => this.json({ id }, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/set-password',
    description: 'Set the new password for the user',
    parameters: {
      body: {
        properties: {
          iduser: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
          password: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
        },
        required: true,
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to set the new password' },
    },
  })
  @httpPost('/set-password',
    'setPasswordValidator')
  public setPasswordById(req: Request) {
    return this.userService
      .setPasswordById(req.body.iduser, req.body.password)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/roomie-test-started',
    description: 'Set the roomie test started tag on mailchimp',
    parameters: {},
    responses: {
      200: {},
      400: { description: 'Failed to set the mailchimp tag' },
    },
  })
  @httpPost('/roomie-test-started',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized')
  public setRoomieTestStartedTagOnMailchimp(req: Request, res: Response) {
    return this.userService.setRoomieTestStartedTagOnMailchimp(res.locals.userId)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/pin-code/send',
    description: 'Send the pin code for new user registration',
    parameters: {
      body: {
        name: 'email',
        description: 'Email address of the user',
        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to send the pin code' },
    },
  })
  @httpPost('/pin-code/send',
    AuthMiddleware.isVerifiedCaptcha,
    'sendPinCodeValidator')
  public sendPinCode(req: Request) {
    const { email } = req.body
    return this.userService.sendPincode(email)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/pin-code/verify',
    description: 'Verify the pin code for the new user',
    parameters: {
      body: {
        properties: {
          email: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
          code: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
        },
        required: true,
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to verify the pin code' },
    },
  })
  @httpPost('/pin-code/verify',
    'verifyPinCodeValidator')
  public verifyPinCode(req: Request) {
    const { email, code } = req.body
    return this.userService.verifyPincode(email, code)
      .then(() => this.json({}, statuscodes.OK))
  }
}
