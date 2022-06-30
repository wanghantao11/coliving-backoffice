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
const memberTags_service_1 = require("./../services/memberTags.service");
const entity_1 = require("./../../domain/entity");
const auth_1 = require("./../middleware/auth");
const constants_1 = require("../../infrastructure/constants");
let MemberTagsController = class MemberTagsController extends inversify_express_utils_1.BaseHttpController {
    constructor(memberTagsService) {
        super();
        this.memberTagsService = memberTagsService;
    }
    createMemberTag(req, res) {
        return Promise.resolve(entity_1.MemberTags.generateMemberTags(Object.assign({ client_id: res.locals.clientId }, req.body)))
            .then(this.memberTagsService.createMemberTag)
            .then(tag => this.json({ tag }, statuscodes.OK));
    }
    getMemberTagsByClientId(req, res) {
        return this.memberTagsService.getMemberTagsByClientId(res.locals.clientId)
            .then(tags => this.json({ tags }, statuscodes.OK));
    }
    deleteLabel(req) {
        return this.memberTagsService.deleteMemberTag(req.params.id)
            .then(() => this.json({}, statuscodes.OK));
    }
    updateMemberTag(req) {
        return this.memberTagsService.updateMemberTag(req.params.id, req.body)
            .then(tag => this.json({ tag }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new member tag',
        parameters: {
            body: { description: 'New member tag', required: true, model: 'MemberTags' },
        },
        responses: {
            200: { model: 'MemberTags' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.CONTRACT_FULL]), 'isAuthenticated', 'isAuthorized', 'createMemberTagValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MemberTagsController.prototype, "createMemberTag", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/all',
        description: 'Get all member tags for the client',
        responses: {
            200: { model: 'MemberTags' },
            400: { description: 'Failed to get member tags' },
        },
    }),
    inversify_express_utils_1.httpGet('/all', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MemberTagsController.prototype, "getMemberTagsByClientId", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        path: '/{id}',
        description: 'Delete the member tag',
        parameters: {
            path: {
                id: {
                    description: 'Id of member tag',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to delete the member tag' },
        },
    }),
    inversify_express_utils_1.httpDelete('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.CONTRACT_FULL]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberTagsController.prototype, "deleteLabel", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        path: '/{id}',
        description: 'Update the member tag',
        parameters: {
            path: {
                id: {
                    description: 'Id of member tag',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
            body: { description: 'Member tag fields to update', model: 'MemberTags' },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.CONTRACT_FULL]), 'isAuthenticated', 'isAuthorized', 'updateMemberTagValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberTagsController.prototype, "updateMemberTag", null);
MemberTagsController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'MemberTags',
        path: '/member-tags',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/member-tags'),
    __param(0, inversify_1.inject('MemberTagsService')),
    __metadata("design:paramtypes", [memberTags_service_1.MemberTagsService])
], MemberTagsController);
exports.default = MemberTagsController;
//# sourceMappingURL=memberTags.controller.js.map