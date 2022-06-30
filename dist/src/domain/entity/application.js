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
exports.Application = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const _1 = require("./");
let Application = class Application {
    constructor(iduser, facadeId, clientId) {
        this.iduser = iduser;
        this.facade_id = facadeId;
        this.client_id = clientId;
    }
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of application',
        example: [1, 123],
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Application.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => _1.User, user => user.application, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' }),
    __metadata("design:type", String)
], Application.prototype, "user", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Id of member',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Application.prototype, "iduser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => _1.ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'facade_id' }),
    __metadata("design:type", _1.ProjectFacade)
], Application.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project facade',
        example: 10,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'facade_id', nullable: false }),
    __metadata("design:type", Number)
], Application.prototype, "facade_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => _1.Client, client => client.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'client_id' }),
    __metadata("design:type", _1.Client)
], Application.prototype, "client", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of client',
        example: 1,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'client_id', nullable: false }),
    __metadata("design:type", Number)
], Application.prototype, "client_id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Application.prototype, "created_at", void 0);
Application = __decorate([
    typeorm_1.Unique(['iduser', 'facade_id']),
    swagger_express_ts_1.ApiModel({
        description: 'Application entity',
        name: 'Application',
    }),
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, Number, Number])
], Application);
exports.Application = Application;
//# sourceMappingURL=application.js.map