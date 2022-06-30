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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("./../../infrastructure/constants");
const application_1 = require("./application");
const client_1 = require("./client");
const userPreferences_1 = require("./userPreferences");
const userProfiles_1 = require("./userProfiles");
let User = User_1 = class User {
};
// factory method
User.generateUser = (user) => {
    const _user = new User_1();
    Object.keys(user).forEach(key => {
        _user[key] = user[key];
    });
    return Promise.resolve(_user);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of user',
        example: 10,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "user_key", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'External id of the user',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.Column({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "iduser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => client_1.Client, client => client.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'client_id' }),
    __metadata("design:type", client_1.Client)
], User.prototype, "client", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of the client the user belongs to',
        example: 1,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], User.prototype, "client_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'Registration time of the user',
        example: '2020-09-01 16:17:28.4161',
        required: false,
    }),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "registration_time", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Email of the user',
        example: 'email@test.com',
        required: true,
    }),
    typeorm_1.Column({ length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Password of the user',
        example: 'aI1f4W_d!j9',
        required: true,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'First name of the user',
        example: 'James',
        required: true,
    }),
    typeorm_1.Column({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Last name of the user',
        example: 'Coliver',
        required: true,
    }),
    typeorm_1.Column({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'Birthday of the user',
        example: '1995-02-02',
        required: false,
    }),
    typeorm_1.Column('date', { nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "birthday", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Url of the profile image of the user',
        example: 'http://test.com/profile-image.jpg',
        required: true,
    }),
    typeorm_1.Column({ length: 255, default: constants_1.DEFAULT_PROFILE_IMAGE }),
    __metadata("design:type", String)
], User.prototype, "img_url", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Self-introduction of the user',
        example: 'Hi, I am James and 28 years old. I love sports and reading.',
        required: false,
    }),
    typeorm_1.Column('text', { default: '' }),
    __metadata("design:type", String)
], User.prototype, "description", void 0);
__decorate([
    typeorm_1.Column('numeric'),
    __metadata("design:type", Number)
], User.prototype, "tos_version_accepted", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Type of the user',
        example: 'Tenant',
        required: false,
    }),
    typeorm_1.Column({ length: 45, nullable: true, default: constants_1.USER_TYPE.LIGHT }),
    __metadata("design:type", String)
], User.prototype, "user_type", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Phone number of the user',
        example: '+46711111111',
        required: false,
    }),
    typeorm_1.Column({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the user has completed the roomie test',
        example: 'true',
        required: true,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_test_complete", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], User.prototype, "verification_code", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Gender of the user',
        example: 'Male',
        required: false,
    }),
    typeorm_1.Column({ default: 'secret' }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    typeorm_1.OneToMany(() => application_1.Application, application => application.user),
    __metadata("design:type", application_1.Application)
], User.prototype, "application", void 0);
__decorate([
    typeorm_1.OneToOne(() => userPreferences_1.UserPreferences, preferences => preferences.user),
    __metadata("design:type", userPreferences_1.UserPreferences)
], User.prototype, "preferences", void 0);
__decorate([
    typeorm_1.OneToOne(() => userProfiles_1.UserProfiles, userProfiles => userProfiles.user),
    __metadata("design:type", userProfiles_1.UserProfiles)
], User.prototype, "userProfiles", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'User preferred language',
        example: 'sv',
        required: false,
    }),
    typeorm_1.Column({ default: 'sv', length: 2 }),
    __metadata("design:type", String)
], User.prototype, "language", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "is_verified", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "stripe_customer_id", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "stripe_has_saved_card", void 0);
User = User_1 = __decorate([
    typeorm_1.Unique(['email']),
    typeorm_1.Unique(['iduser']),
    swagger_express_ts_1.ApiModel({
        description: 'User entity',
        name: 'User',
    }),
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=user.js.map