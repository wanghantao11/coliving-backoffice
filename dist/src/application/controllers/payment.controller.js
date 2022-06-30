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
const swagger_express_ts_1 = require("swagger-express-ts");
const payment_service_1 = require("../../application/services/payment.service");
const auth_1 = require("../../application/middleware/auth");
const constants_1 = require("../../infrastructure/constants");
let PaymentController = class PaymentController extends inversify_express_utils_1.BaseHttpController {
    constructor(paymentService) {
        super();
        this.paymentService = paymentService;
    }
    /**
     * POST /payment/:id/charge
     *
     * @param req
     * ```
     * req.body.source(optional)
     * req.body.has_saved_card(optional)
     * req.body.idempotency_key
     * ```
     * @param res
     * ```
     * req.params.id
     * res.locals.userId
     * res.locals.projectId
     * ```
     */
    submitPayment(req, res) {
        const { userId, projectId } = res.locals;
        const { has_saved_card, idempotency_key, source } = req.body;
        return this.paymentService.submitPayment(Number(req.params.id), userId, Number(projectId), idempotency_key, source, has_saved_card)
            .then(payment => this.json({ payment }, statuscodes.OK));
    }
    getPaymentsForAdmin(req) {
        return this.paymentService.getPaymentsForAdmin(req.query)
            .then(([total, payments]) => this.json({ total, payments }, statuscodes.OK));
    }
    getPayments(req, res) {
        return this.paymentService.getPayments(res.locals.userId)
            .then(payments => this.json({ payments }, statuscodes.OK));
    }
    getPayment(req) {
        return this.paymentService.getPayment(Number(req.params.id))
            .then(payment => this.json({ payment }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/{id}/charge',
        description: 'Submit the payment to charge the given card',
        parameters: {
            path: {
                id: {
                    description: 'Id of the payment',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
            body: {
                properties: {
                    idempotency_key: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
                    source: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING },
                    has_saved_card: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
                },
                required: true,
            },
        },
        responses: {
            200: { model: 'Payment' },
            400: { description: 'Failed to submit the payment' },
        },
    }),
    inversify_express_utils_1.httpPost('/:id/charge', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'createChargeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "submitPayment", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/admin',
        description: 'Get all payments by admin based on the query filters',
        parameters: {
            query: {
                facade_id: {
                    description: 'Project facade id payments belong to',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                id: {
                    description: 'Payment id',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                iduser: {
                    description: 'Id of the member',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                email: {
                    description: 'Member email address',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                name: {
                    description: 'Member name',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                created_from: {
                    description: 'Earliest payment creation date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                created_to: {
                    description: 'Latest payment creation date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                is_overdue: {
                    description: 'If the payment is overdue',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
                },
                status: {
                    description: 'Payment status',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                offset: {
                    description: 'Offset value of the search result',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                limit: {
                    description: 'Limit value of the search result',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                sort_order: {
                    description: 'Sort order of the search result',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                sort_by: {
                    description: 'Sort by field of the search result',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'Payment' },
            400: { description: 'Failed to get the payments' },
        },
    }),
    inversify_express_utils_1.httpGet('/admin', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ]), 'isAuthenticated', 'isAuthorized', 'getPaymentsForAdminValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getPaymentsForAdmin", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get all payments of the tenant',
        responses: {
            200: { model: 'Payment' },
            400: { description: 'Failed to get the payments' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getPayments", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}',
        description: 'Get the given payment',
        parameters: {
            path: {
                id: {
                    description: 'Id of the payment',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'Payment' },
            400: { description: 'Failed to get the payment' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'getPaymentForTenantValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getPayment", null);
PaymentController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Payment',
        path: '/payment',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/payment'),
    __param(0, inversify_1.inject('PaymentService')),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
exports.default = PaymentController;
//# sourceMappingURL=payment.controller.js.map