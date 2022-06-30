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
const chat_1 = require("./../getstream/chat");
const constants_1 = require("../../infrastructure/constants");
const auth_1 = require("./../middleware/auth");
const project_service_1 = require("./../services/project.service");
const tenant_service_1 = require("./../services/tenant.service");
let GetstreamChatController = class GetstreamChatController extends inversify_express_utils_1.BaseHttpController {
    constructor(projectService, tenantService) {
        super();
        this.projectService = projectService;
        this.tenantService = tenantService;
    }
    addMemberToApartmentChannel(req, res) {
        return chat_1.addMemberToApartmentChannel(res.locals.userId, Number(res.locals.apartmentId))
            .then(data => this.json(data, statuscodes.OK));
    }
    addMemberToProjectChannel(req, res) {
        const facadeId = Number(res.locals.projectId);
        return this.tenantService.getHostsByFacadeId(facadeId)
            .then(hosts => hosts.length > 0 ? this.projectService.getProjectByFacadeId(facadeId)
            .then(project => chat_1.addMemberToProjectChannel(res.locals.userId, facadeId, project.name, project.cover_image_source, hosts[0]))
            : Promise.reject({ message: 'NOT_FOUND', reason: `No host is found for project facade ${facadeId}` }))
            .then(data => this.json(data, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/apartment-channel/add-member',
        description: 'Add the tenant to the apartment chat channel',
        parameters: {},
        responses: {
            200: {},
            400: { description: 'Failed to add' },
        },
    }),
    inversify_express_utils_1.httpPost('/apartment-channel/add-member', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GetstreamChatController.prototype, "addMemberToApartmentChannel", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/project-channel/add-member',
        description: 'Add the tenant to the project chat channel',
        parameters: {},
        responses: {
            200: {},
            400: { description: 'Failed to add' },
        },
    }),
    inversify_express_utils_1.httpPost('/project-channel/add-member', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GetstreamChatController.prototype, "addMemberToProjectChannel", null);
GetstreamChatController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'StreamChat',
        path: '/stream-chat',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/stream-chat'),
    __param(0, inversify_1.inject('ProjectService')),
    __param(1, inversify_1.inject('TenantService')),
    __metadata("design:paramtypes", [project_service_1.ProjectService,
        tenant_service_1.TenantService])
], GetstreamChatController);
exports.default = GetstreamChatController;
//# sourceMappingURL=getstreamChat.controller.js.map