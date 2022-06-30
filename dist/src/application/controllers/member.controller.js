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
const member_service_1 = require("./../services/member.service");
let MemberController = class MemberController extends inversify_express_utils_1.BaseHttpController {
    constructor(memberService) {
        super();
        this.memberService = memberService;
    }
    getMember(req) {
        return this.memberService.getMember(req.params.iduser)
            .then(member => this.json({ member }, statuscodes.OK));
    }
    getMemberNotes(req) {
        return this.memberService.getMemberNotes(req.params.iduser)
            .then(notes => this.json({ notes }, statuscodes.OK));
    }
    getMemberPreferences(req) {
        return this.memberService.getMemberPreferences(req.params.iduser)
            .then(preferences => this.json({ preferences }, statuscodes.OK));
    }
    getMemberProfile(req) {
        return this.memberService.getMemberProfile(req.params.iduser)
            .then(profile => this.json({ profile }, statuscodes.OK));
    }
    getMemberSubscriptions(req) {
        return this.memberService.getMemberSubscriptions(req.params.iduser)
            .then(subscriptions => this.json({ subscriptions }, statuscodes.OK));
    }
    getMemberWishedRoomies(req) {
        return this.memberService.getMemberWishedRoomies(req.params.iduser)
            .then(roomies => this.json({ roomies }, statuscodes.OK));
    }
    createMemberNotes(req) {
        return this.memberService.createMemberNotes(req.body)
            .then(notes => this.json({ notes }, statuscodes.OK));
    }
    updateMemberNotes(req) {
        return this.memberService.updateMemberNotes(req.params.iduser, req.body)
            .then(notes => this.json({ notes }, statuscodes.OK));
    }
    approveMemberToTenant(req) {
        return this.memberService.approveMemberToTenant(req.params.iduser)
            .then(member => this.json({ member }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{iduser}',
        description: 'Get the given member',
        parameters: {
            path: {
                iduser: {
                    description: 'Id of member',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'User' },
            400: { description: 'Failed to get the member' },
        },
    }),
    inversify_express_utils_1.httpGet('/:iduser', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getMemberValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "getMember", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{iduser}/notes',
        description: 'Get the given member notes',
        parameters: {
            path: {
                iduser: {
                    description: 'Id of member',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'AdminMemberNotes' },
            400: { description: 'Failed to get the member notes' },
        },
    }),
    inversify_express_utils_1.httpGet('/:iduser/notes', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getMemberNotesValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "getMemberNotes", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{iduser}/preferences',
        description: 'Get the given member preferences',
        parameters: {
            path: {
                iduser: {
                    description: 'Id of member',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'UserPreferences' },
            400: { description: 'Failed to get the member preferences' },
        },
    }),
    inversify_express_utils_1.httpGet('/:iduser/preferences', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getMemberPreferencesValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "getMemberPreferences", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{iduser}/profile',
        description: 'Get the given member profile',
        parameters: {
            path: {
                iduser: {
                    description: 'Id of member',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'UserProfiles' },
            400: { description: 'Failed to get the member profiles' },
        },
    }),
    inversify_express_utils_1.httpGet('/:iduser/profile', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getMemberProfileValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "getMemberProfile", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{iduser}/subscriptions',
        description: 'Get the given member subscriptions',
        parameters: {
            path: {
                iduser: {
                    description: 'Id of member',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'Application' },
            400: { description: 'Failed to get the member subscriptions' },
        },
    }),
    inversify_express_utils_1.httpGet('/:iduser/subscriptions', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getMemberSubscriptionsValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "getMemberSubscriptions", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{iduser}/wished-roomies',
        description: 'Get the given member wished roomies',
        parameters: {
            path: {
                iduser: {
                    description: 'Id of member',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get the member wished roomies' },
        },
    }),
    inversify_express_utils_1.httpGet('/:iduser/wished-roomies', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getMemberWishedRoomiesValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "getMemberWishedRoomies", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/notes',
        description: 'Create a member note',
        parameters: {
            body: { description: 'New member note', required: true, model: 'AdminMemberNotes' },
        },
        responses: {
            200: { model: 'AdminMemberNotes' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/notes', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'createMemberNotesValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "createMemberNotes", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        path: '/{iduser}/notes',
        description: 'Update the member note',
        parameters: {
            path: {
                id: {
                    description: 'Id of member',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
            body: { description: 'Member note fields to update', model: 'AdminMemberNotes' },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/:iduser/notes', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'updateMemberNotesValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "updateMemberNotes", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/{iduser}/approve',
        description: 'Approve the member',
        parameters: {
            path: {
                id: {
                    description: 'Id of member',
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
    inversify_express_utils_1.httpPost('/:iduser/approve', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberController.prototype, "approveMemberToTenant", null);
MemberController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Member',
        path: '/member',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/member'),
    __param(0, inversify_1.inject('MemberService')),
    __metadata("design:paramtypes", [member_service_1.MemberService])
], MemberController);
exports.default = MemberController;
//# sourceMappingURL=member.controller.js.map