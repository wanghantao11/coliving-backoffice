"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdminImageValidator = exports.DeleteAdminValidator = exports.VerifyCodeValidator = exports.SetAdminPasswordValidator = exports.LoginAdminValidator = exports.ForgotPasswordValidator = exports.ResendEmailValidator = exports.EmailValidator = exports.UpdateAdminValidator = exports.CreateAdminValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let CreateAdminValidator = class CreateAdminValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            first_name: joi_1.string().required(),
            last_name: joi_1.string().required(),
            email: joi_1.string().email().required(),
            role_id: joi_1.number().required(),
            type: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateAdminValidator = __decorate([
    inversify_1.injectable()
], CreateAdminValidator);
exports.CreateAdminValidator = CreateAdminValidator;
let UpdateAdminValidator = class UpdateAdminValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            first_name: joi_1.string().optional(),
            last_name: joi_1.string().optional(),
            img_url: joi_1.string().optional(),
            language: joi_1.string().optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateAdminValidator = __decorate([
    inversify_1.injectable()
], UpdateAdminValidator);
exports.UpdateAdminValidator = UpdateAdminValidator;
let EmailValidator = class EmailValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            email: joi_1.string().email().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
EmailValidator = __decorate([
    inversify_1.injectable()
], EmailValidator);
exports.EmailValidator = EmailValidator;
let ResendEmailValidator = class ResendEmailValidator extends EmailValidator {
};
ResendEmailValidator = __decorate([
    inversify_1.injectable()
], ResendEmailValidator);
exports.ResendEmailValidator = ResendEmailValidator;
let ForgotPasswordValidator = class ForgotPasswordValidator extends EmailValidator {
};
ForgotPasswordValidator = __decorate([
    inversify_1.injectable()
], ForgotPasswordValidator);
exports.ForgotPasswordValidator = ForgotPasswordValidator;
let LoginAdminValidator = class LoginAdminValidator extends inversify_express_utils_1.BaseMiddleware {
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
LoginAdminValidator = __decorate([
    inversify_1.injectable()
], LoginAdminValidator);
exports.LoginAdminValidator = LoginAdminValidator;
let SetAdminPasswordValidator = class SetAdminPasswordValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            id: joi_1.number().required(),
            password: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
SetAdminPasswordValidator = __decorate([
    inversify_1.injectable()
], SetAdminPasswordValidator);
exports.SetAdminPasswordValidator = SetAdminPasswordValidator;
let VerifyCodeValidator = class VerifyCodeValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            verificationCode: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
VerifyCodeValidator = __decorate([
    inversify_1.injectable()
], VerifyCodeValidator);
exports.VerifyCodeValidator = VerifyCodeValidator;
let DeleteAdminValidator = class DeleteAdminValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            id: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
DeleteAdminValidator = __decorate([
    inversify_1.injectable()
], DeleteAdminValidator);
exports.DeleteAdminValidator = DeleteAdminValidator;
let UpdateAdminImageValidator = class UpdateAdminImageValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { params: req.params, body: req.body };
        const schema = joi_1.object().keys({
            params: joi_1.object().keys({
                id: joi_1.number().required(),
            }),
            body: joi_1.object().keys({
                img: joi_1.string().required(),
            }),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateAdminImageValidator = __decorate([
    inversify_1.injectable()
], UpdateAdminImageValidator);
exports.UpdateAdminImageValidator = UpdateAdminImageValidator;
//# sourceMappingURL=admin.js.map