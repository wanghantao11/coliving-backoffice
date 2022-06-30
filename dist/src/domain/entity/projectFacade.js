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
var ProjectFacade_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFacade = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const client_1 = require("./client");
let ProjectFacade = ProjectFacade_1 = class ProjectFacade {
    // factory method
    static generateProjectFacade(facade) {
        const _facade = new ProjectFacade_1();
        Object.keys(facade).forEach(key => {
            _facade[key] = facade[key];
        });
        return Promise.resolve(_facade);
    }
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project facade',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProjectFacade.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ProjectFacade.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], ProjectFacade.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => client_1.Client, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'client_id', referencedColumnName: 'id' }),
    __metadata("design:type", client_1.Client)
], ProjectFacade.prototype, "client", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of client',
        example: 1,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ProjectFacade.prototype, "client_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Name of the project facade',
        example: 'Lab',
        required: true,
    }),
    typeorm_1.Column({ length: 100, unique: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Address of the project facade',
        example: 'Vasagatan 12',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Url of the cover image of the project facade',
        example: 'http://test.com/cover-image.jpg',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "cover_image_source", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Text under the cover image of the project facade',
        example: 'Kitchen corner',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "cover_image_text", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Postal area of the project facade',
        example: 'Stockholm',
        required: false,
    }),
    typeorm_1.Column({ length: 250 }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "post_area", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the project facade is published',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], ProjectFacade.prototype, "published", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'Date when the project facade is published',
        example: '2021-02-02',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], ProjectFacade.prototype, "published_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Landlord name of the project facade',
        example: 'PEAB AB',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "landlord_name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Landlord email address of the project facade',
        example: 'landlord@test.com',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "landlord_email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Landlord orgnization number of the project facade',
        example: '8888-888',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "landlord_org_no", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Landlord street address of the project facade',
        example: 'Vasagatan 12',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "landlord_street", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Landlord postal code of the project facade',
        example: '19111',
        required: false,
    }),
    typeorm_1.Column({ length: 50, nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "landlord_zip", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Landlord postal area of the project facade',
        example: 'Stockholm',
        required: false,
    }),
    typeorm_1.Column({ length: 50, nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "landlord_post_area", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Unit designation of the project facade',
        example: '5851 Colive',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "property_unit_designation", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Coliving hub name of the project facade',
        example: 'Colive 1 AB',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ProjectFacade.prototype, "coliving_hub", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'Is offer flow automatic',
        example: false,
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], ProjectFacade.prototype, "is_auto_offer_flow", void 0);
ProjectFacade = ProjectFacade_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Project Facade entity',
        name: 'ProjectFacade',
    }),
    typeorm_1.Entity()
], ProjectFacade);
exports.ProjectFacade = ProjectFacade;
//# sourceMappingURL=projectFacade.js.map