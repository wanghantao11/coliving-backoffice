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
var ProjectFacadeBilling_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFacadeBilling = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const client_1 = require("./client");
const projectFacade_1 = require("./projectFacade");
let ProjectFacadeBilling = ProjectFacadeBilling_1 = class ProjectFacadeBilling {
    // factory method
    static generateProjectFacadeBilling(billing) {
        const _billing = new ProjectFacadeBilling_1();
        Object.keys(billing).forEach(key => {
            _billing[key] = billing[key];
        });
        return Promise.resolve(_billing);
    }
};
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ProjectFacadeBilling.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], ProjectFacadeBilling.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.OneToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'facade_id', referencedColumnName: 'id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], ProjectFacadeBilling.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project facade',
        example: 10,
        required: true,
    }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], ProjectFacadeBilling.prototype, "facade_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => client_1.Client, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'client_id', referencedColumnName: 'id' }),
    __metadata("design:type", client_1.Client)
], ProjectFacadeBilling.prototype, "client", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of client',
        example: 1,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ProjectFacadeBilling.prototype, "client_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Bankgiro number of the project facade',
        example: '5050-5050',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ProjectFacadeBilling.prototype, "bankgiro_no", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The number of the deposit for the project facade',
        example: 3000,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ProjectFacadeBilling.prototype, "deposit", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The number of weeks the deposit is refund.',
        example: 3,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ProjectFacadeBilling.prototype, "deposit_refund_weeks", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The numebr in percentage of how much the yearly rent increases.',
        example: 5,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ProjectFacadeBilling.prototype, "rent_yearly_increase_rate", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The date when the yearly rent increases.',
        example: '12-31',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProjectFacadeBilling.prototype, "rent_yearly_increase_date", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The day of the month when rent is due to pay.',
        example: 15,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ProjectFacadeBilling.prototype, "rent_day_of_month", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The day of the month when service fee is due to pay.',
        example: 15,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ProjectFacadeBilling.prototype, "service_fee_day_of_month", void 0);
ProjectFacadeBilling = ProjectFacadeBilling_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Project Facade Billing entity',
        name: 'ProjectFacadeBilling',
    }),
    typeorm_1.Entity()
], ProjectFacadeBilling);
exports.ProjectFacadeBilling = ProjectFacadeBilling;
//# sourceMappingURL=projectFacadeBilling.js.map