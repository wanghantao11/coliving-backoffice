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

import { BACKOFFICE, FULL, CONTRACT_FULL, CONTRACT_READ, COMMUNITY } from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { ContractService } from './../services/contract.service'

@ApiPath({
  name: 'Contract',
  path: '/contract',
  security: { basicAuth: [] },
})
@controller('/contract')
export default class ContractController extends BaseHttpController {
  constructor(
    @inject('ContractService')
    private contractService: ContractService
  ) {
    super()
  }

  @ApiOperationPost({
    description: 'Create a new contract',
    parameters: {
      body: { description: 'New contract', required: true, model: 'Contract' },
    },
    responses: {
      200: { model: 'Contract' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost(
    '/',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized',
    'createContractValidator')
  public createContract(req: Request, res: Response) {
    const { roomId } = req.body
    const { userId } = res.locals
    return this.contractService.createContract(roomId, userId)
      .then(contracts => this.json({ contracts }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/admin',
    description: 'Get all contracts of the member by admin',
    parameters: {
      query: {
        iduser: {
          description : 'Id of the member',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'Contract' },
      400: { description: 'Failed to get contracts' },
    },
  })
  @httpGet('/admin',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getContractsByIduserValidator')
  public getContractsForAdmin(req: Request) {
    return this.contractService.getContractsByIduser(req.query.iduser)
      .then(contracts => this.json({ contracts }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/',
    description: 'Get all contracts of the member by the member himself',
    responses: {
      200: { model: 'Contract' },
      400: { description: 'Failed to get contracts' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized')
  public getContracts(req: Request, res: Response) {
    const { userId } = res.locals
    return this.contractService.getContractsByIduser(userId)
      .then(contracts => this.json({ contracts }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/pdf/{externalId}',
    description: 'Get pdf file of the contract',
    parameters: {
      path: {
        externalId: {
          description : 'External Id of the contract',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'Contract' },
      400: { description: 'Failed to get pdf of the contract' },
    },
  })
  @httpGet('/pdf/:externalId',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getContractPdfValidator')
  public getContractPdf(req: Request, res: Response) {
    return this.contractService.getContractPdf(req.params.externalId)
      .then(data => {
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=contract.pdf',
        })
        return res.end(data)
      })
  }

  @ApiOperationPut({
    description: 'Update the contract by the admin user',
    path : '/{id}',
    parameters: {
      body: { description: 'Contract fields to update', required: true, model: 'Contract' },
      path: {
        id: {
          description : 'Id of contract',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
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
    AuthMiddleware.needPermisson([FULL, CONTRACT_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateContractByIdValidator')
  public updateContractById(req: Request) {
    return this.contractService.updateContractById(req.params.id, req.body)
      .then(contract => this.json({ contract }, statuscodes.OK))
  }

  @ApiOperationDelete({
    description: 'Delete the contract',
    parameters: {
      query: {
        id: {
          description : 'Id of contract',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to delete the contract' },
    },
  })
  @httpDelete('/',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CONTRACT_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'deleteContractValidator'
  )
  public deleteContract(req: Request) {
    return this.contractService.deleteContract(req.query.id)
      .then(() => this.json({}, statuscodes.OK))
  }
}
