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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const statuscodes = require("http-status-codes");
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const contract_service_1 = require("../services/contract.service");
const payment_service_1 = require("../services/payment.service");
const userScore_service_1 = require("../services/userScore.service");
let WebhookController = class WebhookController extends inversify_express_utils_1.BaseHttpController {
    constructor(contractService, paymentService, userScoreService) {
        super();
        this.contractService = contractService;
        this.paymentService = paymentService;
        this.userScoreService = userScoreService;
    }
    /**
     * POST webhook/typeform
     *
     * @name getTypeformResponse
     */
    getTypeformResponse(req, res) {
        const { rawData, iduser } = res.locals;
        return this.userScoreService.saveScoreFromWebhook(iduser, rawData)
            .then(() => this.json({}, statuscodes.OK));
    }
    /**
     * POST webhook/oneflow
     *
     * @name getOneflowResponse
     */
    getOneflowResponse(req) {
        return this.contractService.updateContract(req.body)
            .then(() => this.json({}, statuscodes.OK));
    }
    /**
     * POST webhook/stripe
     *
     * @name getStripeResponse
     */
    getStripeResponse(req) {
        return this.paymentService.updatePaymentOnWebhookEvent(req.body)
            .then(data => this.json(data, statuscodes.OK));
    }
};
__decorate([
    inversify_express_utils_1.httpPost('/typeform', 'typeformResponseValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "getTypeformResponse", null);
__decorate([
    inversify_express_utils_1.httpPost('/oneflow', 'oneflowResponseValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "getOneflowResponse", null);
__decorate([
    inversify_express_utils_1.httpPost('/stripe', 'stripeResponseValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "getStripeResponse", null);
WebhookController = __decorate([
    inversify_express_utils_1.controller('/webhook'),
    __param(0, inversify_1.inject('ContractService')),
    __param(1, inversify_1.inject('PaymentService')),
    __param(2, inversify_1.inject('UserScoreService')),
    __metadata("design:paramtypes", [contract_service_1.ContractService,
        payment_service_1.PaymentService,
        userScore_service_1.UserScoreService])
], WebhookController);
exports.default = WebhookController;
//# sourceMappingURL=webhook.controller.js.map