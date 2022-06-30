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
var Contract_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("../../infrastructure/constants");
const projectFacade_1 = require("./projectFacade");
const room_1 = require("./room");
const user_1 = require("./user");
let Contract = Contract_1 = class Contract {
};
Contract.generateContract = (contract) => {
    const _contract = new Contract_1();
    Object.keys(contract).forEach(key => {
        _contract[key] = contract[key];
    });
    return Promise.resolve(_contract);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of contract',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Contract.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' }),
    __metadata("design:type", user_1.User)
], Contract.prototype, "user", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Id of member',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Contract.prototype, "iduser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'facade_id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], Contract.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The project facade id of the contract',
        example: 2,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'facade_id', nullable: false }),
    __metadata("design:type", Number)
], Contract.prototype, "facade_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => room_1.Room, room => room.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'room_id' }),
    __metadata("design:type", room_1.Room)
], Contract.prototype, "room", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The room id of the contract',
        example: 5,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'room_id', nullable: false }),
    __metadata("design:type", Number)
], Contract.prototype, "room_id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Contract.prototype, "external_id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Contract.prototype, "external_participant_id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Contract.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Contract.prototype, "updated_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The start date of the contract',
        example: '2020-01-01',
        required: false,
    }),
    typeorm_1.Column('date', { nullable: true }),
    __metadata("design:type", Date)
], Contract.prototype, "start_date", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The start date of the contract',
        example: '2020-01-01',
        required: false,
    }),
    typeorm_1.Column('date', { nullable: true }),
    __metadata("design:type", Date)
], Contract.prototype, "end_date", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The date the contract is rejected by candidate',
        example: '2020-01-01',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Contract.prototype, "rejected_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The date the contract is signed by candidate',
        example: '2020-01-01',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Contract.prototype, "signed_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The date the contract is activated by admin',
        example: '2020-01-01',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Contract.prototype, "activated_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The date the contract is terminated by admin',
        example: '2020-03-31',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Contract.prototype, "terminated_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The status of the contract',
        example: 'pending',
        required: true,
    }),
    typeorm_1.Column({ type: 'enum', enum: constants_1.CONTRACT_STATUS, default: constants_1.CONTRACT_STATUS.PENDING }),
    __metadata("design:type", String)
], Contract.prototype, "status", void 0);
Contract = Contract_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Contract entity',
        name: 'Contract',
    }),
    typeorm_1.Entity()
], Contract);
exports.Contract = Contract;
//# sourceMappingURL=contract.js.map