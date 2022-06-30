import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { PaymentService } from '../../application/services/payment.service'
import { AuthMiddleware } from '../../application/middleware/auth'
import {
  BACKOFFICE, TENANT,
  FULL, CONTRACT_FULL, CONTRACT_READ
} from '../../infrastructure/constants'

@ApiPath({
  name: 'Payment',
  path: '/payment',
  security: { basicAuth: [] },
})
@controller('/payment')
export default class PaymentController extends BaseHttpController {
  constructor(
    @inject('PaymentService')
    private paymentService: PaymentService
  ) {
    super()
  }

  /**
   * POST /payment/:id/charge
   *
   * @param req
   * ```
   * req.body.source(optional)
   * req.body.has_saved_card(optional)
   * req.body.idempotency_key
   * ```
   * @param res
   * ```
   * req.params.id
   * res.locals.userId
   * res.locals.projectId
   * ```
   */
  @ApiOperationPost({
    path: '/{id}/charge',
    description: 'Submit the payment to charge the given card',
    parameters: {
      path: {
        id: {
          description: 'Id of the payment',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
      body: {
        properties: {
          idempotency_key: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
          source: { type: SwaggerDefinitionConstant.Parameter.Type.STRING },
          has_saved_card: { type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
        },
        required: true,
      },
    },
    responses: {
      200: { model: 'Payment' },
      400: { description: 'Failed to submit the payment' },
    },
  })
  @httpPost('/:id/charge',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'createChargeValidator')
  public submitPayment(req: Request, res: Response) {
    const { userId, projectId } = res.locals
    const { has_saved_card, idempotency_key, source } = req.body

    return this.paymentService.submitPayment(
      Number(req.params.id), userId, Number(projectId), idempotency_key, source, has_saved_card)
      .then(payment => this.json({ payment }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/admin',
    description: 'Get all payments by admin based on the query filters',
    parameters: {
      query: {
        facade_id: {
          description : 'Project facade id payments belong to',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        id: {
          description : 'Payment id',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        iduser: {
          description : 'Id of the member',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        email: {
          description : 'Member email address',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        name: {
          description : 'Member name',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        created_from: {
          description : 'Earliest payment creation date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        created_to: {
          description : 'Latest payment creation date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        is_overdue: {
          description : 'If the payment is overdue',
          type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
        },
        status: {
          description : 'Payment status',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        offset: {
          description : 'Offset value of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        limit: {
          description : 'Limit value of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        sort_order: {
          description : 'Sort order of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        sort_by: {
          description : 'Sort by field of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'Payment' },
      400: { description: 'Failed to get the payments' },
    },
  })
  @httpGet('/admin',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getPaymentsForAdminValidator')
  public getPaymentsForAdmin(req: Request) {
    return this.paymentService.getPaymentsForAdmin(req.query)
      .then(([total, payments]) => this.json({ total, payments }, statuscodes.OK))
  }

  @ApiOperationGet({
    description: 'Get all payments of the tenant',
    responses: {
      200: { model: 'Payment' },
      400: { description: 'Failed to get the payments' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized')
  public getPayments(req: Request, res: Response) {
    return this.paymentService.getPayments(res.locals.userId)
      .then(payments => this.json({ payments }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/{id}',
    description: 'Get the given payment',
    parameters: {
      path: {
        id: {
          description: 'Id of the payment',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'Payment' },
      400: { description: 'Failed to get the payment' },
    },
  })
  @httpGet('/:id',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'getPaymentForTenantValidator')
  public getPayment(req: Request) {
    return this.paymentService.getPayment(Number(req.params.id))
      .then(payment => this.json({ payment }, statuscodes.OK))
  }
}
