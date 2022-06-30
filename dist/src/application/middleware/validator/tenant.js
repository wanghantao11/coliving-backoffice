"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOtherTenantValidator = exports.LoginTenantValidator = exports.GetTenantsValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let GetTenantsValidator = class GetTenantsValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            food_preferences: joi_1.array().optional(),
            building_ids: joi_1.array().optional(),
            apartment_ids: joi_1.array().optional(),
            interest_ids: joi_1.array().optional(),
            age_from: joi_1.string().optional(),
            age_to: joi_1.string().optional(),
            include_unspecified_age: joi_1.boolean().optional(),
            prefix: joi_1.string().optional(),
            limit: joi_1.number().default(20),
            offset: joi_1.number().default(0),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetTenantsValidator = __decorate([
    inversify_1.injectable()
], GetTenantsValidator);
exports.GetTenantsValidator = GetTenantsValidator;
let LoginTenantValidator = class LoginTenantValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            email: joi_1.string().email().required(),
            password: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
LoginTenantValidator = __decorate([
    inversify_1.injectable()
], LoginTenantValidator);
exports.LoginTenantValidator = LoginTenantValidator;
let GetOtherTenantValidator = class GetOtherTenantValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            iduser: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetOtherTenantValidator = __decorate([
    inversify_1.injectable()
], GetOtherTenantValidator);
exports.GetOtherTenantValidator = GetOtherTenantValidator;
//# sourceMappingURL=tenant.js.map