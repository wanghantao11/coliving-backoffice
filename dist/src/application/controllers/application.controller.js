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
const statuscodes = require("http-status-codes");
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const swagger_express_ts_1 = require("swagger-express-ts");
const constants_1 = require("./../../infrastructure/constants");
const auth_1 = require("./../middleware/auth");
const application_service_1 = require("./../services/application.service");
let ApplicationController = class ApplicationController extends inversify_express_utils_1.BaseHttpController {
    constructor(applicationService) {
        super();
        this.applicationService = applicationService;
    }
    /* ---------------------- Endpoints for community and app ---------------------- */
    applyForProject(req, res) {
        return this.applicationService.applyForProject(res.locals.userId, req.body.facade_id)
            .then(application => this.json({ application }, statuscodes.OK));
    }
    getMemberApplications(req, res) {
        return this.applicationService.getMemberApplications(res.locals.userId)
            .then(applications => this.json({ applications }, statuscodes.OK));
    }
    unapplyForProject(req, res) {
        return this.applicationService.unapplyForProject(res.locals.userId, req.params.projectId)
            .then(() => this.json({}, statuscodes.OK));
    }
    /* ----------------------- Endpoints for backoffice ----------------------- */
    getTotalCountAndTodayCountOfApplications(req) {
        return this.applicationService.getTotalCountAndTodayCountOfApplications(req.query.facadeId)
            .then(count => this.json({ count }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new application',
        parameters: {
            body: { description: 'New application', required: true, model: 'Application' },
        },
        responses: {
            200: { model: 'Application' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.APPLICATION_FULL]), 'isAuthenticated', 'isAuthorized', 'createApplicationValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ApplicationController.prototype, "applyForProject", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/',
        description: 'Get the member applications',
        responses: {
            200: { model: 'Application' },
            400: { description: 'Failed to get member applications' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ApplicationController.prototype, "getMemberApplications", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: 'Delete the application of the given project',
        path: '/{projectId}',
        parameters: {
            path: {
                projectId: {
                    description: 'Id of project',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to delete the application' },
        },
    }),
    inversify_express_utils_1.httpDelete('/:projectId', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.APPLICATION_FULL]), 'isAuthenticated', 'isAuthorized', 'deleteApplicationValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ApplicationController.prototype, "unapplyForProject", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/count',
        description: 'Get the total and today number of applications for the given project',
        parameters: {
            query: {
                facadeId: { description: 'Id of the project facade', type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get applications count' },
        },
    }),
    inversify_express_utils_1.httpGet('/count', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ]), 'isAuthenticated', 'isAuthorized', 'countApplicationValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicationController.prototype, "getTotalCountAndTodayCountOfApplications", null);
ApplicationController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Application',
        path: '/application',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/application'),
    __param(0, inversify_1.inject('ApplicationService')),
    __metadata("design:paramtypes", [application_service_1.ApplicationService])
], ApplicationController);
exports.default = ApplicationController;
//# sourceMappingURL=application.controller.js.map