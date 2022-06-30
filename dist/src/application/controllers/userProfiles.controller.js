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
const userProfiles_service_1 = require("./../services/userProfiles.service");
let UserProfilesController = class UserProfilesController extends inversify_express_utils_1.BaseHttpController {
    constructor(userProfilesService) {
        super();
        this.userProfilesService = userProfilesService;
    }
    getUserProfile(req, res) {
        return this.userProfilesService.getUserProfile(res.locals.userId)
            .then(userProfile => this.json({ userProfile }, statuscodes.OK));
    }
    updateUserProfile(req, res) {
        return this.userProfilesService.updateUserProfile(res.locals.userId, req.body)
            .then(userProfile => this.json({ userProfile }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get the user profile',
        responses: {
            200: { model: 'UserProfiles' },
            400: { description: 'Failed to get the user profile' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserProfilesController.prototype, "getUserProfile", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the user profile',
        parameters: {
            body: { description: 'User profile fields to update', required: true, model: 'UserProfiles' },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'updateUserProfileValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserProfilesController.prototype, "updateUserProfile", null);
UserProfilesController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'UserProfiles',
        path: '/userProfiles',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/userProfiles'),
    __param(0, inversify_1.inject('UserProfilesService')),
    __metadata("design:paramtypes", [userProfiles_service_1.UserProfilesService])
], UserProfilesController);
exports.default = UserProfilesController;
//# sourceMappingURL=userProfiles.controller.js.map