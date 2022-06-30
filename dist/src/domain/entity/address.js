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
var Address_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const projectFacade_1 = require("./projectFacade");
let Address = Address_1 = class Address {
};
// factory method
Address.generateAddress = (address) => {
    const _address = new Address_1();
    Object.keys(address).forEach(key => {
        _address[key] = address[key];
    });
    return Promise.resolve(_address);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of address',
        example: [1, 123],
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Address.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Address.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Address.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'facade_id' }),
    __metadata("design:type", Number)
], Address.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Facade id the address belong to',
        example: 10,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'facade_id', nullable: false }),
    __metadata("design:type", Number)
], Address.prototype, "facade_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'Careof of the address',
        type: 'string',
        example: 'William',
        required: false,
    }),
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "careof", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'City of the address',
        type: 'string',
        example: 'Stockholm',
        required: false,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'Country of the address',
        type: 'string',
        example: 'Sweden',
        required: false,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'Street of the address',
        type: 'string',
        example: 'Vasagatan 12',
        required: false,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Address.prototype, "street", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'Post code of the address',
        type: 'string',
        example: '19 110',
        required: false,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Address.prototype, "zip", void 0);
Address = Address_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Address entity',
        name: 'Address',
    }),
    typeorm_1.Entity()
], Address);
exports.Address = Address;
//# sourceMappingURL=address.js.map