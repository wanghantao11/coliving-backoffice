import { inject } from 'inversify'
import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPut,
  httpPost
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { OfferService } from './../services/offer.service'
import { ApplicationService } from '../services/application.service'
import { AuthMiddleware } from './../middleware/auth'
import {
  COMMUNITY, BACKOFFICE,
  FULL, CONTRACT_FULL, CONTRACT_READ, USER_FULL, USER_READ
} from '../../infrastructure/constants'

@ApiPath({
  name: 'Offer',
  path: '/offer',
  security: { basicAuth: [] },
})
@controller('/offer')
export default class OfferController extends BaseHttpController {
  constructor(
    @inject('OfferService')
    private offerService: OfferService,
    @inject('ApplicationService')
    private applicationService: ApplicationService
  ) {
    super()
  }

  /* ---------------------- Endpoints for community and app ---------------------- */
  @ApiOperationPut({
    path: '/{id}/accept',
    description: 'Member accepts the given offer',
    parameters: {
      path: {
        id: {
          description: 'Id of offer',
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
  @httpPut('/:id/accept',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized',
    'acceptOfferValidator')
  public acceptOffer(req: Request) {
    return this.offerService.acceptOffer(Number(req.params.id))
      .then(offer => this.json({ offer }, statuscodes.OK))
  }

  @ApiOperationPut({
    path: '/{id}/reject',
    description: 'Member rejects the given offer',
    parameters: {
      path: {
        id: {
          description: 'Id of offer',
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
  @httpPut('/:id/reject',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized',
    'rejectOfferValidator')
  public rejectOffer(req: Request) {
    return this.offerService.rejectOffer(Number(req.params.id), req.body.rejection_reason)
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationGet({
    description: 'Get all offers for the member',
    responses: {
      200: {},
      400: { description: 'Failed to get the member offers' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized'
  )
  public getOffersByExternalId(req: Request, res: Response) {
    return this.offerService.getOffersByExternalId(res.locals.userId)
      .then(offers => this.json({ offers }, statuscodes.OK))
  }

  @ApiOperationPost({
    description: 'Member requests for a new offer',
    parameters: {
      body: {
        properties: {
          facade_id: { type: SwaggerDefinitionConstant.Parameter.Type.INTEGER, required: true },
          is_suitable_for_disability: { type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
          has_room_type_preference: { type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
          has_single_room: { type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
          has_double_room: { type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
          has_private_bathroom: { type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
          has_private_toilet: { type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
          rent_to: { type: SwaggerDefinitionConstant.Parameter.Type.INTEGER },
          preferred_roommate_iduser: { type: SwaggerDefinitionConstant.Parameter.Type.STRING },
        },
        required: true,
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to send' },
    },
  })
  @httpPost('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized',
    'requestOfferValidator')
  public requestOffer(req: Request, res: Response) {
    return this.applicationService.applyForProject(res.locals.userId, req.body.facade_id)
      .then(() => this.offerService.requestOffer({ iduser: res.locals.userId, ...req.body }))
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPost({
    path : '/request-manual',
    description: 'Member requests an offer to be manually sent by admin',
    parameters: {
      body: {
        properties: {
          facade_id: { type: SwaggerDefinitionConstant.Parameter.Type.INTEGER, required: true },
          project_name: { type: SwaggerDefinitionConstant.Parameter.Type.STRING },
        },
        required: true,
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to send' },
    },
  })
  @httpPost('/request-manual',
    AuthMiddleware.allowAuthTypes([COMMUNITY]),
    'isAuthenticated',
    'isAuthorized',
    'requestManualValidator')
  public requestManualOffer(req: Request, res: Response) {
    return this.applicationService.applyForProject(res.locals.userId, req.body.facade_id)
      .then(() => this.offerService.requestManualOffer(res.locals.userId, req.body.project_name))
      .then(() => this.json({}, statuscodes.OK))
  }

  /* ---------------------- Endpoints for back office ---------------------- */
  @ApiOperationGet({
    path: '/{iduser}',
    description: 'Get member offers by admin',
    parameters: {
      path: {
        iduser: {
          description : 'Id of member',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get the member offers' },
    },
  })
  @httpGet('/:iduser',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, USER_FULL, USER_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getOffersForAdminValidator')
  public getOffersByUserId(req: Request) {
    const { iduser } = req.params
    return this.offerService.getOffersByExternalId(iduser)
      .then(offers => this.json({ offers }, statuscodes.OK))
  }

  @ApiOperationPost({
    path: '/send',
    description: 'Send offers to selected members',
    parameters: {
      body: {
        properties: {
          facade_id: { type: SwaggerDefinitionConstant.Parameter.Type.INTEGER, required: true },
          room_id: { type: SwaggerDefinitionConstant.Parameter.Type.INTEGER, required: true },
          facade_name: { type: SwaggerDefinitionConstant.Parameter.Type.STRING },
          offer_info_list: { type: SwaggerDefinitionConstant.Parameter.Type.ARRAY, required: true },
          move_in_date: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
        },
        required: true,
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to create' },
    },
  })
  @httpPost('/send',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, USER_FULL, USER_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'sendOffersToSelectedMembersValidator')
  public sendOffersToSelectedMembers(req: Request, res: Response) {
    const { room_id, facade_id, facade_name, offer_info_list, move_in_date } = req.body
    return this.offerService.sendOffersToSelectedMembers(
      room_id, facade_id, facade_name, offer_info_list, move_in_date, res.locals.userId)
      .then(() => this.json({}, statuscodes.OK))
  }
}
