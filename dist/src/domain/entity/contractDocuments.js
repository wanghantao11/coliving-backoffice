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
var ContractDocuments_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractDocuments = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("../../infrastructure/constants");
const contract_1 = require("./contract");
let ContractDocuments = ContractDocuments_1 = class ContractDocuments {
    // factory method
    static generateContractTemplates(document) {
        const _document = new ContractDocuments_1();
        Object.keys(document).forEach(key => {
            _document[key] = document[key];
        });
        return Promise.resolve(_document);
    }
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of the contract document',
        example: 12,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ContractDocuments.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ContractDocuments.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], ContractDocuments.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => contract_1.Contract, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'contract_id', referencedColumnName: 'id' }),
    __metadata("design:type", contract_1.Contract)
], ContractDocuments.prototype, "contract", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Contract id the contract document belongs to',
        example: 2,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ContractDocuments.prototype, "contract_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Url of the contract document',
        example: 'http://test.com/document-1.jpg',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], ContractDocuments.prototype, "source", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Type of the contract document',
        example: '',
        required: true,
    }),
    typeorm_1.Column({ type: 'enum', enum: constants_1.CONTRACT_DOCUMENT_TYPE }),
    __metadata("design:type", String)
], ContractDocuments.prototype, "type", void 0);
ContractDocuments = ContractDocuments_1 = __decorate([
    typeorm_1.Unique(['contract_id', 'type']),
    swagger_express_ts_1.ApiModel({
        description: 'Contract Documents entity',
        name: 'ContractDocuments',
    }),
    typeorm_1.Entity()
], ContractDocuments);
exports.ContractDocuments = ContractDocuments;
//# sourceMappingURL=contractDocuments.js.map