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
var Role_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const client_1 = require("./client");
let Role = Role_1 = class Role {
};
// factory method
Role.generateRole = (role) => {
    const _role = new Role_1();
    Object.keys(role).forEach(key => {
        _role[key] = role[key];
    });
    return Promise.resolve(_role);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of role',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Role.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Role.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Role.prototype, "updated_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of client',
        example: 1,
        required: true,
    }),
    typeorm_1.ManyToOne(() => client_1.Client, client => client.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'client_id' }),
    __metadata("design:type", Number)
], Role.prototype, "client_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Name of the role',
        example: 'project_manager',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer[]',
        description: 'scopes for the role',
        example: [2, 3, 4, 8, 9],
        required: true,
    }),
    typeorm_1.Column('integer', { array: true, nullable: true }),
    __metadata("design:type", Array)
], Role.prototype, "scopes", void 0);
Role = Role_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Role entity',
        name: 'Role',
    }),
    typeorm_1.Entity()
], Role);
exports.Role = Role;
//# sourceMappingURL=role.js.map