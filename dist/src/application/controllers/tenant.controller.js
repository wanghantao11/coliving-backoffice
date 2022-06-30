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
const tenant_service_1 = require("./../services/tenant.service");
let TenantController = class TenantController extends inversify_express_utils_1.BaseHttpController {
    constructor(tenantService) {
        super();
        this.tenantService = tenantService;
    }
    tenantLogin(req) {
        return this.tenantService.login(req.body.email, req.body.password)
            .then(token => this.json({ token }, statuscodes.OK));
    }
    getTenantDocuments(req, res) {
        return this.tenantService.getTenantDocumentsByFacadeId(Number(res.locals.projectId))
            .then(documents => this.json({ documents }, statuscodes.OK));
    }
    getHostsByFacadeId(req, res) {
        return this.tenantService.getHostsByFacadeId(Number(res.locals.projectId))
            .then(host => this.json({ host }, statuscodes.OK));
    }
    getTenantDetailById(req) {
        return this.tenantService.getTenantDetailById(req.query.iduser)
            .then(tenant => this.json({ tenant }, statuscodes.OK));
    }
    getOtherTenantById(req) {
        return this.tenantService.getOtherTenantDetailById(req.params.iduser)
            .then(tenant => this.json({ tenant }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/login',
        description: 'Login to tenant app for the tenant',
        parameters: {
            body: {
                properties: {
                    email: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
                    password: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
                },
                required: true,
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to login' },
        },
    }),
    inversify_express_utils_1.httpPost('/login', 'loginTenantValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "tenantLogin", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/documents',
        description: 'Get the tenant documents',
        responses: {
            200: {},
            400: { description: 'Failed to get the tenant documents' },
        },
    }),
    inversify_express_utils_1.httpGet('/documents', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "getTenantDocuments", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/hosts',
        description: 'Get the hosts for the given project facade',
        responses: {
            200: {},
            400: { description: 'Failed to get hosts' },
        },
    }),
    inversify_express_utils_1.httpGet('/hosts', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "getHostsByFacadeId", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get the tenant details',
        parameters: {
            query: {
                iduser: { description: 'Id of the tenant', type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get tenant details' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "getTenantDetailById", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{iduser}',
        description: 'Get the tenant by the id',
        parameters: {
            path: {
                iduser: { description: 'Id of the member', type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get tenant' },
        },
    }),
    inversify_express_utils_1.httpGet('/:iduser', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'getOtherTenantValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "getOtherTenantById", null);
TenantController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Tenant',
        path: '/tenant',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/tenant'),
    __param(0, inversify_1.inject('TenantService')),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantController);
exports.default = TenantController;
//# sourceMappingURL=tenant.controller.js.map