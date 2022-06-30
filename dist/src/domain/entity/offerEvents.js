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
var OfferEvents_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferEvents = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
let OfferEvents = OfferEvents_1 = class OfferEvents {
};
OfferEvents.generateOfferEvent = (event) => {
    const _event = new OfferEvents_1();
    Object.keys(event).forEach(key => {
        _event[key] = event[key];
    });
    return Promise.resolve(_event);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of offer event',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], OfferEvents.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Id of member',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], OfferEvents.prototype, "iduser", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Type of the offer event',
        example: 'offer_sent',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], OfferEvents.prototype, "type", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The project facade id the offer event belongs to',
        example: 10,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], OfferEvents.prototype, "facade_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'json',
        description: 'Data of the offer event',
        example: '{"offer": {"id": 296, "iduser": "7259687e-6458-4859-97ff-3e3b1p2ad837", "status": "Pending", "room_id": 65, "facade_id": 5, "is_sent_by_admin": true}}',
        required: true,
    }),
    typeorm_1.Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], OfferEvents.prototype, "data", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'json',
        description: 'Log of the contract event',
        required: false,
    }),
    typeorm_1.Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], OfferEvents.prototype, "log", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], OfferEvents.prototype, "created_at", void 0);
OfferEvents = OfferEvents_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Offer Events entity',
        name: 'OfferEvents',
    }),
    typeorm_1.Entity()
], OfferEvents);
exports.OfferEvents = OfferEvents;
//# sourceMappingURL=offerEvents.js.map