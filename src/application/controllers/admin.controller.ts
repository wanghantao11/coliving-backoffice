import { inject } from 'inversify'
import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import {
  BaseHttpController,
  controller,
  httpPost,
  httpGet,
  httpDelete,
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

import { Admin } from './../../domain/entity/admin'
import {
  BACKOFFICE,
  FULL, ADMIN_FULL, ADMIN_READ
} from './../../infrastructure/constants'
import { uploadImage } from './../firebase/admin'
import { AuthMiddleware } from './../middleware/auth'
import { AdminService } from './../services/admin.service'

@ApiPath({
  name: 'Admin',
  path: '/admin',
  security: { basicAuth: [] },
})
@controller('/admin')
export default class AdminController extends BaseHttpController {
  constructor(
    @inject('AdminService')
    private adminService: AdminService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new admin user',
    parameters: {
      body: { description: 'New admin user', required: true, model: 'Admin' },
    },
    responses: {
      200: { model: 'Admin' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ADMIN_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createAdminValidator')
  public createAdmin(req: Request, res: Response) {
    return Admin.generateAdmin({
      ...req.body,
      client_id: res.locals.clientId,
    })
      .then(this.adminService.createAdmin)
      .then(admin =>
        this.adminService
          .sendVerificationEmail(admin.email)
          .then(code => this.adminService.setCodeByEmail(admin.email, code))
          .then(() => this.json({ admin }, statuscodes.OK))
      )
  }

  @ApiOperationGet({
    description: 'Get the admin user',
    responses: {
      200: { model: 'Admin' },
      400: { description: 'Failed to get the admin user' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ADMIN_FULL, ADMIN_READ]),
    'isAuthenticated',
    'isAuthorized')
  public getAdmin(req: Request, res: Response) {
    return this.adminService.getAdminById(res.locals.userId)
      .then(admin => this.json({ admin }, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/forgot-password',
    description: 'Send the reset-password email for the admin user',
    parameters: {
      body: { name: 'email', description: 'The email of the admin user', required: true },
    },
    responses: {
      200: {},
      400: { description: 'Failed to send the email' },
    },
  })
  @httpPost('/forgot-password',
    'forgotPasswordValidator')
  public sendResetpasswordEmail(req: Request) {
    return this.adminService.sendForgotPasswordEmail(req.body.email)
      .then(code => this.adminService.setCodeByEmail(req.body.email, code))
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/login',
    description: 'Login to backoffice for the admin user',
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
      200: { model: 'Admin' },
      400: { description: 'Failed to login' },
    },
  })
  @httpPost('/login',
    'loginAdminValidator')
  public login(req: Request) {
    const { email, password } = req.body
    return this.adminService.login(email, password)
      .then(token => this.json({ token }, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/setPassword',
    description: 'Set the new password for the admin user',
    parameters: {
      body: {
        properties: {
          id: { type: SwaggerDefinitionConstant.Parameter.Type.INTEGER, required: true },
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
  @httpPost('/setPassword',
    'setAdminPasswordValidator')
  public setPasswordById(req: Request) {
    return this.adminService
      .setPasswordById(req.body.id, req.body.password)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/verify',
    description: 'Verify the one-time code for resetting admin password',
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
  @httpPost('/verify',
    'verifyCodeValidator')
  public verifyCode(req: Request) {
    return this.adminService
      .verify(req.body.verificationCode)
      .then(id => this.json({ id }, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/verify/resend',
    description: 'Resend the verification email',
    parameters: {
      body: { name: 'email', description: 'The email of the admin user', required: true },
    },
    responses: {
      200: { model: 'Admin' },
      400: { description: 'Failed to create' },
    },
  })
  @httpPost('/verify/resend',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ADMIN_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'resendEmailValidator'
  )
  public resendVerificationEmail(req: Request) {
    return this.adminService.sendVerificationEmail(req.body.email)
      .then(code => this.adminService.setCodeByEmail(req.body.email, code))
  }

  @ApiOperationPut({
    description: 'Update the admin user',
    path : '/{id}',
    parameters: {
      body: { description: 'Admin fields to update', model: 'Admin' },
      path: {
        id: {
          description : 'Id of admin user',
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
  @httpPut('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ADMIN_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateAdminValidator')
  public updateAdminById(req: Request) {
    return this.adminService.updateAdminById(req.params.id, req.body)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the admin user profile image',
    path : '/{id}/profile/image',
    parameters: {
      body: { name: 'img', description: 'The url of the admin profile image', required: true },
      path: {
        id: {
          description : 'Id of admin user',
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
    '/:id/profile/image',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    'isAuthenticated',
    'updateAdminImageValidator'
  )
  public uploadAdminProfileImage(req: Request) {
    return uploadImage(req.body.img, req.params.id)
      .then(res => this.json(res, statuscodes.OK))
  }

  @ApiOperationDelete({
    description: 'Delete the admin user',
    path : '/{id}',
    parameters: {
      path: {
        id: {
          description : 'Id of admin user',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the admin user' },
    },
  })
  @httpDelete('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ADMIN_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'deleteAdminValidator'
  )
  public deleteAdmin(req: Request) {
    return this.adminService.deleteAdmin(req.params.id)
      .then(() => this.json({}, statuscodes.OK))
  }
}
