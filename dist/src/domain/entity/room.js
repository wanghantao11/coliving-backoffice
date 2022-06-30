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
var Room_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("../../infrastructure/constants");
const address_1 = require("./address");
const apartment_1 = require("./apartment");
const projectFacade_1 = require("./projectFacade");
let Room = Room_1 = class Room {
};
// factory method
Room.generateRoom = (room) => {
    const _room = new Room_1();
    Object.keys(room).forEach(key => {
        _room[key] = room[key];
    });
    return Promise.resolve(_room);
};
__decorate([
    typeorm_1.ManyToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'facade_id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], Room.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project facade',
        example: 10,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'facade_id', nullable: false }),
    __metadata("design:type", Number)
], Room.prototype, "facade_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of room',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Room.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Room.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Room.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => address_1.Address, address => address.id, { nullable: false }),
    typeorm_1.JoinColumn({ name: 'address_id' }),
    __metadata("design:type", address_1.Address)
], Room.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of address',
        example: 8,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'address_id', nullable: false }),
    __metadata("design:type", Number)
], Room.prototype, "address_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => apartment_1.Apartment, apartment => apartment.id),
    typeorm_1.JoinColumn({ name: 'apartment_id' }),
    __metadata("design:type", apartment_1.Apartment)
], Room.prototype, "apartment", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of apartment',
        example: 9,
        required: false,
    }),
    typeorm_1.Column('int', { name: 'apartment_id', nullable: true }),
    __metadata("design:type", Number)
], Room.prototype, "apartment_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The apartment plan map where the room belongs to',
        example: 'http://test.com/apartment-plan.jpg',
        required: true,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "apartment_plan_uri", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The floor number of the room',
        example: 'Våning 2',
        required: true,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "floor_no", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the room has private bathroom',
        example: 'true',
        required: true,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Room.prototype, "has_private_bathroom", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the room has private kitchen',
        example: 'true',
        required: true,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Room.prototype, "has_private_kitchen", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the room has private toilet',
        example: 'true',
        required: true,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Room.prototype, "has_private_toilet", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the room is suitable for disabled people',
        example: 'true',
        required: true,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Room.prototype, "is_suitable_for_disability", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer[]',
        description: 'List of label ids of the room',
        example: [1, 2, 5, 6],
        required: true,
    }),
    typeorm_1.Column('integer', { array: true, nullable: true }),
    __metadata("design:type", Array)
], Room.prototype, "label_ids", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'Move-in date of the room',
        example: '2021-02-02',
        required: false,
    }),
    typeorm_1.Column({ nullable: true, type: 'date' }),
    __metadata("design:type", Date)
], Room.prototype, "move_in_date", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Name of the room',
        example: 'Rose',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The notes of the room by the admin',
        example: 'The room is reserved for Johan',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Room.prototype, "notes", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Room number',
        example: 'Lgh 1201',
        required: true,
    }),
    typeorm_1.Column({ length: 200 }),
    __metadata("design:type", String)
], Room.prototype, "number", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The number of people in the room',
        example: 2,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Room.prototype, "people_per_room", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The rent of the room',
        example: 5000,
        required: true,
    }),
    typeorm_1.Column('float'),
    __metadata("design:type", Number)
], Room.prototype, "rent", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Service fee of the room',
        example: 1500,
        required: true,
    }),
    typeorm_1.Column('float'),
    __metadata("design:type", Number)
], Room.prototype, "service_fee", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The shared area size of the apartment where the room belongs to',
        example: 150,
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Room.prototype, "shared_area_size", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The room size',
        example: 20,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Room.prototype, "size", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The room status',
        example: 'Available',
        required: true,
    }),
    typeorm_1.Column({ type: 'enum', enum: constants_1.ROOM_STATUS, default: constants_1.ROOM_STATUS.AVAILABLE }),
    __metadata("design:type", String)
], Room.prototype, "status", void 0);
Room = Room_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Room entity',
        name: 'Room',
    }),
    typeorm_1.Entity()
], Room);
exports.Room = Room;
//# sourceMappingURL=room.js.map