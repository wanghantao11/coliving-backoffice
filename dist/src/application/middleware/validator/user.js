"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyPinCodeValidator = exports.SendPinCodeValidator = exports.SetPasswordValidator = exports.UploadUserProfileImageValidator = exports.FindOtherUserValidator = exports.LoginUserValidator = exports.UpdateUserValidator = exports.GetOtherUsersValidator = exports.GetOtherUserCountValidator = exports.CreateUserValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let CreateUserValidator = class CreateUserValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            iduser: joi_1.string(),
            client_id: joi_1.number(),
            first_name: joi_1.string(),
            last_name: joi_1.string(),
            birthday: joi_1.string().allow('', null),
            captcha: joi_1.string(),
            user_type: joi_1.string().allow('', null),
            email: joi_1.string(),
            password: joi_1.string().allow('', null),
            phone: joi_1.string().allow('', null),
            tos_version_accepted: joi_1.number(),
            img_url: joi_1.string().allow('', null),
            description: joi_1.string().allow('', null),
            language: joi_1.string().allow('sv', 'en'),
            stripe_customer_id: joi_1.string().allow('', null),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateUserValidator = __decorate([
    inversify_1.injectable()
], CreateUserValidator);
exports.CreateUserValidator = CreateUserValidator;
let GetOtherUserCountValidator = class GetOtherUserCountValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            locations: joi_1.array().allow([]),
            minAge: joi_1.number().allow(''),
            maxAge: joi_1.number().allow(''),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetOtherUserCountValidator = __decorate([
    inversify_1.injectable()
], GetOtherUserCountValidator);
exports.GetOtherUserCountValidator = GetOtherUserCountValidator;
let GetOtherUsersValidator = class GetOtherUsersValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            locations: joi_1.array().allow([]),
            minAge: joi_1.number().allow(''),
            maxAge: joi_1.number().allow(''),
            offset: joi_1.number(),
            limit: joi_1.number(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetOtherUsersValidator = __decorate([
    inversify_1.injectable()
], GetOtherUsersValidator);
exports.GetOtherUsersValidator = GetOtherUsersValidator;
let UpdateUserValidator = class UpdateUserValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            birthday: joi_1.string().allow('', null),
            description: joi_1.string().allow('', null),
            first_name: joi_1.string().optional(),
            gender: joi_1.string().optional(),
            is_test_complete: joi_1.boolean().optional(),
            language: joi_1.string().allow('sv', 'en'),
            last_name: joi_1.string().optional(),
            phone: joi_1.string().allow('', null),
            img_url: joi_1.string().optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateUserValidator = __decorate([
    inversify_1.injectable()
], UpdateUserValidator);
exports.UpdateUserValidator = UpdateUserValidator;
let LoginUserValidator = class LoginUserValidator extends inversify_express_utils_1.BaseMiddleware {
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
LoginUserValidator = __decorate([
    inversify_1.injectable()
], LoginUserValidator);
exports.LoginUserValidator = LoginUserValidator;
let FindOtherUserValidator = class FindOtherUserValidator extends inversify_express_utils_1.BaseMiddleware {
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
FindOtherUserValidator = __decorate([
    inversify_1.injectable()
], FindOtherUserValidator);
exports.FindOtherUserValidator = FindOtherUserValidator;
let UploadUserProfileImageValidator = class UploadUserProfileImageValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            img: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UploadUserProfileImageValidator = __decorate([
    inversify_1.injectable()
], UploadUserProfileImageValidator);
exports.UploadUserProfileImageValidator = UploadUserProfileImageValidator;
let SetPasswordValidator = class SetPasswordValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            iduser: joi_1.string().required(),
            password: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
SetPasswordValidator = __decorate([
    inversify_1.injectable()
], SetPasswordValidator);
exports.SetPasswordValidator = SetPasswordValidator;
let SendPinCodeValidator = class SendPinCodeValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            email: joi_1.string().email().required(),
            captcha: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
SendPinCodeValidator = __decorate([
    inversify_1.injectable()
], SendPinCodeValidator);
exports.SendPinCodeValidator = SendPinCodeValidator;
let VerifyPinCodeValidator = class VerifyPinCodeValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            email: joi_1.string().email().required(),
            code: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
VerifyPinCodeValidator = __decorate([
    inversify_1.injectable()
], VerifyPinCodeValidator);
exports.VerifyPinCodeValidator = VerifyPinCodeValidator;
//# sourceMappingURL=user.js.map