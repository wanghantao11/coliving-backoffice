import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpGet
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { TENANT } from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { TenantService } from './../services/tenant.service'

@ApiPath({
  name: 'Tenants',
  path: '/tenants',
  security: { basicAuth: [] },
})
@controller('/tenants')
export default class TenantsController extends BaseHttpController {
  constructor(
    @inject('TenantService')
    private tenantService: TenantService
  ) {
    super()
  }

  /**
   * GET /tenants
   *
   * @name getTenants
   * @param req
   * ```
   * req.query.food_preferences: string[]
   * req.query.interest_ids: number[]
   * req.query.age_from: number
   * req.query.age_to: number
   * req.query.prefix: string
   * req.query.offset: number(by default 0)
   * req.query.limit: number(by default 20)
   * ```
   * @example
   * ```
   * /tenants
   *   ?interest_ids[0]=1
   *   &interest_ids[1]=2
   * ```
   * @return tenants object
   */
  @ApiOperationGet({
    description: 'Get the tenants based on query filters',
    parameters: {
      query: {
        food_preferences: { description: 'Food preferences of the tenant', type: SwaggerDefinitionConstant.Parameter.Type.ARRAY },
        interest_ids: { description: 'Interest ids of the tenant', type: SwaggerDefinitionConstant.Parameter.Type.ARRAY },
        age_from: { description: 'Lowest age of the tenant', type: SwaggerDefinitionConstant.Parameter.Type.INTEGER },
        age_to: { description: 'Highest age of the tenant', type: SwaggerDefinitionConstant.Parameter.Type.INTEGER },
        prefix: { description: 'Name prefix of the tenant', type: SwaggerDefinitionConstant.Parameter.Type.STRING },
        offset: { description: 'Offset value of the search result', type: SwaggerDefinitionConstant.Parameter.Type.INTEGER },
        limit: { description: 'Limit value of the search result', type: SwaggerDefinitionConstant.Parameter.Type.INTEGER },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get applications count' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'getTenantsValidator')
  public getTenants(req: Request, res: Response) {
    return this.tenantService.getTenants(res.locals.userId, res.locals.projectId, req.query)
      .then(tenants => this.json({ tenants }, statuscodes.OK))
  }
}
