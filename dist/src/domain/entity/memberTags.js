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
var MemberTags_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberTags = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const client_1 = require("./client");
let MemberTags = MemberTags_1 = class MemberTags {
};
// factory method
MemberTags.generateMemberTags = (tag) => {
    const _tag = new MemberTags_1();
    Object.keys(tag).forEach(key => {
        _tag[key] = tag[key];
    });
    return _tag;
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of member tag',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MemberTags.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of the client the member tag belongs to',
        example: 2,
        required: true,
    }),
    typeorm_1.ManyToOne(() => client_1.Client, client => client.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'client_id' }),
    __metadata("design:type", Number)
], MemberTags.prototype, "client_id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], MemberTags.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], MemberTags.prototype, "updated_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'name of the member tag',
        example: 'Contacted candidate',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], MemberTags.prototype, "name", void 0);
MemberTags = MemberTags_1 = __decorate([
    typeorm_1.Unique(['name']),
    swagger_express_ts_1.ApiModel({
        description: 'MemberTags entity',
        name: 'MemberTags',
    }),
    typeorm_1.Entity()
], MemberTags);
exports.MemberTags = MemberTags;
//# sourceMappingURL=memberTags.js.map