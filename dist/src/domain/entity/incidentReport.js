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
var IncidentReport_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentReport = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("../../infrastructure/constants");
const admin_1 = require("./admin");
const client_1 = require("./client");
const projectFacade_1 = require("./projectFacade");
let IncidentReport = IncidentReport_1 = class IncidentReport {
};
// factory method
IncidentReport.generateIncidentReport = (incidentReport) => {
    const _incidentReport = new IncidentReport_1();
    Object.keys(incidentReport).forEach(key => {
        _incidentReport[key] = incidentReport[key];
    });
    return Promise.resolve(_incidentReport);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of incident report',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], IncidentReport.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], IncidentReport.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], IncidentReport.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => client_1.Client, client => client.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'client_id' }),
    __metadata("design:type", client_1.Client)
], IncidentReport.prototype, "client", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of the client the incident report belongs to',
        example: 1,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], IncidentReport.prototype, "client_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'facade_id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], IncidentReport.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of the project facade the incident report belongs to',
        example: 1,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'facade_id', nullable: false }),
    __metadata("design:type", Number)
], IncidentReport.prototype, "facade_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Title of the incident report',
        example: 1,
        required: true,
    }),
    typeorm_1.Column({ length: 200 }),
    __metadata("design:type", String)
], IncidentReport.prototype, "title", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The date when the incident report is closed or declined',
        example: '2021-02-02',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], IncidentReport.prototype, "closed_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The reason the incident report gets declined',
        example: 'The problem does not exist',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], IncidentReport.prototype, "decline_reason", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The description of the incident report',
        example: 'The window of the kitchen is broken',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], IncidentReport.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The estimated date when the incident report will be completed',
        example: '2021-02-02',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], IncidentReport.prototype, "estimated_done_date", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The feedback from the reporter',
        example: 'It is nicely fixed in time. Thank you!',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], IncidentReport.prototype, "feedback", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The Location of the incident report',
        example: 'building',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], IncidentReport.prototype, "location", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the incident report can be seen by other tenants',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], IncidentReport.prototype, "is_private", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The category of the incident report',
        example: 'property',
        required: false,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], IncidentReport.prototype, "category", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The subcategory of the incident report',
        example: 'electronics',
        required: false,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], IncidentReport.prototype, "subcategory", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string[]',
        description: 'The urls of photos of the incident report',
        example: '["https://test.com/incident_report_photo1.jpg", "https://test.com/incident_report_photo2.jpg"]',
        required: false,
    }),
    typeorm_1.Column('text', { array: true, nullable: true }),
    __metadata("design:type", Array)
], IncidentReport.prototype, "photos", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The comment from the owner of the incident report',
        example: 'Need to contact the plumber',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], IncidentReport.prototype, "owner_comment", void 0);
__decorate([
    typeorm_1.ManyToOne(() => admin_1.Admin, admin => admin.id, { nullable: false }),
    typeorm_1.JoinColumn({ name: 'owner_id' }),
    __metadata("design:type", admin_1.Admin)
], IncidentReport.prototype, "owner", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The id of the owner of the incident report',
        example: 12,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], IncidentReport.prototype, "owner_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The priority of the incident report',
        example: 'EMERGENCY',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], IncidentReport.prototype, "priority", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The id of the reporter of the incident report',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], IncidentReport.prototype, "reporter_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The satisfaction level of the reporter',
        example: 'happy',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], IncidentReport.prototype, "satisfaction_level", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The status of the incident report',
        example: 'In_progress',
        required: true,
    }),
    typeorm_1.Column({ type: 'enum', enum: constants_1.INCIDENT_REPORT_STATUS, default: constants_1.INCIDENT_REPORT_STATUS.CREATED }),
    __metadata("design:type", String)
], IncidentReport.prototype, "status", void 0);
IncidentReport = IncidentReport_1 = __decorate([
    typeorm_1.Unique(['facade_id', 'title']),
    swagger_express_ts_1.ApiModel({
        description: 'Incident Report entity',
        name: 'IncidentReport',
    }),
    typeorm_1.Entity()
], IncidentReport);
exports.IncidentReport = IncidentReport;
//# sourceMappingURL=incidentReport.js.map