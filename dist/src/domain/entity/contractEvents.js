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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractEvents = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
let ContractEvents = class ContractEvents {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of contract event',
        example: 12,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ContractEvents.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Id of member',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ContractEvents.prototype, "iduser", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Type of the contract event',
        example: 'contract_signed',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], ContractEvents.prototype, "type", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Project facade id of the contract event',
        example: 2,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ContractEvents.prototype, "facade_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'json',
        description: 'Data of the contract event',
        example: '{contracts: [{id: 61, iduser: "7259687e-6458-4859-97ff-3e3b1p2ad837", status: "Signed", room_id: 10, facade_id: 2, start_date: "2020-09-01"}]}',
        required: false,
    }),
    typeorm_1.Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ContractEvents.prototype, "data", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'json',
        description: 'Log of the contract event',
        required: false,
    }),
    typeorm_1.Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ContractEvents.prototype, "log", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ContractEvents.prototype, "created_at", void 0);
ContractEvents = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Contract Events entity',
        name: 'ContractEvents',
    }),
    typeorm_1.Entity()
], ContractEvents);
exports.ContractEvents = ContractEvents;
//# sourceMappingURL=contractEvents.js.map