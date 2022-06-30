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
var Apartment_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Apartment = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const projectFacade_1 = require("./projectFacade");
let Apartment = Apartment_1 = class Apartment {
};
// factory method
Apartment.generateApartment = (apartment) => {
    const _apartment = new Apartment_1();
    Object.keys(apartment).forEach(key => {
        _apartment[key] = apartment[key];
    });
    return _apartment;
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of apartment',
        example: [1, 123],
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Apartment.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Apartment.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Apartment.prototype, "updated_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The name of the apartment',
        example: 'Lgh 2, våning 8',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Apartment.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'facade_id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], Apartment.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The project facade id the apartment belongs to',
        example: 10,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'facade_id', nullable: false }),
    __metadata("design:type", Number)
], Apartment.prototype, "facade_id", void 0);
Apartment = Apartment_1 = __decorate([
    typeorm_1.Unique(['facade_id', 'name']),
    swagger_express_ts_1.ApiModel({
        description: 'Apartment entity',
        name: 'Apartment',
    }),
    typeorm_1.Entity()
], Apartment);
exports.Apartment = Apartment;
//# sourceMappingURL=apartment.js.map