import { Request } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpGet
} from 'inversify-express-utils'
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import {
  BACKOFFICE,
  FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ
} from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { MembersService } from './../services/members.service'

@ApiPath({
  name: 'Members',
  path: '/members',
  security: { basicAuth: [] },
})
@controller('/members')
export default class MembersController extends BaseHttpController {
  constructor(
    @inject('MembersService')
    private readonly membersService: MembersService
  ) {
    super()
  }

  @ApiOperationGet({
    path: '/interested',
    description: 'Get all subscribed members based on the query filters',
    parameters: {
      query: {
        facade_id: {
          description : 'Project facade id members belong to',
          required: true,
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
        subscribed_from: {
          description : 'Member earliest subscription date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        subscribed_to: {
          description : 'Member latest subscription date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        tag_ids: {
          description : 'Member tag ids',
          type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
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
      200: { model: 'User' },
      400: { description: 'Failed to get the members' },
    },
  })
  @httpGet('/interested',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getInterestedMembersValidator')
  public getInterestedMembers(req: Request) {
    return this.membersService.getInterestedMembers(req.query)
      .then(([total, members]) => this.json({ total, members }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/pending-offer',
    description: 'Get all subscribed members based on the query filters',
    parameters: {
      query: {
        facade_id: {
          description : 'Project facade id members belong to',
          required: true,
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
        sent_from: {
          description : 'Member with the offer that has the earliest sent date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        sent_to: {
          description : 'Member with the offer that has the latest sent date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        tag_ids: {
          description : 'Member tag ids',
          type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
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
      200: { model: 'User' },
      400: { description: 'Failed to get the members' },
    },
  })
  @httpGet('/pending-offer',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getPendingOfferMembersValidator')
  public getPendingOfferMembers(req: Request) {
    return this.membersService.getPendingOfferMembers(req.query)
      .then(([total, members]) => this.json({ total, members }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/contract',
    description: 'Get all subscribed members based on the query filters',
    parameters: {
      query: {
        facade_id: {
          description : 'Project facade id members belong to',
          required: true,
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
        sent_from: {
          description : 'Member with the contract that has the earliest sent date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        sent_to: {
          description : 'Member with the contract that has the latest sent date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        signed_from: {
          description : 'Member with the contract that has the earliest signed date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        signed_to: {
          description : 'Member with the contract that has the latest signed date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        status: {
          description: 'status of the contract',
        },
        tag_ids: {
          description : 'Member tag ids',
          type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
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
      200: { model: 'User' },
      400: { description: 'Failed to get the members' },
    },
  })
  @httpGet('/contract',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getContractMembersValidator')
  public getContractMembers(req: Request) {
    return this.membersService.getContractMembers(req.query)
      .then(([total, members]) => this.json({ total, members }, statuscodes.OK))
  }

  /**
   * GET /members/:facadeId/:apartmentId/subscribed
   *
   * @name getSubscribedMembers
   * @param req
   * ```
   * req.params.facadeId,
   * req.params.apartmentId,
   * req.query.email,
   * req.query.name,
   * req.query.has_double_room,
   * req.query.has_single_room,
   * req.query.has_shared_bathroom,
   * req.query.has_private_bathroom,
   * req.query.has_shared_toilet,
   * req.query.has_private_toilet,
   * req.query.tag_ids,
   * req.query.age_from,
   * req.query.age_to,
   * req.query.include_unspecified_age
   * req.query.subscribe_from,
   * req.query.subscribe_to,
   * req.query.move_in_date_from,
   * req.query.include_unspecified_move_in_date,
   * req.query.exclude_users_with_offers,
   * req.query.exclude_current_tenants,
   * req.query.is_only_today,
   * req.query.is_only_test_complete,
   * req.query.is_only_matching_rent,
   * req.query.is_only_suitable_for_disability,
   * req.query.offset (default 0),
   * req.query.limit (default 10),
   * req.query.sort_order (DESC or ASC)
   * req.query.sort_by (subscribed_at, birthday, email, note, move_in_date_to, score)
   * ```
   * @return members
   */
  @ApiOperationGet({
    path: '/{facadeId}/{apartmentId}/subscribed',
    description: 'Get all subscribed members by the given apartment',
    parameters: {
      path: {
        facadeId: {
          description: 'Id of project facade',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        apartmentId: {
          description: 'Id of apartment',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
      query: {
        email: {
          description: 'Member email address',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        name: {
          description: 'Member name',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        has_double_room: {
          description: 'If the member prefers a double room',
          type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
        },
        has_single_room: {
          description: 'If the member prefers a single room',
          type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
        },
        has_shared_bathroom: {
          description: 'If the member prefers a shared bathroom',
          type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
        },
        has_private_bathroom: {
          description: 'If the member prefers a private bathroom',
          type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
        },
        has_shared_toilet: {
          description: 'If the member prefers a shared toilet',
          type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
        },
        has_private_toilet: {
          description: 'If the member prefers a private toilet',
          type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
        },
        age_from: {
          description: 'Member lowest age',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        age_to: {
          description: 'Member highest age',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        matching_score: {
          description: 'Member lowest matching score',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        subscribed_from: {
          description: 'Member earliest subscription date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        subscribed_to: {
          description: 'Member latest subscription date',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        is_only_test_complete: {
          description: 'If member completes the roomie test',
          type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
        },
        tag_ids: {
          description: 'Member tag ids',
          type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
        },
        offset: {
          description: 'Offset value of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        limit: {
          description: 'Limit value of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        sort_order: {
          description: 'Sort order of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        sort_by: {
          description: 'Sort by field of the search result',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'User' },
      400: { description: 'Failed to get the members' },
    },
  })
  @httpGet('/:facadeId/:apartmentId/subscribed',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([
      FULL, APPLICATION_FULL, APPLICATION_READ, CONTRACT_FULL, CONTRACT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getSubscribedMembersValidator')
  public getSubscribedMembers(req: Request) {
    const { facadeId, apartmentId } = req.params
    return this.membersService.getSubscribedMembers(Number(facadeId), Number(apartmentId), req.query)
      .then(([total, members]) => this.json({ total, members }, statuscodes.OK))
  }
}
