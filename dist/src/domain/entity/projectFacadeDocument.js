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
var ProjectFacadeDocument_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFacadeDocument = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const projectFacade_1 = require("./projectFacade");
let ProjectFacadeDocument = ProjectFacadeDocument_1 = class ProjectFacadeDocument {
    // factory method
    static generateProjectFacadeDocument(doc) {
        const _doc = new ProjectFacadeDocument_1();
        Object.keys(doc).forEach(key => {
            _doc[key] = doc[key];
        });
        return Promise.resolve(_doc);
    }
};
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ProjectFacadeDocument.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], ProjectFacadeDocument.prototype, "updated_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project facade document',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProjectFacadeDocument.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'facade_id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], ProjectFacadeDocument.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project facade',
        example: 10,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'facade_id', nullable: false }),
    __metadata("design:type", Number)
], ProjectFacadeDocument.prototype, "facade_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Description of project facade document',
        example: 'Tenant handbook in English',
        required: true,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProjectFacadeDocument.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Title of project facade document',
        example: 'Handbook English',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], ProjectFacadeDocument.prototype, "title", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Path to the project facade document',
        example: 'http://test.com/handbook.pdf',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], ProjectFacadeDocument.prototype, "url", void 0);
ProjectFacadeDocument = ProjectFacadeDocument_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Project Facade Document entity',
        name: 'ProjectFacadeDocument',
    }),
    typeorm_1.Entity()
], ProjectFacadeDocument);
exports.ProjectFacadeDocument = ProjectFacadeDocument;
//# sourceMappingURL=projectFacadeDocument.js.map