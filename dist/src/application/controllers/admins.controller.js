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
const constants_1 = require("./../../infrastructure/constants");
const auth_1 = require("./../middleware/auth");
const admin_service_1 = require("./../services/admin.service");
let AdminsController = class AdminsController extends inversify_express_utils_1.BaseHttpController {
    constructor(adminService) {
        super();
        this.adminService = adminService;
    }
    getAdminsByClientId(req, res) {
        return this.adminService.getAdminsByClientId(res.locals.clientId)
            .then(admins => this.json({ admins }, statuscodes.OK));
    }
    getHostsOrSiteAdminsByFacadeId(req) {
        return this.adminService.getHostsOrSiteAdminsByFacadeId(Number(req.params.facadeId))
            .then(admins => this.json({ admins }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get all admin users for the organization',
        responses: {
            200: { model: 'Admin' },
            400: { description: 'Failed to get the admin users' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ADMIN_FULL, constants_1.ADMIN_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminsController.prototype, "getAdminsByClientId", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/host-and-site-admin/{facadeId}',
        description: 'Get all hosts and admins for the given project',
        parameters: {
            path: {
                facadeId: {
                    description: 'Id of project facade',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'Admin' },
            400: { description: 'Failed to get hosts and admins' },
        },
    }),
    inversify_express_utils_1.httpGet('/host-and-site-admin/:facadeId', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.INCIDENT_READ]), 'isAuthenticated', 'isAuthorized', 'getAdminsValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminsController.prototype, "getHostsOrSiteAdminsByFacadeId", null);
AdminsController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Admins',
        path: '/admins',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/admins'),
    __param(0, inversify_1.inject('AdminService')),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminsController);
exports.default = AdminsController;
//# sourceMappingURL=admins.controller.js.map