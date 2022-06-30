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
exports.ContractTemplatesService = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const common_1 = require("../../infrastructure/utils/common");
const contract_1 = require("../../infrastructure/utils/contract");
let ContractTemplatesService = class ContractTemplatesService {
    constructor(contractTemplatesDao) {
        this.contractTemplatesDao = contractTemplatesDao;
        this.getCollections = () => contract_1.getCollections()
            .then(contract_1.parseCollections);
        this.updateContractTemplateByFacadeId = (facadeId, data) => this.contractTemplatesDao.updateContractTemplateBy({ facadeId }, data);
        this.getContractTemplateByCollectionId = (collectionId) => this.contractTemplatesDao.getContractTemplateBy({ collectionId })
            .then(template => !template ? contract_1.getTemplatesByCollectionId(collectionId)
            .then(contract_1.parseContractTemplates)
            .then(([{ template_group_id }]) => contract_1.getTemplateGroup(template_group_id)
            .then(contract_1.parseTemplateGroup)
            .then(contract_1.getDataFieldsSet)
            .then(common_1.getDataFromResponse)
            .then(contract_1.excludeSharedDataFields)
            .then(extraFields => ({ collection_id: collectionId, extra_fields: extraFields }))) : template);
        this.getContractTemplateByFacadeId = (facadeId) => this.contractTemplatesDao.getContractTemplateBy({ facadeId })
            .then(template => !template ?
            Promise.reject({
                message: 'NO_CONTENT',
                reason: `No contract template is found for project facade ${facadeId}`,
            }) : template);
    }
};
ContractTemplatesService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ContractTemplatesDao')),
    __metadata("design:paramtypes", [Object])
], ContractTemplatesService);
exports.ContractTemplatesService = ContractTemplatesService;
//# sourceMappingURL=contractTemplates.service.js.map