import { inject } from 'inversify'
import { Request, Response } from 'express'
import * as statuscodes from 'http-status-codes'
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  httpPut
} from 'inversify-express-utils'
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts'

import { IncidentReport } from './../../domain/entity'
import { deleteImage, uploadImage } from './../firebase/incident'
import { AuthMiddleware } from './../middleware/auth'
import { AdminService } from './../services/admin.service'
import { IncidentReportService } from './../services/incidentReport.service'
import { ProjectFacadeService } from './../services/projectFacade.service'
import {
  BACKOFFICE, TENANT,
  FULL, INCIDENT_FULL, INCIDENT_READ
} from './../../infrastructure/constants'
import { parseImagePath } from './../../infrastructure/utils/firebase'

@ApiPath({
  name: 'IncidentReport',
  path: '/incident-report',
  security: { basicAuth: [] },
})
@controller('/incident-report')
export default class IncidentReportController extends BaseHttpController {
  constructor(
    @inject('IncidentReportService')
    private incidentReportService: IncidentReportService,
    @inject('AdminService')
    private adminService: AdminService,
    @inject('ProjectFacadeService')
    private projectFacadeService: ProjectFacadeService
  ) {
    super()
  }

  @ApiOperationPost({
    path: '/admin',
    description: 'Create a new incident report by admin user',
    parameters: {
      body: { description: 'New incident report', required: true, model: 'IncidentReport' },
    },
    responses: {
      200: { model: 'IncidentReport' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/admin',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, INCIDENT_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'createIncidentReportValidator'
  )
  public createIncidentReportByAdmin(req: Request, res: Response) {
    return IncidentReport.generateIncidentReport({ client_id: res.locals.clientId, ...req.body })
      .then(this.incidentReportService.createIncidentReport)
      .then(incidentReport => this.json({ incidentReport }, statuscodes.OK))
  }

  @ApiOperationPost({
    path: '/tenant',
    description: 'Create a new incident report by tenant',
    parameters: {
      body: { description: 'New incident report', required: true, model: 'IncidentReport' },
    },
    responses: {
      200: { model: 'IncidentReport' },
      400: { description: 'Failed to create' },
      422: { description: 'Invalid input data' },
    },
  })
  @httpPost('/tenant',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'createIncidentReportByTenantValidator'
  )
  public createIncidentReportByTenant(req: Request, res: Response) {
    return this.projectFacadeService.getProjectFacade(res.locals.projectId).then(projectFacade =>
      this.adminService.getDefaultHostAdminByFacadeId(projectFacade.id).then(defaultHost =>
        IncidentReport.generateIncidentReport({
          client_id: projectFacade.client_id,
          facade_id: projectFacade.id,
          owner_id: defaultHost.id,
          reporter_id: res.locals.userId,
          ...req.body,
        }).then(this.incidentReportService.createIncidentReport)
          .then(incidentReport => this.json({ incidentReport }, statuscodes.OK)))
    )
  }

  @ApiOperationGet({
    path: '/admin/{id}',
    description: 'Get the given incident report details for admin user',
    parameters: {
      path: {
        id: {
          description : 'Id of incident report',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'IncidentReport' },
      400: { description: 'Failed to get the incident report' },
    },
  })
  @httpGet('/admin/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, INCIDENT_FULL, INCIDENT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getIncidentReportForAdminValidator')
  public getIncidentReportForAdmin(req: Request) {
    return this.incidentReportService.getIncidentReportForAdmin(req.params.id)
      .then(incidentReport => this.json({ incidentReport }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/admin',
    description: 'Get all incident reports for admin user',
    parameters: {
      query: {
        status: {
          description : 'Status of incident report',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        offset: {
          description : 'Offset value of the search result',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        limit: {
          description : 'Limit value of the search result',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'IncidentReport' },
      400: { description: 'Failed to get the incident report' },
    },
  })
  @httpGet('/admin',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, INCIDENT_FULL, INCIDENT_READ]),
    'isAuthenticated',
    'isAuthorized',
    'getIncidentReportsForAdminValidator')

  public getIncidentReportsForAdmin(req: Request, res: Response) {
    // TODO get incident reports for the only projects the admin have rights to see
    return this.incidentReportService.getIncidentReportsByClientId(res.locals.clientId, res.locals.facadeIds, req.query)
      .then(incidentReports => this.json(incidentReports, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/tenant/{id}',
    description: 'Get the given incident report details for tenant',
    parameters: {
      path: {
        id: {
          description : 'Id of incident report',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      200: { model: 'IncidentReport' },
      400: { description: 'Failed to get the incident report' },
    },
  })
  @httpGet('/tenant/:id',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'getIncidentReportForTenantValidator')
  public getIncidentReportForTenant(req: Request) {
    return this.incidentReportService.getIncidentReportForTenant(req.params.id)
      .then(incidentReport => this.json({ incidentReport }, statuscodes.OK))
  }

  @ApiOperationGet({
    path: '/admin',
    description: 'Get all incident reports for admin user',
    parameters: {
      query: {
        closed_at: {
          description : 'Date when the incident report is closed',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        status: {
          description : 'Status of incident report',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        offset: {
          description : 'Offset value of the search result',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
        limit: {
          description : 'Limit value of the search result',
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.INTEGER,
        },
      },
    },
    responses: {
      200: { model: 'IncidentReport' },
      400: { description: 'Failed to get the incident report' },
    },
  })
  @httpGet('/tenant',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'getIncidentReportsForTenantValidator')
  public getIncidentReportsForTenant(req: Request, res: Response) {
    return this.incidentReportService.getIncidentReportsForTenant(
      res.locals.userId, res.locals.projectId, req.query)
      .then(incidentReports => this.json({ incidentReports }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the incident report by admin user',
    path : '/admin/{id}',
    parameters: {
      body: { description: 'Incident report fields to update', model: 'IncidentReport' },
      path: {
        id: {
          description : 'Id of incident report',
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
  @httpPut('/admin/:id',
    AuthMiddleware.allowAuthTypes([BACKOFFICE]),
    AuthMiddleware.needPermisson([FULL, INCIDENT_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'updateIncidentReportByAdminValidator')
  public updateIncidentReportByAdmin(req: Request) {
    return this.incidentReportService.updateIncidentReport(req.params.id, req.body)
      .then(incidentReport => this.json({ incidentReport }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Update the incident report by tenant',
    path : '/tenant/{id}',
    parameters: {
      body: { description: 'Incident report fields to update', model: 'IncidentReport' },
      path: {
        id: {
          description : 'Id of incident report',
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
  @httpPut('/tenant/:id',
    AuthMiddleware.allowAuthTypes([TENANT]),
    'isAuthenticated',
    'isAuthorized',
    'updateIncidentReportByTenantValidator')
  public updateIncidentReportByTenant(req: Request) {
    return this.incidentReportService.updateIncidentReport(req.params.id, req.body)
      .then(incidentReport => this.json({ incidentReport }, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'Delete the incident report photo',
    path : '/photo/delete',
    parameters: {
      body: { name: 'img', description: 'Url of the photo to delete' },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPut(
    '/photo/delete',
    AuthMiddleware.allowAuthTypes([BACKOFFICE, TENANT]),
    AuthMiddleware.needPermisson([FULL, INCIDENT_FULL]),
    'isAuthenticated',
    'isAuthorized',
    'deleteIncidentPhotoValidator'
  )
  public deleteIncidentPhoto(req: Request) {
    return deleteImage(parseImagePath(req.body.img))
      .then(() => this.json({}, statuscodes.OK))
  }

  @ApiOperationPut({
    description: 'upload an incident report photo',
    path : '/photo',
    parameters: {
      body: { name: 'img', description: 'Url of the photo to upload' },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPut(
    '/photo',
    AuthMiddleware.allowAuthTypes([BACKOFFICE, TENANT]),
    AuthMiddleware.needPermisson([FULL, INCIDENT_FULL]),
    'isAuthenticated',
    'isAuthorized'
  )
  public uploadIncidentPhoto(req: Request, res: Response) {
    const uploaderId = res.locals.clientId ? res.locals.clientId : res.locals.userId
    return uploadImage(uploaderId, req.body.img)
      .then(imageUrlObj => this.json(imageUrlObj, statuscodes.OK))
  }
}
