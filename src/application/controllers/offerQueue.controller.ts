import { inject } from 'inversify'
import { Request } from 'express'
import * as statuscodes from 'http-status-codes'
import {
  BaseHttpController,
  controller,
  httpPost
} from 'inversify-express-utils'
import { OfferService } from './../services/offer.service'

@controller('/offer-queue')
export default class OfferQueueController extends BaseHttpController {
  constructor(
    @inject('OfferService')
    private offerService: OfferService
  ) {
    super()
  }

  /**
   *
   * @param req
   * ```
   * req.body.iduser
   * req.body.facade_id
   * req.body.preferences
   * ```
   */
  @httpPost('/search-offer')
  public searchMatchedOffer(req: Request) {
    // TODO add validation for internal use
    return this.offerService.searchMatchedOffer(req.body)
      .then(() => this.json({}, statuscodes.OK))
  }
}
