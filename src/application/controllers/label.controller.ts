import { inject } from 'inversify'
import { Request } from 'express'
import * as statuscodes from 'http-status-codes'
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpPost,
  httpPut
} from 'inversify-express-utils'
import {
  ApiOperationDelete,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { LabelService } from './../services/label.service'
import { Label } from './../../domain/entity'
import { AuthMiddleware } from './../middleware/auth'
import {
  BACKOFFICE,
  FULL, ROOM_FULL
} from '../../infrastructure/constants'

@ApiPath({
  name: 'Label',
  path: '/label',
  security: { basicAuth: [] },
})
@controller('/label')
export default class LabelController extends BaseHttpController {
  constructor(
    @inject('LabelService')
    private labelService: LabelService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new label',
    parameters: {
      body: { description: 'New label', required: true, model: 'Label' },
    },
    responses: {
      200: { model: 'Label' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createLabelValidator'
  )
  public createLabel(req: Request) {
    return Promise.resolve(Label.generateLabel(req.body))
      .then(this.labelService.createLabel)
      .then(label => this.json({ label }, statuscodes.OK))
  }

  @ApiOperationDelete({
    path: '/{id}',
    description: 'Delete the label',
    parameters: {
      path: {
        id: {
          description : 'Id of label',
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
  @httpDelete('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized'
  )
  public deleteLabel(req: Request) {
    return this.labelService.deleteLabel(req.params.id)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPut({
    path: '/{id}',
    description: 'Update the emergency contract for the tenant',
    parameters: {
      path: {
        id: {
          description: 'Id of label',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
      body: { description: 'Label fields to update', model: 'Label' },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPut('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateLabelValidator')
  public updateLabel(req: Request) {
    return this.labelService.updateLabel(req.params.id, req.body)
      .then(label => this.json({ label }, statuscodes.OK))
  }
}
