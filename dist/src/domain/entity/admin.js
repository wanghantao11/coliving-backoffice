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
var Admin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("./../../infrastructure/constants");
const client_1 = require("./client");
const role_1 = require("./role");
let Admin = Admin_1 = class Admin {
};
// factory method
Admin.generateAdmin = (admin) => {
    const _admin = new Admin_1();
    Object.keys(admin).forEach(key => {
        _admin[key] = admin[key];
    });
    return Promise.resolve(_admin);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of admin',
        example: 12,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Admin.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Admin.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Admin.prototype, "updated_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'First name of the admin',
        type: 'string',
        example: 'James',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Admin.prototype, "first_name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'Last name of the admin',
        type: 'string',
        example: 'Coliver',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Admin.prototype, "last_name", void 0);
__decorate([
    typeorm_1.Column({ default: 'sv', length: 2 }),
    __metadata("design:type", String)
], Admin.prototype, "language", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Client id the admin belongs to',
        example: 2,
        required: true,
    }),
    typeorm_1.ManyToOne(() => client_1.Client, client => client.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'client_id' }),
    __metadata("design:type", Number)
], Admin.prototype, "client_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        format: 'int64',
        description: 'Role id of the admin',
        example: 12,
        required: true,
    }),
    typeorm_1.ManyToOne(() => role_1.Role, role => role.id),
    typeorm_1.JoinColumn({ name: 'role_id' }),
    __metadata("design:type", Number)
], Admin.prototype, "role_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'Email of the admin',
        type: 'email',
        example: 'test@test.com',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Admin.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'Password of the admin',
        type: 'string',
        example: 'aI1f4W_d!j9',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer[]',
        description: 'List of project facade ids the admin has access to',
        example: [1, 10, 12],
        required: false,
    }),
    typeorm_1.Column('integer', { array: true, nullable: true }),
    __metadata("design:type", Array)
], Admin.prototype, "facade_ids", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'Url of the admin profile image',
        type: 'email',
        example: 'https://test.com/image_url.jpg',
        required: false,
    }),
    typeorm_1.Column({ default: constants_1.DEFAULT_PROFILE_IMAGE, length: 255 }),
    __metadata("design:type", String)
], Admin.prototype, "img_url", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: 'Type of the admin',
        type: 'string',
        example: ['default', 'admin'],
        required: false,
    }),
    typeorm_1.Column({ default: 'default' }),
    __metadata("design:type", String)
], Admin.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Admin.prototype, "verified", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], Admin.prototype, "verification_code", void 0);
Admin = Admin_1 = __decorate([
    typeorm_1.Unique(['email']),
    swagger_express_ts_1.ApiModel({
        description: 'Admin entity',
        name: 'Admin',
    }),
    typeorm_1.Entity()
], Admin);
exports.Admin = Admin;
//# sourceMappingURL=admin.js.map