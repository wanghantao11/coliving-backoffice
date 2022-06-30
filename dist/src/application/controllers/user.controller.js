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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const statuscodes = require("http-status-codes");
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const swagger_express_ts_1 = require("swagger-express-ts");
const constants_1 = require("./../../infrastructure/constants");
const common_1 = require("./../../infrastructure/utils/common");
const user_1 = require("./../firebase/user");
const auth_1 = require("./../middleware/auth");
const user_service_1 = require("./../services/user.service");
const service_1 = require("../../application/auth/jwt/service");
let UserController = class UserController extends inversify_express_utils_1.BaseHttpController {
    constructor(userService) {
        super();
        this.userService = userService;
    }
    createUser(req) {
        return Promise.resolve(req.body)
            .then((_a) => {
            var { password, email } = _a, rest = __rest(_a, ["password", "email"]);
            return common_1.hashPassword(password)
                .then(hashedPassword => (Object.assign({ password: hashedPassword, email: common_1.formatEmail(email) }, rest)));
        })
            .then(this.userService.createUser)
            .then(() => this.json({}, statuscodes.OK));
    }
    updateUser(req, res) {
        return this.userService.updateUserByExternalId(res.locals.userId, req.body)
            .then(user => this.json({ user }, statuscodes.OK));
    }
    deleteUser(req, res) {
        return this.userService
            .deleteUserByExternalId(res.locals.userId)
            .then(() => this.json({}, statuscodes.OK));
    }
    findUser(req, res) {
        return this.userService
            .findMeByExternalId(res.locals.userId)
            .then(res => this.json(res, statuscodes.OK));
    }
    userLogin(req) {
        return this.userService.login(req.body.email, req.body.password)
            .then(token => this.json({ token }, statuscodes.OK));
    }
    getGuestToken() {
        return service_1.signInGuest(constants_1.GUEST)
            .then(token => this.json({ token }, statuscodes.OK));
    }
    getUserCount(req, res) {
        return this.userService
            .getUserCount(res.locals.userId, req.query)
            .then(res => this.json(res, statuscodes.OK));
    }
    getOtherUsers(req, res) {
        return this.userService
            .getOtherUsers(res.locals.userId, req.query)
            .then(res => this.json(res, statuscodes.OK));
    }
    findOtherUser(req) {
        return this.userService
            .findUserByExternalId(req.params.iduser)
            .then(user => this.json({ user }, statuscodes.OK));
    }
    uploadUserProfileImage(req, res) {
        return user_1.uploadImage(req.body.img, res.locals.userId)
            .then(res => this.json(res, statuscodes.OK));
    }
    sendResetpasswordEmail(req) {
        return this.userService.sendVerificationEmail(req.body.email)
            .then(code => this.userService.setCodeByEmail(req.body.email, code))
            .then(() => this.json({}, statuscodes.OK));
    }
    verifyCode(req) {
        return this.userService.verify(req.body.verificationCode)
            .then(id => this.json({ id }, statuscodes.OK));
    }
    setPasswordById(req) {
        return this.userService
            .setPasswordById(req.body.iduser, req.body.password)
            .then(() => this.json({}, statuscodes.OK));
    }
    setRoomieTestStartedTagOnMailchimp(req, res) {
        return this.userService.setRoomieTestStartedTagOnMailchimp(res.locals.userId)
            .then(() => this.json({}, statuscodes.OK));
    }
    sendPinCode(req) {
        const { email } = req.body;
        return this.userService.sendPincode(email)
            .then(() => this.json({}, statuscodes.OK));
    }
    verifyPinCode(req) {
        const { email, code } = req.body;
        return this.userService.verifyPincode(email, code)
            .then(() => this.json({}, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new user and his profile and preferences',
        parameters: {
            body: { description: 'New user', required: true, model: 'User' },
        },
        responses: {
            200: {},
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.generateId, 'createUserValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createUser", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the user',
        parameters: {
            body: { description: 'User fields to update', required: true, model: 'User' },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'updateUserValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUser", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: 'Delete the user',
        parameters: {},
        responses: {
            200: {},
            400: { description: 'Failed to delete the user' },
        },
    }),
    inversify_express_utils_1.httpDelete('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUser", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get the user',
        responses: {
            200: { model: 'User' },
            400: { description: 'Failed to get the user' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findUser", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/login',
        description: 'Login to community site for the user',
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
    inversify_express_utils_1.httpPost('/login', 'loginUserValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "userLogin", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/guest-token',
        description: 'Get the guest token',
        responses: {
            200: {},
            400: { description: 'Failed to get the guest token' },
        },
    }),
    inversify_express_utils_1.httpGet('/guest-token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getGuestToken", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/count',
        description: 'Count the user',
        responses: {
            200: {},
            400: { description: 'Failed to get the user count' },
        },
    }),
    inversify_express_utils_1.httpGet('/count', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT, constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.USER_FULL, constants_1.USER_READ]), 'isAuthenticated', 'isAuthorized', 'getOtherUserCountValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserCount", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/others',
        description: 'Get other users',
        responses: {
            200: {},
            400: { description: 'Failed to get the other users' },
        },
    }),
    inversify_express_utils_1.httpGet('/others', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'getOtherUsersValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getOtherUsers", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{iduser}',
        description: 'Get other users for the given user',
        parameters: {
            path: {
                iduser: {
                    description: 'Id of the user',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get the other users' },
        },
    }),
    inversify_express_utils_1.httpGet('/:iduser', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'findOtherUserValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOtherUser", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Upload the user profile image',
        path: '/profile/image',
        parameters: {
            body: { name: 'img', description: 'The url of the user profile image', required: true },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/profile/image', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'uploadUserProfileImageValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "uploadUserProfileImage", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/forgot-password',
        description: 'Send the reset-password email for the user',
        parameters: {
            body: { name: 'email', description: 'The email of the user', required: true },
        },
        responses: {
            200: {},
            400: { description: 'Failed to send the email' },
        },
    }),
    inversify_express_utils_1.httpPost('/forgot-password', 'forgotPasswordValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "sendResetpasswordEmail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/verify',
        description: 'Verify the one-time code for resetting user password',
        parameters: {
            body: {
                properties: {
                    verificationCode: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
                },
                required: true,
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to verify the one-time code' },
        },
    }),
    inversify_express_utils_1.httpPost('/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "verifyCode", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/set-password',
        description: 'Set the new password for the user',
        parameters: {
            body: {
                properties: {
                    iduser: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
                    password: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
                },
                required: true,
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to set the new password' },
        },
    }),
    inversify_express_utils_1.httpPost('/set-password', 'setPasswordValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "setPasswordById", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/roomie-test-started',
        description: 'Set the roomie test started tag on mailchimp',
        parameters: {},
        responses: {
            200: {},
            400: { description: 'Failed to set the mailchimp tag' },
        },
    }),
    inversify_express_utils_1.httpPost('/roomie-test-started', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "setRoomieTestStartedTagOnMailchimp", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/pin-code/send',
        description: 'Send the pin code for new user registration',
        parameters: {
            body: {
                name: 'email',
                description: 'Email address of the user',
                type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to send the pin code' },
        },
    }),
    inversify_express_utils_1.httpPost('/pin-code/send', auth_1.AuthMiddleware.isVerifiedCaptcha, 'sendPinCodeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "sendPinCode", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/pin-code/verify',
        description: 'Verify the pin code for the new user',
        parameters: {
            body: {
                properties: {
                    email: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
                    code: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
                },
                required: true,
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to verify the pin code' },
        },
    }),
    inversify_express_utils_1.httpPost('/pin-code/verify', 'verifyPinCodeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "verifyPinCode", null);
UserController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'User',
        path: '/user',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/user'),
    __param(0, inversify_1.inject('UserService')),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map