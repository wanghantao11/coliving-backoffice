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
exports.AdminMemberNotes = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
let AdminMemberNotes = class AdminMemberNotes {
};
__decorate([
    typeorm_1.OneToOne(() => user_1.User, user => user.iduser, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' }),
    __metadata("design:type", String)
], AdminMemberNotes.prototype, "user", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'member id',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], AdminMemberNotes.prototype, "iduser", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'admin notes for the member',
        example: 'Call the member tomorrow.',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], AdminMemberNotes.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'interger[]',
        description: 'admin tags for the member',
        example: [1, 22, 24],
        required: false,
    }),
    typeorm_1.Column('integer', { array: true, nullable: true }),
    __metadata("design:type", Array)
], AdminMemberNotes.prototype, "tag_ids", void 0);
AdminMemberNotes = __decorate([
    typeorm_1.Unique(['iduser']),
    swagger_express_ts_1.ApiModel({
        description: 'Admin member notes entity',
        name: 'AdminMemberNotes',
    }),
    typeorm_1.Entity()
], AdminMemberNotes);
exports.AdminMemberNotes = AdminMemberNotes;
//# sourceMappingURL=adminMemberNotes.js.map