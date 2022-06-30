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
const contract_service_1 = require("./../services/contract.service");
let ContractController = class ContractController extends inversify_express_utils_1.BaseHttpController {
    constructor(contractService) {
        super();
        this.contractService = contractService;
    }
    createContract(req, res) {
        const { roomId } = req.body;
        const { userId } = res.locals;
        return this.contractService.createContract(roomId, userId)
            .then(contracts => this.json({ contracts }, statuscodes.OK));
    }
    getContractsForAdmin(req) {
        return this.contractService.getContractsByIduser(req.query.iduser)
            .then(contracts => this.json({ contracts }, statuscodes.OK));
    }
    getContracts(req, res) {
        const { userId } = res.locals;
        return this.contractService.getContractsByIduser(userId)
            .then(contracts => this.json({ contracts }, statuscodes.OK));
    }
    getContractPdf(req, res) {
        return this.contractService.getContractPdf(req.params.externalId)
            .then(data => {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=contract.pdf',
            });
            return res.end(data);
        });
    }
    updateContractById(req) {
        return this.contractService.updateContractById(req.params.id, req.body)
            .then(contract => this.json({ contract }, statuscodes.OK));
    }
    deleteContract(req) {
        return this.contractService.deleteContract(req.query.id)
            .then(() => this.json({}, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new contract',
        parameters: {
            body: { description: 'New contract', required: true, model: 'Contract' },
        },
        responses: {
            200: { model: 'Contract' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized', 'createContractValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "createContract", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/admin',
        description: 'Get all contracts of the member by admin',
        parameters: {
            query: {
                iduser: {
                    description: 'Id of the member',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'Contract' },
            400: { description: 'Failed to get contracts' },
        },
    }),
    inversify_express_utils_1.httpGet('/admin', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ]), 'isAuthenticated', 'isAuthorized', 'getContractsByIduserValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "getContractsForAdmin", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/',
        description: 'Get all contracts of the member by the member himself',
        responses: {
            200: { model: 'Contract' },
            400: { description: 'Failed to get contracts' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "getContracts", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/pdf/{externalId}',
        description: 'Get pdf file of the contract',
        parameters: {
            path: {
                externalId: {
                    description: 'External Id of the contract',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'Contract' },
            400: { description: 'Failed to get pdf of the contract' },
        },
    }),
    inversify_express_utils_1.httpGet('/pdf/:externalId', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ]), 'isAuthenticated', 'isAuthorized', 'getContractPdfValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "getContractPdf", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the contract by the admin user',
        path: '/{id}',
        parameters: {
            body: { description: 'Contract fields to update', required: true, model: 'Contract' },
            path: {
                id: {
                    description: 'Id of contract',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CONTRACT_FULL]), 'isAuthenticated', 'isAuthorized', 'updateContractByIdValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "updateContractById", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: 'Delete the contract',
        parameters: {
            query: {
                id: {
                    description: 'Id of contract',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to delete the contract' },
        },
    }),
    inversify_express_utils_1.httpDelete('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CONTRACT_FULL]), 'isAuthenticated', 'isAuthorized', 'deleteContractValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "deleteContract", null);
ContractController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Contract',
        path: '/contract',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/contract'),
    __param(0, inversify_1.inject('ContractService')),
    __metadata("design:paramtypes", [contract_service_1.ContractService])
], ContractController);
exports.default = ContractController;
//# sourceMappingURL=contract.controller.js.map