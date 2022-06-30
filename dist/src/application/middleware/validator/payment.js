"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPaymentForTenantValidator = exports.StripeResponseValidator = exports.GetPaymentsForAdminValidator = exports.CreateChargeValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let CreateChargeValidator = class CreateChargeValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { params: req.params, body: req.body };
        const schema = joi_1.object().keys({
            body: joi_1.object().keys({
                has_saved_card: joi_1.boolean().optional(),
                idempotency_key: joi_1.string().required(),
                source: joi_1.string().optional(),
            }),
            params: joi_1.object().keys({
                id: joi_1.number().required(),
            }),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({
                message: 'NOT_VALIDATED',
                reason: 'Invalid request data',
                detail: err.details,
            }).catch(next)
            : next());
    }
};
CreateChargeValidator = __decorate([
    inversify_1.injectable()
], CreateChargeValidator);
exports.CreateChargeValidator = CreateChargeValidator;
let GetPaymentsForAdminValidator = class GetPaymentsForAdminValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().optional(),
            id: joi_1.number().optional(),
            iduser: joi_1.string().optional(),
            email: joi_1.string().optional(),
            name: joi_1.string().optional(),
            created_from: joi_1.date().optional(),
            created_to: joi_1.date().optional(),
            is_overdue: joi_1.string().optional(),
            status: joi_1.array().items(joi_1.string()).optional(),
            limit: joi_1.number().optional(),
            offset: joi_1.number().optional(),
            sort_order: joi_1.string().valid(['ASC', 'DESC']),
            sort_by: joi_1.string().valid(['created_from', 'id', 'first_name', 'status']),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetPaymentsForAdminValidator = __decorate([
    inversify_1.injectable()
], GetPaymentsForAdminValidator);
exports.GetPaymentsForAdminValidator = GetPaymentsForAdminValidator;
let StripeResponseValidator = class StripeResponseValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const { id, data, type } = req.body;
        const { created, status } = data.object;
        if (id && type && created && status) {
            next();
        }
        else {
            return Promise.reject({
                message: 'NOT_VALIDATED',
                reason: 'Invalid stripe webhook event data',
            }).catch(next);
        }
    }
};
StripeResponseValidator = __decorate([
    inversify_1.injectable()
], StripeResponseValidator);
exports.StripeResponseValidator = StripeResponseValidator;
let GetPaymentForTenantValidator = class GetPaymentForTenantValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            id: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({
                message: 'NOT_VALIDATED',
                reason: 'Invalid request data',
                detail: err.details,
            }).catch(next)
            : next());
    }
};
GetPaymentForTenantValidator = __decorate([
    inversify_1.injectable()
], GetPaymentForTenantValidator);
exports.GetPaymentForTenantValidator = GetPaymentForTenantValidator;
//# sourceMappingURL=payment.js.map