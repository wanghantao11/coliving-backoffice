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

import { AddressService } from './../services/address.service'
import { Address } from './../../domain/entity'
import { AuthMiddleware } from './../middleware/auth'

import {
  BACKOFFICE,
  FULL, ROOM_FULL
} from '../../infrastructure/constants'

@ApiPath({
  name: 'Address',
  path: '/address',
  security: { basicAuth: [] },
})
@controller('/address')
export default class AddressController extends BaseHttpController {
  constructor(
    @inject('AddressService')
    private addressService: AddressService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new address',
    parameters: {
      body: { description: 'New address', required: true, model: 'Address' },
    },
    responses: {
      200: { model: 'Address' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createAddressValidator'
  )
  public createAddress(req: Request) {
    return Promise.resolve(Address.generateAddress(req.body))
      .then(this.addressService.createAddress)
      .then(address => this.json({ address }, statuscodes.OK))
  }

  @ApiOperationDelete({
    description: 'Delete the given address',
    path : '/{id}',
    parameters: {
      path: {
        id: {
          description : 'Id of address',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'Address' },
      400: {},
    },
  })
  @httpDelete('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'deleteAddressValidator'
  )
  public deleteAddress(req: Request) {
    return this.addressService.deleteAddress(req.params.id)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the given address',
    path : '/{id}',
    parameters: {
      path: {
        id: {
          description : 'Id of address',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
      body: { description: 'Address fields to update', model: 'Address' },
    },
    responses: {
      200: { model: 'Address' },
      400: {},
    },
  })
  @httpPut('/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, ROOM_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateAddressValidator')
  public updateAddress(req: Request) {
    return this.addressService.updateAddress(req.params.id, req.body)
      .then(address => this.json({ address }, statuscodes.OK))
  }
}
