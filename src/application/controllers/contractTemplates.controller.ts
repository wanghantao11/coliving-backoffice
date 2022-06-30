import { Request } from 'express'
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
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { BACKOFFICE, FULL, CONTRACT_FULL, CONTRACT_READ } from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { ContractTemplatesService } from '../services/contractTemplates.service'

@ApiPath({
  name: 'ContractTemplates',
  path: '/contract-templates',
  security: { basicAuth: [] },
})
@controller('/contract-templates')
export default class ContractTemplatesController extends BaseHttpController {
  constructor(
    @inject('ContractTemplatesService')
    private contractTemplatesService: ContractTemplatesService
  ) {
    super()
  }

  @ApiOperationGet({
    path: '/collections',
    description: 'Get all contract templates collections',
    responses: {
      200: { model: 'ContractTemplates' },
      400: { description: 'Failed to get contract templates' },
    },
  })
  @httpGet('/collections',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized')
  public getCollections() {
    return this.contractTemplatesService.getCollections()
      .then(collections => this.json({ collections }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/collection/{collectionId}',
    description: 'Get the contract template by the collection id',
    parameters: {
      path: {
        collectionId: {
          description : 'Contract collection id',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'ContractTemplates' },
      400: { description: 'Failed to get the contract template' },
    },
  })
  @httpGet('/collection/:collectionId',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getContractTemplateByCollectionIdValidator')
  public getContractTemplateByCollectionId(req: Request) {
    return this.contractTemplatesService.getContractTemplateByCollectionId(Number(req.params.collectionId))
      .then(template => this.json({ template }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/template/{facadeId}',
    description: 'Get the contract template by the project facade id',
    parameters: {
      path: {
        facadeId: {
          description : 'Project facade id',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'ContractTemplates' },
      400: { description: 'Failed to get the contract template' },
    },
  })
  @httpGet('/template/:facadeId',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getContractTemplateByFacadeIdValidator')
  public getContractTemplateByFacadeId(req: Request) {
    return this.contractTemplatesService.getContractTemplateByFacadeId(Number(req.params.facadeId))
      .then(template => this.json({ template }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the contract template by the given project facade id',
    path : '/template/{facadeId}',
    parameters: {
      body: { description: 'Contract template fields to update', model: 'ContractTemplates' },
      path: {
        facadeId: {
          description : 'Id of project facade',
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
  @httpPut('/template/:facadeId',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CONTRACT_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateContractTemplateByFacadeIdValidator')
  public updateContractTemplateByFacadeId(req: Request) {
    return this.contractTemplatesService.updateContractTemplateByFacadeId(Number(req.params.facadeId), req.body)
      .then(template => this.json({ template }, statuscodes.OK))
  }
}
