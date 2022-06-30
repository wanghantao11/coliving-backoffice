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
const contractTemplates_service_1 = require("../services/contractTemplates.service");
let ContractTemplatesController = class ContractTemplatesController extends inversify_express_utils_1.BaseHttpController {
    constructor(contractTemplatesService) {
        super();
        this.contractTemplatesService = contractTemplatesService;
    }
    getCollections() {
        return this.contractTemplatesService.getCollections()
            .then(collections => this.json({ collections }, statuscodes.OK));
    }
    getContractTemplateByCollectionId(req) {
        return this.contractTemplatesService.getContractTemplateByCollectionId(Number(req.params.collectionId))
            .then(template => this.json({ template }, statuscodes.OK));
    }
    getContractTemplateByFacadeId(req) {
        return this.contractTemplatesService.getContractTemplateByFacadeId(Number(req.params.facadeId))
            .then(template => this.json({ template }, statuscodes.OK));
    }
    updateContractTemplateByFacadeId(req) {
        return this.contractTemplatesService.updateContractTemplateByFacadeId(Number(req.params.facadeId), req.body)
            .then(template => this.json({ template }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/collections',
        description: 'Get all contract templates collections',
        responses: {
            200: { model: 'ContractTemplates' },
            400: { description: 'Failed to get contract templates' },
        },
    }),
    inversify_express_utils_1.httpGet('/collections', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "getCollections", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/collection/{collectionId}',
        description: 'Get the contract template by the collection id',
        parameters: {
            path: {
                collectionId: {
                    description: 'Contract collection id',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'ContractTemplates' },
            400: { description: 'Failed to get the contract template' },
        },
    }),
    inversify_express_utils_1.httpGet('/collection/:collectionId', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ]), 'isAuthenticated', 'isAuthorized', 'getContractTemplateByCollectionIdValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "getContractTemplateByCollectionId", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/template/{facadeId}',
        description: 'Get the contract template by the project facade id',
        parameters: {
            path: {
                facadeId: {
                    description: 'Project facade id',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'ContractTemplates' },
            400: { description: 'Failed to get the contract template' },
        },
    }),
    inversify_express_utils_1.httpGet('/template/:facadeId', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ]), 'isAuthenticated', 'isAuthorized', 'getContractTemplateByFacadeIdValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "getContractTemplateByFacadeId", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the contract template by the given project facade id',
        path: '/template/{facadeId}',
        parameters: {
            body: { description: 'Contract template fields to update', model: 'ContractTemplates' },
            path: {
                facadeId: {
                    description: 'Id of project facade',
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
    inversify_express_utils_1.httpPut('/template/:facadeId', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CONTRACT_FULL]), 'isAuthenticated', 'isAuthorized', 'updateContractTemplateByFacadeIdValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "updateContractTemplateByFacadeId", null);
ContractTemplatesController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'ContractTemplates',
        path: '/contract-templates',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/contract-templates'),
    __param(0, inversify_1.inject('ContractTemplatesService')),
    __metadata("design:paramtypes", [contractTemplates_service_1.ContractTemplatesService])
], ContractTemplatesController);
exports.default = ContractTemplatesController;
//# sourceMappingURL=contractTemplates.controller.js.map