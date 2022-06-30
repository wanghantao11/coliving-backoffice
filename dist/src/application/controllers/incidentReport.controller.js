"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const statuscodes = require("http-status-codes");
const inversify_express_utils_1 = require("inversify-express-utils");
const swagger_express_ts_1 = require("swagger-express-ts");
const entity_1 = require("./../../domain/entity");
const incident_1 = require("./../firebase/incident");
const auth_1 = require("./../middleware/auth");
const admin_service_1 = require("./../services/admin.service");
const incidentReport_service_1 = require("./../services/incidentReport.service");
const projectFacade_service_1 = require("./../services/projectFacade.service");
const constants_1 = require("./../../infrastructure/constants");
const firebase_1 = require("./../../infrastructure/utils/firebase");
let IncidentReportController = class IncidentReportController extends inversify_express_utils_1.BaseHttpController {
    constructor(incidentReportService, adminService, projectFacadeService) {
        super();
        this.incidentReportService = incidentReportService;
        this.adminService = adminService;
        this.projectFacadeService = projectFacadeService;
    }
    createIncidentReportByAdmin(req, res) {
        return entity_1.IncidentReport.generateIncidentReport(Object.assign({ client_id: res.locals.clientId }, req.body))
            .then(this.incidentReportService.createIncidentReport)
            .then(incidentReport => this.json({ incidentReport }, statuscodes.OK));
    }
    createIncidentReportByTenant(req, res) {
        return this.projectFacadeService.getProjectFacade(res.locals.projectId).then(projectFacade => this.adminService.getDefaultHostAdminByFacadeId(projectFacade.id).then(defaultHost => entity_1.IncidentReport.generateIncidentReport(Object.assign({ client_id: projectFacade.client_id, facade_id: projectFacade.id, owner_id: defaultHost.id, reporter_id: res.locals.userId }, req.body)).then(this.incidentReportService.createIncidentReport)
            .then(incidentReport => this.json({ incidentReport }, statuscodes.OK))));
    }
    getIncidentReportForAdmin(req) {
        return this.incidentReportService.getIncidentReportForAdmin(req.params.id)
            .then(incidentReport => this.json({ incidentReport }, statuscodes.OK));
    }
    getIncidentReportsForAdmin(req, res) {
        // TODO get incident reports for the only projects the admin have rights to see
        return this.incidentReportService.getIncidentReportsByClientId(res.locals.clientId, res.locals.facadeIds, req.query)
            .then(incidentReports => this.json(incidentReports, statuscodes.OK));
    }
    getIncidentReportForTenant(req) {
        return this.incidentReportService.getIncidentReportForTenant(req.params.id)
            .then(incidentReport => this.json({ incidentReport }, statuscodes.OK));
    }
    getIncidentReportsForTenant(req, res) {
        return this.incidentReportService.getIncidentReportsForTenant(res.locals.userId, res.locals.projectId, req.query)
            .then(incidentReports => this.json({ incidentReports }, statuscodes.OK));
    }
    updateIncidentReportByAdmin(req) {
        return this.incidentReportService.updateIncidentReport(req.params.id, req.body)
            .then(incidentReport => this.json({ incidentReport }, statuscodes.OK));
    }
    updateIncidentReportByTenant(req) {
        return this.incidentReportService.updateIncidentReport(req.params.id, req.body)
            .then(incidentReport => this.json({ incidentReport }, statuscodes.OK));
    }
    deleteIncidentPhoto(req) {
        return incident_1.deleteImage(firebase_1.parseImagePath(req.body.img))
            .then(() => this.json({}, statuscodes.OK));
    }
    uploadIncidentPhoto(req, res) {
        const uploaderId = res.locals.clientId ? res.locals.clientId : res.locals.userId;
        return incident_1.uploadImage(uploaderId, req.body.img)
            .then(imageUrlObj => this.json(imageUrlObj, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
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
    }),
    inversify_express_utils_1.httpPost('/admin', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.INCIDENT_FULL]), 'isAuthenticated', 'isAuthorized', 'createIncidentReportValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], IncidentReportController.prototype, "createIncidentReportByAdmin", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
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
    }),
    inversify_express_utils_1.httpPost('/tenant', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'createIncidentReportByTenantValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], IncidentReportController.prototype, "createIncidentReportByTenant", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/admin/{id}',
        description: 'Get the given incident report details for admin user',
        parameters: {
            path: {
                id: {
                    description: 'Id of incident report',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'IncidentReport' },
            400: { description: 'Failed to get the incident report' },
        },
    }),
    inversify_express_utils_1.httpGet('/admin/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.INCIDENT_FULL, constants_1.INCIDENT_READ]), 'isAuthenticated', 'isAuthorized', 'getIncidentReportForAdminValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IncidentReportController.prototype, "getIncidentReportForAdmin", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/admin',
        description: 'Get all incident reports for admin user',
        parameters: {
            query: {
                status: {
                    description: 'Status of incident report',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                offset: {
                    description: 'Offset value of the search result',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                limit: {
                    description: 'Limit value of the search result',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'IncidentReport' },
            400: { description: 'Failed to get the incident report' },
        },
    }),
    inversify_express_utils_1.httpGet('/admin', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.INCIDENT_FULL, constants_1.INCIDENT_READ]), 'isAuthenticated', 'isAuthorized', 'getIncidentReportsForAdminValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], IncidentReportController.prototype, "getIncidentReportsForAdmin", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/tenant/{id}',
        description: 'Get the given incident report details for tenant',
        parameters: {
            path: {
                id: {
                    description: 'Id of incident report',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'IncidentReport' },
            400: { description: 'Failed to get the incident report' },
        },
    }),
    inversify_express_utils_1.httpGet('/tenant/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'getIncidentReportForTenantValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IncidentReportController.prototype, "getIncidentReportForTenant", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/admin',
        description: 'Get all incident reports for admin user',
        parameters: {
            query: {
                closed_at: {
                    description: 'Date when the incident report is closed',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                status: {
                    description: 'Status of incident report',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                offset: {
                    description: 'Offset value of the search result',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                limit: {
                    description: 'Limit value of the search result',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'IncidentReport' },
            400: { description: 'Failed to get the incident report' },
        },
    }),
    inversify_express_utils_1.httpGet('/tenant', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'getIncidentReportsForTenantValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], IncidentReportController.prototype, "getIncidentReportsForTenant", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the incident report by admin user',
        path: '/admin/{id}',
        parameters: {
            body: { description: 'Incident report fields to update', model: 'IncidentReport' },
            path: {
                id: {
                    description: 'Id of incident report',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/admin/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.INCIDENT_FULL]), 'isAuthenticated', 'isAuthorized', 'updateIncidentReportByAdminValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IncidentReportController.prototype, "updateIncidentReportByAdmin", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the incident report by tenant',
        path: '/tenant/{id}',
        parameters: {
            body: { description: 'Incident report fields to update', model: 'IncidentReport' },
            path: {
                id: {
                    description: 'Id of incident report',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/tenant/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'updateIncidentReportByTenantValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IncidentReportController.prototype, "updateIncidentReportByTenant", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Delete the incident report photo',
        path: '/photo/delete',
        parameters: {
            body: { name: 'img', description: 'Url of the photo to delete' },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/photo/delete', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE, constants_1.TENANT]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.INCIDENT_FULL]), 'isAuthenticated', 'isAuthorized', 'deleteIncidentPhotoValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IncidentReportController.prototype, "deleteIncidentPhoto", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'upload an incident report photo',
        path: '/photo',
        parameters: {
            body: { name: 'img', description: 'Url of the photo to upload' },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/photo', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE, constants_1.TENANT]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.INCIDENT_FULL]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], IncidentReportController.prototype, "uploadIncidentPhoto", null);
IncidentReportController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'IncidentReport',
        path: '/incident-report',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/incident-report'),
    __param(0, inversify_1.inject('IncidentReportService')),
    __param(1, inversify_1.inject('AdminService')),
    __param(2, inversify_1.inject('ProjectFacadeService')),
    __metadata("design:paramtypes", [incidentReport_service_1.IncidentReportService,
        admin_service_1.AdminService,
        projectFacade_service_1.ProjectFacadeService])
], IncidentReportController);
exports.default = IncidentReportController;
//# sourceMappingURL=incidentReport.controller.js.map