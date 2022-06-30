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
exports.EmergencyContacts = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("./../../infrastructure/constants");
const user_1 = require("./user");
let EmergencyContacts = class EmergencyContacts {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], EmergencyContacts.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' }),
    __metadata("design:type", user_1.User)
], EmergencyContacts.prototype, "user", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Id of member',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], EmergencyContacts.prototype, "iduser", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Name of the emergency contact',
        example: 'Victor',
        required: true,
    }),
    typeorm_1.Column({ length: 100 }),
    __metadata("design:type", String)
], EmergencyContacts.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Url of profile image of the emergency contact',
        example: 'https://test.com/image_url.jpg',
        required: false,
    }),
    typeorm_1.Column({ length: 255, default: constants_1.DEFAULT_PROFILE_IMAGE }),
    __metadata("design:type", String)
], EmergencyContacts.prototype, "image", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Phone number of the emergency contact',
        example: '+46 71111111',
        required: true,
    }),
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], EmergencyContacts.prototype, "phone", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Relation of the emergency contact to the member',
        example: 'parent',
        required: true,
    }),
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], EmergencyContacts.prototype, "relation", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], EmergencyContacts.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], EmergencyContacts.prototype, "updated_at", void 0);
EmergencyContacts = __decorate([
    typeorm_1.Unique(['iduser', 'phone']),
    swagger_express_ts_1.ApiModel({
        description: 'Emergency Contacts entity',
        name: 'EmergencyContacts',
    }),
    typeorm_1.Entity()
], EmergencyContacts);
exports.EmergencyContacts = EmergencyContacts;
//# sourceMappingURL=emergencyContacts.js.map