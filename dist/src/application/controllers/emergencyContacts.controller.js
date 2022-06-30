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
const emergencyContacts_service_1 = require("./../services/emergencyContacts.service");
let EmergencyContactsController = class EmergencyContactsController extends inversify_express_utils_1.BaseHttpController {
    constructor(emergencyContactsService) {
        super();
        this.emergencyContactsService = emergencyContactsService;
    }
    createEmergencyContact(req, res) {
        return this.emergencyContactsService.createContact(res.locals.userId, req.body)
            .then(contact => this.json({ contact }, statuscodes.OK));
    }
    getEmergencyContacts(req, res) {
        return this.emergencyContactsService.getContacts(res.locals.userId)
            .then(contacts => this.json({ contacts }, statuscodes.OK));
    }
    updateEmergencyContact(req) {
        return this.emergencyContactsService.updateContact(req.query.id, req.body)
            .then(contact => this.json({ contact }, statuscodes.OK));
    }
    deleteEmergencyContact(req) {
        return this.emergencyContactsService.deleteContact(req.query.id)
            .then(() => this.json({}, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new emergency contact',
        parameters: {
            body: { description: 'New emergency contact', required: true, model: 'EmergencyContacts' },
        },
        responses: {
            200: { model: 'EmergencyContacts' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'createEmergencyContactValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EmergencyContactsController.prototype, "createEmergencyContact", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get all emergency contacts for the tenant',
        responses: {
            200: { model: 'EmergencyContacts' },
            400: { description: 'Failed to get the emergency contacts' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EmergencyContactsController.prototype, "getEmergencyContacts", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the emergency contract for the tenant',
        parameters: {
            body: { description: 'Emergency contact fields to update', model: 'EmergencyContacts' },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'updateEmergencyContactValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmergencyContactsController.prototype, "updateEmergencyContact", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: 'Delete the emergency contact',
        parameters: {
            query: {
                id: {
                    description: 'Id of emergency contact',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to delete the emergency contact' },
        },
    }),
    inversify_express_utils_1.httpDelete('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmergencyContactsController.prototype, "deleteEmergencyContact", null);
EmergencyContactsController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'EmergencyContacts',
        path: '/emergencyContacts',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/emergencyContacts'),
    __param(0, inversify_1.inject('EmergencyContactsService')),
    __metadata("design:paramtypes", [emergencyContacts_service_1.EmergencyContactsService])
], EmergencyContactsController);
exports.default = EmergencyContactsController;
//# sourceMappingURL=emergencyContacts.controller.js.map