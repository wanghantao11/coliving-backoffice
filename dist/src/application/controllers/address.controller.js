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
const address_service_1 = require("./../services/address.service");
const entity_1 = require("./../../domain/entity");
const auth_1 = require("./../middleware/auth");
const constants_1 = require("../../infrastructure/constants");
let AddressController = class AddressController extends inversify_express_utils_1.BaseHttpController {
    constructor(addressService) {
        super();
        this.addressService = addressService;
    }
    createAddress(req) {
        return Promise.resolve(entity_1.Address.generateAddress(req.body))
            .then(this.addressService.createAddress)
            .then(address => this.json({ address }, statuscodes.OK));
    }
    deleteAddress(req) {
        return this.addressService.deleteAddress(req.params.id)
            .then(() => this.json({}, statuscodes.OK));
    }
    updateAddress(req) {
        return this.addressService.updateAddress(req.params.id, req.body)
            .then(address => this.json({ address }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new address',
        parameters: {
            body: { description: 'New address', required: true, model: 'Address' },
        },
        responses: {
            200: { model: 'Address' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'createAddressValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AddressController.prototype, "createAddress", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: 'Delete the given address',
        path: '/{id}',
        parameters: {
            path: {
                id: {
                    description: 'Id of address',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'Address' },
            400: {},
        },
    }),
    inversify_express_utils_1.httpDelete('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'deleteAddressValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AddressController.prototype, "deleteAddress", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the given address',
        path: '/{id}',
        parameters: {
            path: {
                id: {
                    description: 'Id of address',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
            body: { description: 'Address fields to update', model: 'Address' },
        },
        responses: {
            200: { model: 'Address' },
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'updateAddressValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AddressController.prototype, "updateAddress", null);
AddressController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Address',
        path: '/address',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/address'),
    __param(0, inversify_1.inject('AddressService')),
    __metadata("design:paramtypes", [address_service_1.AddressService])
], AddressController);
exports.default = AddressController;
//# sourceMappingURL=address.controller.js.map