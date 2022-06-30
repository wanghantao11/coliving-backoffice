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
var Client_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
let Client = Client_1 = class Client {
};
// factory method
Client.generateClient = (client) => {
    const _client = new Client_1();
    Object.keys(client).forEach(key => {
        _client[key] = client[key];
    });
    return Promise.resolve(_client);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of application',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Client.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Client.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Client.prototype, "updated_at", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The client organization number',
        example: '8888-888',
        required: true,
    }),
    typeorm_1.Column({ length: 30 }),
    __metadata("design:type", String)
], Client.prototype, "org_no", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The client VAT number',
        example: '8888-888-8888',
        required: false,
    }),
    typeorm_1.Column({ length: 24, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "vat_no", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The client name',
        example: 'Colive AB',
        required: true,
    }),
    typeorm_1.Column({ length: 100 }),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The client phone number',
        example: '+468 1111111',
        required: true,
    }),
    typeorm_1.Column({ length: 30 }),
    __metadata("design:type", String)
], Client.prototype, "phone", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The client email',
        example: 'client@client.com',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The client address',
        example: 'Vasagatan 12',
        required: false,
    }),
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The city of the client',
        example: 'Stockholm',
        required: false,
    }),
    typeorm_1.Column({ length: 30, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "city", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The post code of the client',
        example: '19 191',
        required: false,
    }),
    typeorm_1.Column({ length: 10, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "zip", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The country of the client',
        example: 'Sweden',
        required: true,
    }),
    typeorm_1.Column({ length: 20 }),
    __metadata("design:type", String)
], Client.prototype, "country", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The type of the client',
        example: ['default', 'admin'],
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Client.prototype, "type", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The url of the client logo',
        example: 'http://test.com/logo.png',
        required: false,
    }),
    typeorm_1.Column({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "logo", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "stripe_account_id", void 0);
Client = Client_1 = __decorate([
    typeorm_1.Unique(['email']),
    typeorm_1.Unique(['phone']),
    swagger_express_ts_1.ApiModel({
        description: 'Client entity',
        name: 'Client',
    }),
    typeorm_1.Entity()
], Client);
exports.Client = Client;
//# sourceMappingURL=client.js.map