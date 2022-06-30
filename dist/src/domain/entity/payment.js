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
var Payment_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const typeorm_1 = require("typeorm");
const constants_1 = require("../../infrastructure/constants");
const projectFacade_1 = require("./projectFacade");
const user_1 = require("./user");
let Payment = Payment_1 = class Payment {
};
Payment.generatePayment = (payment) => {
    const _payment = new Payment_1();
    Object.keys(payment).forEach(key => {
        _payment[key] = payment[key];
    });
    return Promise.resolve(_payment);
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of payment',
        example: 1,
        required: true,
    }),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Payment.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, { primary: true, onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'iduser', referencedColumnName: 'iduser' }),
    __metadata("design:type", user_1.User)
], Payment.prototype, "user", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Id of member',
        example: '7259687e-6458-4859-97ff-3e3b1p2ad837',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Payment.prototype, "iduser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => projectFacade_1.ProjectFacade, projectFacade => projectFacade.id, { onDelete: 'CASCADE', nullable: false }),
    typeorm_1.JoinColumn({ name: 'facade_id' }),
    __metadata("design:type", projectFacade_1.ProjectFacade)
], Payment.prototype, "facade", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Id of project facade',
        example: 10,
        required: true,
    }),
    typeorm_1.Column('int', { name: 'facade_id', nullable: false }),
    __metadata("design:type", Number)
], Payment.prototype, "facade_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'Amount of the payment',
        example: 5000,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Currency of the payment',
        example: 'SEK',
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Failed reason of the payment',
        example: 'insufficient_fund',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "failed_reason", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the payment is overdue',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Payment.prototype, "is_overdue", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'The receipt URL of the payment',
        example: 'https://test.com/payment_receipt',
        required: false,
    }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "receipt_url", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'boolean',
        description: 'If the payment is refunded',
        example: 'true',
        required: false,
    }),
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Payment.prototype, "refunded", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'integer',
        description: 'The amount of the rent for the payment',
        example: 3500,
        required: true,
    }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Payment.prototype, "rent", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "stripe_charge_id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "stripe_customer_id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'string',
        description: 'Status of the payment',
        example: 'succeeded',
        required: false,
    }),
    typeorm_1.Column({ type: 'enum', enum: constants_1.PAYMENT_STATUS, default: constants_1.PAYMENT_STATUS.CREATED }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        type: 'date',
        description: 'The date when the payment is paid',
        example: '2021-02-02',
        required: false,
    }),
    typeorm_1.Column({ nullable: true, type: 'date' }),
    __metadata("design:type", Date)
], Payment.prototype, "paid_at", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Payment.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Payment.prototype, "updated_at", void 0);
Payment = Payment_1 = __decorate([
    swagger_express_ts_1.ApiModel({
        description: 'Payment entity',
        name: 'Payment',
    }),
    typeorm_1.Entity()
], Payment);
exports.Payment = Payment;
//# sourceMappingURL=payment.js.map