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
const projectFacadeBilling_service_1 = require("./../services/projectFacadeBilling.service");
let ProjectFacadeBillingController = class ProjectFacadeBillingController extends inversify_express_utils_1.BaseHttpController {
    constructor(projectFacadeBillingService) {
        super();
        this.projectFacadeBillingService = projectFacadeBillingService;
    }
    getProjectFacadeBilling(req) {
        return this.projectFacadeBillingService.getProjectFacadeBilling(req.params.id)
            .then(projectFacadeBilling => this.json({ projectFacadeBilling }, statuscodes.OK));
    }
    updateProjectFacadeBilling(req) {
        return this.projectFacadeBillingService.updateProjectFacadeBilling(req.params.id, req.body)
            .then(projectFacadeBilling => this.json({ projectFacadeBilling }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}',
        description: 'Get the project facade billing info',
        parameters: {
            path: {
                id: {
                    description: 'Id of the project facade billing',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'ProjectFacadeBilling' },
            400: { description: 'Failed to get the project facade billing info' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL, constants_1.ACCOMMODATION_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeBillingController.prototype, "getProjectFacadeBilling", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the project facade billing info',
        path: '/{id}',
        parameters: {
            body: { description: 'Project facade billing fields to update', model: 'projectFacadeBilling' },
            path: {
                id: {
                    description: 'Id of project facade billing',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeBillingController.prototype, "updateProjectFacadeBilling", null);
ProjectFacadeBillingController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'ProjectFacadeBilling',
        path: '/project-facade-billing',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/project-facade-billing'),
    __param(0, inversify_1.inject('ProjectFacadeBillingService')),
    __metadata("design:paramtypes", [projectFacadeBilling_service_1.ProjectFacadeBillingService])
], ProjectFacadeBillingController);
exports.default = ProjectFacadeBillingController;
//# sourceMappingURL=projectFacadeBilling.controller.js.map