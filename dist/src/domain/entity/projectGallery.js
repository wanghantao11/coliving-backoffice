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
exports.ProjectGallery = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const project_1 = require("./project");
let ProjectGallery = class ProjectGallery {
    constructor(source, text, projectId) {
        this.source = source;
        this.text = text;
        this.project_id = projectId;
    }
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project gallery',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProjectGallery.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ProjectGallery.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], ProjectGallery.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => project_1.Project, project => project.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'project_id' }),
    __metadata("design:type", Number)
], ProjectGallery.prototype, "project", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project',
        example: 10,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'project_id', nullable: false }),
    __metadata("design:type", Number)
], ProjectGallery.prototype, "project_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Url of the project gallery',
        example: 'http://test.com/project-gallery-1.jpg',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], ProjectGallery.prototype, "source", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Text under the project gallery',
        example: 'The balcony overview',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProjectGallery.prototype, "text", void 0);
ProjectGallery = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Project Gallery entity',
        name: 'ProjectGallery',
    }),
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, String, Number])
], ProjectGallery);
exports.ProjectGallery = ProjectGallery;
//# sourceMappingURL=projectGallery.js.map