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
var ContractTemplates_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractTemplates = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const client_1 = require("./client");
const projectFacade_1 = require("./projectFacade");
let ContractTemplates = ContractTemplates_1 = class ContractTemplates {
    // factory method
    static generateContractTemplates(template) {
        const _template = new ContractTemplates_1();
        Object.keys(template).forEach(key => {
            _template[key] = template[key];
        });
        return Promise.resolve(_template);
    }
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of the contract template',
        example: 12,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ContractTemplates.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ContractTemplates.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], ContractTemplates.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.OneToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, {
        primary: true,
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn({ name: 'facade_id', referencedColumnName: 'id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], ContractTemplates.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Project facade id the contract template belongs to',
        example: 12,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ContractTemplates.prototype, "facade_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => client_1.Client, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'client_id', referencedColumnName: 'id' }),
    __metadata("design:type", client_1.Client)
], ContractTemplates.prototype, "client", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Client id the contract template belongs to',
        example: 2,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ContractTemplates.prototype, "client_id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ContractTemplates.prototype, "collection_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'json',
        description: 'Extra fields the contract template has other than the default fields',
        example: '{lost_key_fee: "", termination_notice: ""}',
        required: false,
    }),
    typeorm_1.Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ContractTemplates.prototype, "extra_fields", void 0);
ContractTemplates = ContractTemplates_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Contract Templates entity',
        name: 'ContractTemplates',
    }),
    typeorm_1.Entity()
], ContractTemplates);
exports.ContractTemplates = ContractTemplates;
//# sourceMappingURL=contractTemplates.js.map