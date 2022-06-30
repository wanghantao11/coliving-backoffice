import * as statuscodes from 'http-status-codes'
import { inject } from 'inversify'
import {
  BaseHttpController,
  controller,
  httpGet
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiPath
} from 'swagger-express-ts'

import { COMMUNITY, TENANT } from './../../infrastructure/constants'
import { AuthMiddleware } from './../middleware/auth'
import { InterestsService } from './../services/interests.service'

@ApiPath({
  name: 'Interests',
  path: '/interests',
  security: { basicAuth: [] },
})
@controller('/interests')
export default class InterestsController extends BaseHttpController {
  constructor(
    @inject('InterestsService')
    private interestsService: InterestsService
  ) {
    super()
  }

  @ApiOperationGet({
    description: 'Get all interests',
    responses: {
      200: { model: 'Interests' },
      400: { description: 'Failed to get the interests' },
    },
  })
  @httpGet('/',
    AuthMiddleware.allowAuthTypes([COMMUNITY, TENANT]),
    'isAuthenticated',
    'isAuthorized')
  public getInterests() {
    return this.interestsService.getInterests()
      .then(interests => this.json({ interests }, statuscodes.OK))
  }
}
