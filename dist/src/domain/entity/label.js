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
var Label_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Label = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const projectFacade_1 = require("./projectFacade");
let Label = Label_1 = class Label {
};
// factory method
Label.generateLabel = (label) => {
    const _label = new Label_1();
    Object.keys(label).forEach(key => {
        _label[key] = label[key];
    });
    return _label;
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of label',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Label.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Label.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Label.prototype, "updated_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Name of the label',
        example: 1,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Label.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'facade_id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], Label.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Project facade id of the label',
        example: 1,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'facade_id', nullable: false }),
    __metadata("design:type", Number)
], Label.prototype, "facade_id", void 0);
Label = Label_1 = __decorate([
    typeorm_1.Unique(['facade_id', 'name']),
    swagger_express_ts_1.ApiModel({
        description: 'Label entity',
        name: 'Label',
    }),
    typeorm_1.Entity()
], Label);
exports.Label = Label;
//# sourceMappingURL=label.js.map