import { inject } from 'inversify'
import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
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

import { BACKOFFICE, FULL } from '../../infrastructure/constants'
import { StatisticsService } from '../services/statistics.service'
import { AuthMiddleware } from '../middleware/auth'

@ApiPath({
  name: 'Statistics',
  path: '/statistics',
  security: { basicAuth: [] },
})
@controller('/statistics')
export default class StatisticsController extends BaseHttpController {
  constructor(
    @inject('StatisticsService')
    private statisticsService: StatisticsService
  ) {
    super()
  }

  @ApiOperationGet({
    path: '/applications',
    description: 'Get the application statistics',
    parameters: {
      query: {
        start_date: {
          description: 'Start date of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        end_date: {
          description: 'End date of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get the application statistics' },
    },
  })
  @httpGet('/applications',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL]),
    'isAuthenticated',
    'isAuthorized',
    'getApplicationsStatsByDateRangeValidator'
  )
  public getApplicationsStatsByDateRange(req: Request) {
    return this.statisticsService.getApplicationsStatsByDateRange(req.query)
      .then(statistics => this.json(statistics, statuscodes.OK))
  }

  @httpGet('/registrations',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL]),
    'isAuthenticated',
    'isAuthorized',
    'getRegistrationsStatsByDateRangeValidator'
  )
  public getRegistrationsStatsByDateRange(req: Request) {
    return this.statisticsService.getRegistrationsStatsByDateRange(req.query)
      .then(statistics => this.json(statistics, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/general',
    description: 'Get the general statistics',
    responses: {
      200: {},
      400: { description: 'Failed to get the general statistics' },
    },
  })
  @httpGet('/general',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL]),
    'isAuthenticated',
    'isAuthorized')
  public getGeneralStats(req: Request, res: Response) {
    const { clientId } = res.locals
    return this.statisticsService.getGeneralStats(clientId)
      .then(genenralStats => this.json(genenralStats, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/members',
    description: 'Get the member statistics',
    parameters: {
      query: {
        start_date: {
          description: 'Start date of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        end_date: {
          description: 'End date of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get the member statistics' },
    },
  })
  @httpGet('/members',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL]),
    'isAuthenticated',
    'isAuthorized',
    'getStatsByDateRangeValidator'
  )
  public getMembersStatsByDateRange(req: Request) {
    return this.statisticsService.getMembersStatsByDateRange(req.query)
      .then(statistics => this.json(statistics, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/offer-events',
    description: 'Get the offer events statistics',
    parameters: {
      query: {
        start_date: {
          description: 'Start date of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        end_date: {
          description: 'End date of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get the offer envents statistics' },
    },
  })
  @httpGet('/offer-events',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL]),
    'isAuthenticated',
    'isAuthorized',
    'getStatsByDateRangeValidator'
  )
  public getOffersStatsByDateRange(req: Request) {
    return this.statisticsService.getOffersStatsByDateRange(req.query)
      .then(offersStats => this.json(offersStats, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/contract-events',
    description: 'Get the contract events statistics',
    parameters: {
      query: {
        start_date: {
          description: 'Start date of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        end_date: {
          description: 'End date of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get the contract events statistics' },
    },
  })
  @httpGet('/contract-events',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL]),
    'isAuthenticated',
    'isAuthorized',
    'getStatsByDateRangeValidator'
  )
  public getContractsStatsByDateRange(req: Request) {
    return this.statisticsService.getContractsStatsByDateRange(req.query)
      .then(contractsStats => this.json(contractsStats, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/sales-progress',
    description: 'Get the sales progress grouped by date statistics',
    parameters: {
      query: {
        start_date: {
          description: 'Start date of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        end_date: {
          description: 'End date of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        facade_id: {
          description: 'Facade id of the search',
          type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
        },
      },
    },
    responses: {
      200: {},
      400: { description: 'Failed to get the sales progress statistics' },
    },
  })
  @httpGet('/sales-progress',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL]),
    'isAuthenticated',
    'isAuthorized',
    'getStatsByDateRangeValidator'
  )
  public getSalesProgressStatsByDateRange(req: Request) {
    return this.statisticsService.getSalesProgressStats(req.query)
  }
}
