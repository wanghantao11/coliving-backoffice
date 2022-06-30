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
const admin_1 = require("./../../domain/entity/admin");
const constants_1 = require("./../../infrastructure/constants");
const admin_2 = require("./../firebase/admin");
const auth_1 = require("./../middleware/auth");
const admin_service_1 = require("./../services/admin.service");
let AdminController = class AdminController extends inversify_express_utils_1.BaseHttpController {
    constructor(adminService) {
        super();
        this.adminService = adminService;
    }
    createAdmin(req, res) {
        return admin_1.Admin.generateAdmin(Object.assign(Object.assign({}, req.body), { client_id: res.locals.clientId }))
            .then(this.adminService.createAdmin)
            .then(admin => this.adminService
            .sendVerificationEmail(admin.email)
            .then(code => this.adminService.setCodeByEmail(admin.email, code))
            .then(() => this.json({ admin }, statuscodes.OK)));
    }
    getAdmin(req, res) {
        return this.adminService.getAdminById(res.locals.userId)
            .then(admin => this.json({ admin }, statuscodes.OK));
    }
    sendResetpasswordEmail(req) {
        return this.adminService.sendForgotPasswordEmail(req.body.email)
            .then(code => this.adminService.setCodeByEmail(req.body.email, code))
            .then(() => this.json({}, statuscodes.OK));
    }
    login(req) {
        const { email, password } = req.body;
        return this.adminService.login(email, password)
            .then(token => this.json({ token }, statuscodes.OK));
    }
    setPasswordById(req) {
        return this.adminService
            .setPasswordById(req.body.id, req.body.password)
            .then(() => this.json({}, statuscodes.OK));
    }
    verifyCode(req) {
        return this.adminService
            .verify(req.body.verificationCode)
            .then(id => this.json({ id }, statuscodes.OK));
    }
    resendVerificationEmail(req) {
        return this.adminService.sendVerificationEmail(req.body.email)
            .then(code => this.adminService.setCodeByEmail(req.body.email, code));
    }
    updateAdminById(req) {
        return this.adminService.updateAdminById(req.params.id, req.body)
            .then(() => this.json({}, statuscodes.OK));
    }
    uploadAdminProfileImage(req) {
        return admin_2.uploadImage(req.body.img, req.params.id)
            .then(res => this.json(res, statuscodes.OK));
    }
    deleteAdmin(req) {
        return this.adminService.deleteAdmin(req.params.id)
            .then(() => this.json({}, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new admin user',
        parameters: {
            body: { description: 'New admin user', required: true, model: 'Admin' },
        },
        responses: {
            200: { model: 'Admin' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ADMIN_FULL]), 'isAuthenticated', 'isAuthorized', 'createAdminValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createAdmin", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get the admin user',
        responses: {
            200: { model: 'Admin' },
            400: { description: 'Failed to get the admin user' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ADMIN_FULL, constants_1.ADMIN_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAdmin", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/forgot-password',
        description: 'Send the reset-password email for the admin user',
        parameters: {
            body: { name: 'email', description: 'The email of the admin user', required: true },
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
], AdminController.prototype, "sendResetpasswordEmail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/login',
        description: 'Login to backoffice for the admin user',
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
            200: { model: 'Admin' },
            400: { description: 'Failed to login' },
        },
    }),
    inversify_express_utils_1.httpPost('/login', 'loginAdminValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "login", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/setPassword',
        description: 'Set the new password for the admin user',
        parameters: {
            body: {
                properties: {
                    id: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER, required: true },
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
    inversify_express_utils_1.httpPost('/setPassword', 'setAdminPasswordValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "setPasswordById", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/verify',
        description: 'Verify the one-time code for resetting admin password',
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
    inversify_express_utils_1.httpPost('/verify', 'verifyCodeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifyCode", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/verify/resend',
        description: 'Resend the verification email',
        parameters: {
            body: { name: 'email', description: 'The email of the admin user', required: true },
        },
        responses: {
            200: { model: 'Admin' },
            400: { description: 'Failed to create' },
        },
    }),
    inversify_express_utils_1.httpPost('/verify/resend', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ADMIN_FULL]), 'isAuthenticated', 'isAuthorized', 'resendEmailValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "resendVerificationEmail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the admin user',
        path: '/{id}',
        parameters: {
            body: { description: 'Admin fields to update', model: 'Admin' },
            path: {
                id: {
                    description: 'Id of admin user',
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
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ADMIN_FULL]), 'isAuthenticated', 'isAuthorized', 'updateAdminValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateAdminById", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the admin user profile image',
        path: '/{id}/profile/image',
        parameters: {
            body: { name: 'img', description: 'The url of the admin profile image', required: true },
            path: {
                id: {
                    description: 'Id of admin user',
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
    inversify_express_utils_1.httpPut('/:id/profile/image', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), 'isAuthenticated', 'updateAdminImageValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "uploadAdminProfileImage", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: 'Delete the admin user',
        path: '/{id}',
        parameters: {
            path: {
                id: {
                    description: 'Id of admin user',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to delete the admin user' },
        },
    }),
    inversify_express_utils_1.httpDelete('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ADMIN_FULL]), 'isAuthenticated', 'isAuthorized', 'deleteAdminValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteAdmin", null);
AdminController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Admin',
        path: '/admin',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/admin'),
    __param(0, inversify_1.inject('AdminService')),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
exports.default = AdminController;
//# sourceMappingURL=admin.controller.js.map