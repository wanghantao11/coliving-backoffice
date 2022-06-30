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
var UserProfiles_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfiles = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
let UserProfiles = UserProfiles_1 = class UserProfiles {
};
// factory method
UserProfiles.generateUserProfiles = (profiles) => {
    const _profiles = new UserProfiles_1();
    Object.keys(profiles).forEach(key => {
        _profiles[key] = profiles[key];
    });
    return Promise.resolve(_profiles);
};
__decorate([
    typeorm_1.OneToOne(() => user_1.User, user => user.userProfiles, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' }),
    __metadata("design:type", String)
], UserProfiles.prototype, "user", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of the user',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], UserProfiles.prototype, "iduser", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer[]',
        description: 'List of interest ids of the user',
        example: [1, 2, 6, 7, 12],
        required: false,
    }),
    typeorm_1.Column('integer', { array: true, nullable: true }),
    __metadata("design:type", Array)
], UserProfiles.prototype, "interest_ids", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Displayed name of the user',
        example: 'Captain Cook',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], UserProfiles.prototype, "display_name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Hometown of the user',
        example: 'Malmö',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], UserProfiles.prototype, "hometown", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'occupation of the user',
        example: 'Engineer',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], UserProfiles.prototype, "occupation", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string[]',
        description: 'Schools of the user',
        example: ['Stockholm Gymnasium', 'Harvard', 'MIT'],
        required: false,
    }),
    typeorm_1.Column('character varying', { array: true, nullable: true }),
    __metadata("design:type", Array)
], UserProfiles.prototype, "schools", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Food preference of the user',
        example: 'pescatarian',
        required: false,
    }),
    typeorm_1.Column({ length: 50, nullable: true }),
    __metadata("design:type", String)
], UserProfiles.prototype, "food_preference", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the user is allergic to gluten',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserProfiles.prototype, "gluten_intolerent", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the user is allergic to wheat',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserProfiles.prototype, "wheat_intolerent", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the user is allergic to lactose',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserProfiles.prototype, "lactose_intolerent", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the user is allergic to milk',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserProfiles.prototype, "allergic_to_milk", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the user is allergic to egg',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserProfiles.prototype, "allergic_to_egg", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the user is allergic to shellfish',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserProfiles.prototype, "allergic_to_shellfish", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the user is allergic to fish',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserProfiles.prototype, "allergic_to_fish", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the user is allergic to nuts',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserProfiles.prototype, "allergic_to_nuts", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'json',
        description: 'Fun facts of the user',
        example: '{"1": "Love to paint the house", "2": "Afraid of height"}',
        required: false,
    }),
    typeorm_1.Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], UserProfiles.prototype, "fun_facts", void 0);
UserProfiles = UserProfiles_1 = __decorate([
    typeorm_1.Unique(['iduser']),
    swagger_express_ts_1.ApiModel({
        description: 'User Profiles entity',
        name: 'UserProfiles',
    }),
    typeorm_1.Entity()
], UserProfiles);
exports.UserProfiles = UserProfiles;
//# sourceMappingURL=userProfiles.js.map