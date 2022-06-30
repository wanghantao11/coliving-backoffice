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
var UserPreferredRoommates_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferredRoommates = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("../../infrastructure/constants");
const user_1 = require("./user");
let UserPreferredRoommates = UserPreferredRoommates_1 = class UserPreferredRoommates {
};
// factory method
UserPreferredRoommates.generateUserPreferredRoomate = (userPreferredRoommates) => {
    const _userPreferredRoommates = new UserPreferredRoommates_1();
    Object.keys(userPreferredRoommates).forEach(key => {
        _userPreferredRoommates[key] = userPreferredRoommates[key];
    });
    return Promise.resolve(_userPreferredRoommates);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of user preferred roommate',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserPreferredRoommates.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'inviter_id', referencedColumnName: 'iduser' }),
    __metadata("design:type", user_1.User)
], UserPreferredRoommates.prototype, "inviter", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Id of the inviter',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.Column({ length: 255 }),
    __metadata("design:type", String)
], UserPreferredRoommates.prototype, "inviter_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'invitee_id', referencedColumnName: 'iduser' }),
    __metadata("design:type", user_1.User)
], UserPreferredRoommates.prototype, "invitee", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Id of the invitee',
        example: '69596i7e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.Column({ length: 255 }),
    __metadata("design:type", String)
], UserPreferredRoommates.prototype, "invitee_id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], UserPreferredRoommates.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], UserPreferredRoommates.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], UserPreferredRoommates.prototype, "invitation_code", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Status of the invitation',
        example: 'Accepted',
        required: true,
    }),
    typeorm_1.Column({
        type: 'enum',
        enum: constants_1.PREFERRED_ROOMMATES_STATUS,
        default: constants_1.PREFERRED_ROOMMATES_STATUS.PENDING,
    }),
    __metadata("design:type", String)
], UserPreferredRoommates.prototype, "status", void 0);
UserPreferredRoommates = UserPreferredRoommates_1 = __decorate([
    typeorm_1.Unique(['inviter_id', 'invitee_id']),
    typeorm_1.Check('"inviter_id" != "invitee_id"'),
    swagger_express_ts_1.ApiModel({
        description: 'User Preferred Roommates entity',
        name: 'UserPreferredRoommates',
    }),
    typeorm_1.Entity()
], UserPreferredRoommates);
exports.UserPreferredRoommates = UserPreferredRoommates;
//# sourceMappingURL=userPreferredRoommates.js.map