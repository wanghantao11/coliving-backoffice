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
var UserPreferences_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferences = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("./../../infrastructure/constants");
const user_1 = require("./user");
let UserPreferences = UserPreferences_1 = class UserPreferences {
};
// factory method
UserPreferences.generateUserPreferences = (preferences) => {
    const _preferences = new UserPreferences_1();
    Object.keys(preferences).forEach(key => {
        _preferences[key] = preferences[key];
    });
    return Promise.resolve(_preferences);
};
__decorate([
    typeorm_1.OneToOne(() => user_1.User, user => user.preferences, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'iduser' }),
    __metadata("design:type", Number)
], UserPreferences.prototype, "user", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of user',
        example: 10,
        required: true,
    }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], UserPreferences.prototype, "iduser", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If user prefers single room',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserPreferences.prototype, "has_single_room", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If user prefers double room',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserPreferences.prototype, "has_double_room", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If user prefers private bathroom',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserPreferences.prototype, "has_private_bathroom", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If user prefers private toilet',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserPreferences.prototype, "has_private_toilet", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If user has selected a room type',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserPreferences.prototype, "has_room_type_preference", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If user prefers a room with handicapped favor',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserPreferences.prototype, "is_suitable_for_disability", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string[]',
        description: 'List of preferred locations of the user',
        example: ['10002', '10004', '10012'],
        required: false,
    }),
    typeorm_1.Column('character varying', { array: true, nullable: true }),
    __metadata("design:type", Array)
], UserPreferences.prototype, "locations", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The preferred earliest move-in date of the user',
        example: '2021-02-02',
        required: false,
    }),
    typeorm_1.Column({ nullable: true, type: 'date' }),
    __metadata("design:type", Date)
], UserPreferences.prototype, "move_in_date_from", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The preferred latest move-in date of the user',
        example: '2021-02-03',
        required: false,
    }),
    typeorm_1.Column({ nullable: true, type: 'date' }),
    __metadata("design:type", Date)
], UserPreferences.prototype, "move_in_date_to", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The preferred period of the stay',
        example: '2021-02-02',
        required: false,
    }),
    typeorm_1.Column('enum', { enum: constants_1.PERIOD_OF_STAY, default: constants_1.PERIOD_OF_STAY.NOT_SPECIFIED }),
    __metadata("design:type", String)
], UserPreferences.prototype, "period_of_stay", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The preferred lowest rent',
        example: 3000,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], UserPreferences.prototype, "rent_from", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The preferred highest rent',
        example: 10000,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], UserPreferences.prototype, "rent_to", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer[]',
        description: 'The list of preferred flatmates the user wants to live with',
        example: 3000,
        required: false,
    }),
    typeorm_1.Column('integer', { array: true, nullable: true }),
    __metadata("design:type", Array)
], UserPreferences.prototype, "roomies", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the user needs admin to contact back',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserPreferences.prototype, "needs_contact_back", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserPreferences.prototype, "needs_manual_offer", void 0);
UserPreferences = UserPreferences_1 = __decorate([
    typeorm_1.Unique(['iduser']),
    swagger_express_ts_1.ApiModel({
        description: 'User Preferences entity',
        name: 'UserPreferences',
    }),
    typeorm_1.Entity()
], UserPreferences);
exports.UserPreferences = UserPreferences;
//# sourceMappingURL=userPreferences.js.map