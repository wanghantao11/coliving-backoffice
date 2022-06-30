"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAddressValidator = exports.UpdateAddressValidator = exports.CreateAddressValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let CreateAddressValidator = class CreateAddressValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().required(),
            careof: joi_1.string().allow(null, ''),
            city: joi_1.string().required(),
            country: joi_1.string().required(),
            street: joi_1.string().required(),
            zip: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateAddressValidator = __decorate([
    inversify_1.injectable()
], CreateAddressValidator);
exports.CreateAddressValidator = CreateAddressValidator;
let UpdateAddressValidator = class UpdateAddressValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            careof: joi_1.string().allow(null, ''),
            city: joi_1.string().optional(),
            country: joi_1.string().optional(),
            street: joi_1.string().optional(),
            zip: joi_1.string().optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateAddressValidator = __decorate([
    inversify_1.injectable()
], UpdateAddressValidator);
exports.UpdateAddressValidator = UpdateAddressValidator;
class DeleteAddressValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            id: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
}
exports.DeleteAddressValidator = DeleteAddressValidator;
//# sourceMappingURL=address.js.map