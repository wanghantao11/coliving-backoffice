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
const inversify_1 = require("inversify");
const statuscodes = require("http-status-codes");
const inversify_express_utils_1 = require("inversify-express-utils");
const payment_service_1 = require("./../services/payment.service");
const tenant_service_1 = require("./../services/tenant.service");
let JobController = class JobController extends inversify_express_utils_1.BaseHttpController {
    constructor(paymentService, tenantService) {
        super();
        this.paymentService = paymentService;
        this.tenantService = tenantService;
    }
    /**
     * POST /create-monthly-rent
     * Creat monthly rent payments for active tenants
     *
     */
    createMonthlyRentPayments() {
        // Create monthly rent payments for active tenants on the first day of the month
        return this.paymentService.createMonthlyRentPayments()
            .then(() => this.json({}, statuscodes.OK));
    }
    /**
     * POST /send-due-date-notification
     * Send due date notifications for overdue payments
     *
     */
    sendDueDateNotification() {
        return this.paymentService.sendDueDateNotification()
            .then(() => this.json({}, statuscodes.OK));
    }
    /**
     * POST /send-payment-notification
     * Send payment notifications 2 days before and 7 days after due date
     *
     */
    sendPaymentNotification() {
        return this.paymentService.sendPaymentNotification()
            .then(() => this.json({}, statuscodes.OK));
    }
    /**
     * POST /set-moved-out-tenants-to-users
     * Set moved-out tenants back to normal users
     *
     */
    setMovedOutTenantsToUsers() {
        return this.tenantService.setMovedOutTenantsToUsers()
            .then(() => this.json({}, statuscodes.OK));
    }
};
__decorate([
    inversify_express_utils_1.httpPost('/create-monthly-rent', 'createMonthlyRentValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobController.prototype, "createMonthlyRentPayments", null);
__decorate([
    inversify_express_utils_1.httpPost('/send-due-date-notification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobController.prototype, "sendDueDateNotification", null);
__decorate([
    inversify_express_utils_1.httpPost('/send-payment-notification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobController.prototype, "sendPaymentNotification", null);
__decorate([
    inversify_express_utils_1.httpPost('/set-moved-out-tenants-to-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobController.prototype, "setMovedOutTenantsToUsers", null);
JobController = __decorate([
    inversify_express_utils_1.controller('/job'),
    __param(0, inversify_1.inject('PaymentService')),
    __param(1, inversify_1.inject('TenantService')),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        tenant_service_1.TenantService])
], JobController);
exports.default = JobController;
//# sourceMappingURL=job.controller.js.map