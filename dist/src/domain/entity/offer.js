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
var Offer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offer = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const room_1 = require("../../infrastructure/constants/room");
const projectFacade_1 = require("./projectFacade");
const room_2 = require("./room");
const user_1 = require("./user");
let Offer = Offer_1 = class Offer {
};
// factory method
Offer.generateOffer = (offer) => {
    const _offer = new Offer_1();
    Object.keys(offer).forEach(key => {
        _offer[key] = offer[key];
    });
    return Promise.resolve(_offer);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of offer',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Offer.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Offer.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Offer.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' }),
    __metadata("design:type", user_1.User)
], Offer.prototype, "user", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Id of member',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Offer.prototype, "iduser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'facade_id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], Offer.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of the project facade',
        example: 1,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'facade_id', nullable: false }),
    __metadata("design:type", Number)
], Offer.prototype, "facade_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => room_2.Room, room => room.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'room_id' }),
    __metadata("design:type", room_2.Room)
], Offer.prototype, "room", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of the room of the offer',
        example: 1,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'room_id', nullable: false }),
    __metadata("design:type", Number)
], Offer.prototype, "room_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'status of offer',
        example: 'Accepted',
        required: true,
    }),
    typeorm_1.Column({ type: 'enum', enum: room_1.OFFER_STATUS, default: room_1.OFFER_STATUS.PENDING }),
    __metadata("design:type", String)
], Offer.prototype, "status", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Offer.prototype, "is_preferences_matched", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the offer is sent by admin',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Offer.prototype, "is_sent_by_admin", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The matching score of the user when getting this offer',
        example: '78.82',
        required: false,
    }),
    typeorm_1.Column('float', { nullable: true }),
    __metadata("design:type", Number)
], Offer.prototype, "matching_score", void 0);
Offer = Offer_1 = __decorate([
    typeorm_1.Unique(['iduser', 'room_id']),
    swagger_express_ts_1.ApiModel({
        description: 'Offer entity',
        name: 'Offer',
    }),
    typeorm_1.Entity()
], Offer);
exports.Offer = Offer;
//# sourceMappingURL=offer.js.map