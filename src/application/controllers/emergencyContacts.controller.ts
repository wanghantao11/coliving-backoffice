import * as statuscodes from 'http-status-codes'
import { Request, Response } from 'express'
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

import { TENANT } from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { EmergencyContactsService } from './../services/emergencyContacts.service'

@ApiPath({
  name: 'EmergencyContacts',
  path: '/emergencyContacts',
  security: { basicAuth: [] },
})
@controller('/emergencyContacts')
export default class EmergencyContactsController extends BaseHttpController {
  constructor(
    @inject('EmergencyContactsService')
    private emergencyContactsService: EmergencyContactsService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new emergency contact',
    parameters: {
      body: { description: 'New emergency contact', required: true, model: 'EmergencyContacts' },
    },
    responses: {
      200: { model: 'EmergencyContacts' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'createEmergencyContactValidator')
  public createEmergencyContact(req: Request, res: Response) {
    return this.emergencyContactsService.createContact(res.locals.userId, req.body)
      .then(contact => this.json({ contact }, statuscodes.OK))
  }

  @ApiOperationGet({
    description: 'Get all emergency contacts for the tenant',
    responses: {
      200: { model: 'EmergencyContacts' },
      400: { description: 'Failed to get the emergency contacts' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized')
  public getEmergencyContacts(req: Request, res: Response) {
    return this.emergencyContactsService.getContacts(res.locals.userId)
      .then(contacts => this.json({ contacts }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the emergency contract for the tenant',
    parameters: {
      body: { description: 'Emergency contact fields to update', model: 'EmergencyContacts' },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPut('/',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'updateEmergencyContactValidator')
  public updateEmergencyContact(req: Request) {
    return this.emergencyContactsService.updateContact(req.query.id, req.body)
      .then(contact => this.json({ contact }, statuscodes.OK))
  }

  @ApiOperationDelete({
    description: 'Delete the emergency contact',
    parameters: {
      query: {
        id: {
          description : 'Id of emergency contact',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the emergency contact' },
    },
  })
  @httpDelete('/',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized')
  public deleteEmergencyContact(req: Request) {
    return this.emergencyContactsService.deleteContact(req.query.id)
      .then(() => this.json({}, statuscodes.OK))
  }
}
