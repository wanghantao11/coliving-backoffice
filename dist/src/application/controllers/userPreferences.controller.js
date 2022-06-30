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
const userPreferences_service_1 = require("./../services/userPreferences.service");
let UserPreferencesController = class UserPreferencesController extends inversify_express_utils_1.BaseHttpController {
    constructor(userPreferencesService) {
        super();
        this.userPreferencesService = userPreferencesService;
    }
    getUserPreferences(req, res) {
        return this.userPreferencesService.getUserPreferences(res.locals.userId)
            .then(userPreferences => this.json({ userPreferences }, statuscodes.OK));
    }
    updateUserPreferences(req, res) {
        return this.userPreferencesService.updateUserPreferences(res.locals.userId, req.body)
            .then(userPreferences => this.json({ userPreferences }, statuscodes.OK));
    }
    /**
     * POST /userPreferences/preferred-roommate/send
     *
     * @name sendInvitation
     * @param req
     * ```
     * req.body.email
     * req.body.img_url
     * req.body.first_name
     * ```
     * @param res res.locals.userId
     */
    sendInvitation(req, res) {
        const { img_url, first_name, email } = req.body;
        return this.userPreferencesService.sendInvitation({ img_url, first_name, iduser: res.locals.userId }, email)
            .then(invitation => this.json({ invitation }, statuscodes.OK));
    }
    /**
     * POST /userPreferences/preferred-roommate/reply
     *
     * @name replyInvitation
     * @param req
     * ```
     * req.body.inviter_id
     * req.body.invitee_id
     * req.body.status
     * req.body.invitation_code
     * ```
     */
    replyInvitation(req) {
        return this.userPreferencesService.replyInvitation(req.body)
            .then(() => this.json({}, statuscodes.OK));
    }
    /**
     * DELETE /userPreferences/preferred-roommate/:id
     *
     * @param req req.params.id
     */
    deletePreferredRoommate(req) {
        return this.userPreferencesService.deletePreferredRoommate(Number(req.params.id))
            .then(() => this.json({}, statuscodes.OK));
    }
    /**
     * GET /userPreferences/preferred-roommate/
     *
     * @param res res.locals.userId
     */
    getPreferredRoommate(req, res) {
        return this.userPreferencesService.getPreferredRoommate(res.locals.userId)
            .then(preferredRoommate => this.json({ preferredRoommate }, statuscodes.OK));
    }
    /**
     * POST /userPreferences/preferred-roommate/connect
     * Connect to another (shadow) user as roommate in double-room flow
     *
     * @param req req.body
     * @param res res.locals.userId
     */
    connectPreferredRoommate(req, res) {
        return this.userPreferencesService.connectPreferredRoommate(res.locals.userId, req.body)
            .then(() => this.json({}, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get the user preferences',
        responses: {
            200: { model: 'UserPreferences' },
            400: { description: 'Failed to get the user preferences' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserPreferencesController.prototype, "getUserPreferences", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the user preferences',
        parameters: {
            body: { description: 'User preferences fields to update', required: true, model: 'UserPreferences' },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'updateUserPreferencesValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserPreferencesController.prototype, "updateUserPreferences", null);
__decorate([
    inversify_express_utils_1.httpPost('/preferred-roommate/send', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized', 'sendInvitationValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserPreferencesController.prototype, "sendInvitation", null);
__decorate([
    inversify_express_utils_1.httpPost('/preferred-roommate/reply', 'replyInvitationValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserPreferencesController.prototype, "replyInvitation", null);
__decorate([
    inversify_express_utils_1.httpDelete('/preferred-roommate/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized', 'deletePreferredRoommateValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserPreferencesController.prototype, "deletePreferredRoommate", null);
__decorate([
    inversify_express_utils_1.httpGet('/preferred-roommate/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserPreferencesController.prototype, "getPreferredRoommate", null);
__decorate([
    inversify_express_utils_1.httpPost('/preferred-roommate/connect', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized', 'connectPreferredRoommateValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserPreferencesController.prototype, "connectPreferredRoommate", null);
UserPreferencesController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'UserPreferences',
        path: '/userPreferences',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/userPreferences'),
    __param(0, inversify_1.inject('UserPreferencesService')),
    __metadata("design:paramtypes", [userPreferences_service_1.UserPreferencesService])
], UserPreferencesController);
exports.default = UserPreferencesController;
//# sourceMappingURL=userPreferences.controller.js.map