import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpPost
} from 'inversify-express-utils'

import { ContractService } from '../services/contract.service'
import { PaymentService } from '../services/payment.service'
import { UserScoreService } from '../services/userScore.service'

@controller('/webhook')
export default class WebhookController extends BaseHttpController {
  constructor(
    @inject('ContractService')
    private contractService: ContractService,
    @inject('PaymentService')
    private paymentService: PaymentService,
    @inject('UserScoreService')
    private userScoreService: UserScoreService
  ) {
    super()
  }

  /**
   * POST webhook/typeform
   *
   * @name getTypeformResponse
   */
  @httpPost('/typeform', 'typeformResponseValidator')
  public getTypeformResponse(req: Request, res: Response) {
    const { rawData, iduser } = res.locals
    return this.userScoreService.saveScoreFromWebhook(iduser, rawData)
      .then(() => this.json({}, statuscodes.OK))
  }

  /**
   * POST webhook/oneflow
   *
   * @name getOneflowResponse
   */
  @httpPost('/oneflow', 'oneflowResponseValidator')
  public getOneflowResponse(req: Request) {
    return this.contractService.updateContract(req.body)
      .then(() => this.json({}, statuscodes.OK))
  }

  /**
   * POST webhook/stripe
   *
   * @name getStripeResponse
   */
  @httpPost('/stripe', 'stripeResponseValidator')
  public getStripeResponse(req: Request) {
    return this.paymentService.updatePaymentOnWebhookEvent(req.body)
      .then(data => this.json(data, statuscodes.OK))
  }
}
