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
const apartment_service_1 = require("./../services/apartment.service");
const entity_1 = require("./../../domain/entity");
const auth_1 = require("./../middleware/auth");
const constants_1 = require("../../infrastructure/constants");
let ApartmentController = class ApartmentController extends inversify_express_utils_1.BaseHttpController {
    constructor(apartmentService) {
        super();
        this.apartmentService = apartmentService;
    }
    createApartment(req) {
        return Promise.resolve(entity_1.Apartment.generateApartment(req.body))
            .then(this.apartmentService.createApartment)
            .then(apartment => this.json({ apartment }, statuscodes.OK));
    }
    deleteApartment(req) {
        return this.apartmentService.deleteApartment(req.params.id)
            .then(() => this.json({}, statuscodes.OK));
    }
    updateApartment(req) {
        return this.apartmentService.updateApartment(req.params.id, req.body)
            .then(apartment => this.json({ apartment }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new apartment',
        parameters: {
            body: { description: 'New apartment', required: true, model: 'Apartment' },
        },
        responses: {
            200: { model: 'Apartment' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'createApartmentValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApartmentController.prototype, "createApartment", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: 'Delete the apartment',
        path: '/{id}',
        parameters: {
            path: {
                id: {
                    description: 'Id of apartment',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to delete the apartment' },
        },
    }),
    inversify_express_utils_1.httpDelete('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'deleteApartmentValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApartmentController.prototype, "deleteApartment", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the apartment',
        path: '/{id}',
        parameters: {
            body: { description: 'Apartment fields to update', model: 'Apartment' },
            path: {
                id: {
                    description: 'Id of apartment',
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
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'updateApartmentValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApartmentController.prototype, "updateApartment", null);
ApartmentController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Apartment',
        path: '/apartment',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/apartment'),
    __param(0, inversify_1.inject('ApartmentService')),
    __metadata("design:paramtypes", [apartment_service_1.ApartmentService])
], ApartmentController);
exports.default = ApartmentController;
//# sourceMappingURL=apartment.controller.js.map