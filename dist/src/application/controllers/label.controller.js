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
const label_service_1 = require("./../services/label.service");
const entity_1 = require("./../../domain/entity");
const auth_1 = require("./../middleware/auth");
const constants_1 = require("../../infrastructure/constants");
let LabelController = class LabelController extends inversify_express_utils_1.BaseHttpController {
    constructor(labelService) {
        super();
        this.labelService = labelService;
    }
    createLabel(req) {
        return Promise.resolve(entity_1.Label.generateLabel(req.body))
            .then(this.labelService.createLabel)
            .then(label => this.json({ label }, statuscodes.OK));
    }
    deleteLabel(req) {
        return this.labelService.deleteLabel(req.params.id)
            .then(() => this.json({}, statuscodes.OK));
    }
    updateLabel(req) {
        return this.labelService.updateLabel(req.params.id, req.body)
            .then(label => this.json({ label }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new label',
        parameters: {
            body: { description: 'New label', required: true, model: 'Label' },
        },
        responses: {
            200: { model: 'Label' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'createLabelValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LabelController.prototype, "createLabel", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        path: '/{id}',
        description: 'Delete the label',
        parameters: {
            path: {
                id: {
                    description: 'Id of label',
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
    inversify_express_utils_1.httpDelete('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LabelController.prototype, "deleteLabel", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        path: '/{id}',
        description: 'Update the emergency contract for the tenant',
        parameters: {
            path: {
                id: {
                    description: 'Id of label',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
            body: { description: 'Label fields to update', model: 'Label' },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'updateLabelValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LabelController.prototype, "updateLabel", null);
LabelController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Label',
        path: '/label',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/label'),
    __param(0, inversify_1.inject('LabelService')),
    __metadata("design:paramtypes", [label_service_1.LabelService])
], LabelController);
exports.default = LabelController;
//# sourceMappingURL=label.controller.js.map