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
const role_service_1 = require("./../services/role.service");
const auth_1 = require("./../middleware/auth");
let RoleController = class RoleController extends inversify_express_utils_1.BaseHttpController {
    constructor(roleService) {
        super();
        this.roleService = roleService;
    }
    getRolesByClientId(req) {
        return this.roleService.getRolesByClientId(req.params.clientId)
            .then(roles => this.json(roles, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{clientId}',
        description: 'Get roles for the client',
        parameters: {
            path: {
                clientId: {
                    description: 'Id of client',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'Role' },
            400: { description: 'Failed to get the roles' },
        },
    }),
    inversify_express_utils_1.httpGet('/:clientId', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROLE_FULL, constants_1.ROLE_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "getRolesByClientId", null);
RoleController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Role',
        path: '/role',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/role'),
    __param(0, inversify_1.inject('RoleService')),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
exports.default = RoleController;
//# sourceMappingURL=role.controller.js.map