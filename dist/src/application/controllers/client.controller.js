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
const client_1 = require("./../firebase/client");
const auth_1 = require("./../middleware/auth");
const client_service_1 = require("./../services/client.service");
const role_service_1 = require("./../services/role.service");
let ClientController = class ClientController extends inversify_express_utils_1.BaseHttpController {
    constructor(clientService, roleService) {
        super();
        this.clientService = clientService;
        this.roleService = roleService;
    }
    createClient(req) {
        return this.clientService.createClient(req.body)
            .then(client => this.json({ client }, statuscodes.OK));
    }
    uploadClientLogo(req) {
        return client_1.uploadLogo(req.params.id, req.body.img)
            .then(res => this.json(res, statuscodes.OK));
    }
    getClient(req, res) {
        return this.clientService.getClient(res.locals.clientId)
            .then(client => this.json({ client }, statuscodes.OK));
    }
    deleteClient(req) {
        return this.clientService.deleteClient(req.params.id);
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new client',
        parameters: {
            body: { description: 'New client', required: true, model: 'Client' },
        },
        responses: {
            200: { model: 'Client' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CLIENT_FULL]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "createClient", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Upload the client logo',
        path: '/{id}/logo',
        parameters: {
            body: { name: 'img', description: 'Url of the logo to upload' },
            path: {
                id: {
                    description: 'Id of client',
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
    inversify_express_utils_1.httpPut('/:id/logo', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CLIENT_FULL]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "uploadClientLogo", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/',
        description: 'Get the client details',
        responses: {
            200: { model: 'Client' },
            400: { description: 'Failed to get client' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CLIENT_FULL, constants_1.CLIENT_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getClient", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: 'Delete the client',
        path: '/{id}',
        parameters: {
            path: {
                id: {
                    description: 'Id of client',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to delete the client' },
        },
    }),
    inversify_express_utils_1.httpDelete('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CLIENT_FULL]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "deleteClient", null);
ClientController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Client',
        path: '/client',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/client'),
    __param(0, inversify_1.inject('ClientService')),
    __param(1, inversify_1.inject('RoleService')),
    __metadata("design:paramtypes", [client_service_1.ClientService,
        role_service_1.RoleService])
], ClientController);
exports.default = ClientController;
//# sourceMappingURL=client.controller.js.map