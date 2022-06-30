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
var Project_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("../../infrastructure/constants");
const projectFacade_1 = require("./projectFacade");
let Project = Project_1 = class Project {
    // factory method
    static generateProject(project) {
        const _project = new Project_1();
        Object.keys(project).forEach(key => {
            _project[key] = project[key];
        });
        return Promise.resolve(_project);
    }
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Project.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Project.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.OneToOne(() => projectFacade_1.ProjectFacade, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'facade_id', referencedColumnName: 'id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], Project.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project facade',
        example: 10,
        required: true,
    }),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", Number)
], Project.prototype, "facade_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of client',
        example: 1,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Project.prototype, "client_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Location description of the project',
        example: 'The project is located in the center of the city, only 5 minutes from the metro station by walk.',
        required: false,
    }),
    typeorm_1.Column({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Project.prototype, "about_location", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Project.prototype, "about_location_en", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'General description of the project',
        example: 'The project contains 5 buildings with totally 220 flats.',
        required: false,
    }),
    typeorm_1.Column({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Project.prototype, "about_project", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Project.prototype, "about_project_en", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Other information description of the project',
        example: 'Smoking and pets are not allowed in the flats.',
        required: false,
    }),
    typeorm_1.Column({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Project.prototype, "about_other_info", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Project.prototype, "about_other_info_en", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The total number of apartments in the project',
        example: 20,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "apartments", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The city of the project',
        example: 'Stockholm',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "city", void 0);
__decorate([
    typeorm_1.Column('varchar', { array: true, length: 100, nullable: true }),
    __metadata("design:type", Array)
], Project.prototype, "community_features", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The country of the project',
        example: 'Sweden',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "country", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Url of the cover image of the project',
        example: 'http://test.com/cover-image.jpg',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "cover_image_source", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Text under the cover image of the project',
        example: 'The kitchen corner',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "cover_image_text", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Distance to the public transport of the project',
        example: '100m-500m',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "distance_to_public_transport", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Url of the floor map image of the project',
        example: 'http://test.com/floor-map.jpg',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "floor_map_source", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Text under the floor map of the project',
        example: 'The floor map of room A',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "floor_map_text", void 0);
__decorate([
    typeorm_1.Column('varchar', { array: true, nullable: true }),
    __metadata("design:type", Array)
], Project.prototype, "key_features", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'Move-in date of the project',
        example: '2021-02-02',
        required: false,
    }),
    typeorm_1.Column({ nullable: true, type: 'date' }),
    __metadata("design:type", Date)
], Project.prototype, "move_in_date", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Name of the project',
        example: 'Lab',
        required: true,
    }),
    typeorm_1.Column({ length: 100, unique: true }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the project is published',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Project.prototype, "is_published", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Project.prototype, "published_at", void 0);
__decorate([
    typeorm_1.Column('varchar', { array: true, nullable: true }),
    __metadata("design:type", Array)
], Project.prototype, "room_features", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Lowest rent of the project',
        example: 2000,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "room_rent_from", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Highest rent of the project',
        example: 5000,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "room_rent_to", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Lowest room size of the project',
        example: 12,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "room_size_from", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Highest room size of the project',
        example: 100,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "room_size_to", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Lowest number of flatmates of the project',
        example: 2,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "roomies_from", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Highest number of flatmates of the project',
        example: 20,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "roomies_to", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Service fee of the project',
        example: 1500,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "service_fee", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Lowest shared area size of the project',
        example: 50,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "shared_area_size_from", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Highest number of flatmates of the project',
        example: 150,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "shared_area_size_to", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Status of the project',
        example: 'occupied',
        required: false,
    }),
    typeorm_1.Column({ type: 'enum', enum: constants_1.PROJECT_STATUS, default: constants_1.PROJECT_STATUS.DEFAULT }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Street address of the project',
        example: 'Vasagatan 12',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "street", void 0);
__decorate([
    typeorm_1.Column('varchar', { array: true, nullable: true }),
    __metadata("design:type", Array)
], Project.prototype, "third_party_services", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Postal code of the project',
        example: '19111',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "zip", void 0);
Project = Project_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Project entity',
        name: 'Project',
    }),
    typeorm_1.Entity()
], Project);
exports.Project = Project;
//# sourceMappingURL=project.js.map