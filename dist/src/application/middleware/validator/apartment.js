"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteApartmentValidator = exports.UpdateApartmentValidator = exports.CreateApartmentValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let CreateApartmentValidator = class CreateApartmentValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().required(),
            name: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateApartmentValidator = __decorate([
    inversify_1.injectable()
], CreateApartmentValidator);
exports.CreateApartmentValidator = CreateApartmentValidator;
let UpdateApartmentValidator = class UpdateApartmentValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { body: req.body, params: req.params };
        const schema = joi_1.object().keys({
            body: joi_1.object().keys({
                name: joi_1.string().optional(),
            }),
            params: joi_1.object().keys({
                id: joi_1.number().required(),
            }),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateApartmentValidator = __decorate([
    inversify_1.injectable()
], UpdateApartmentValidator);
exports.UpdateApartmentValidator = UpdateApartmentValidator;
let DeleteApartmentValidator = class DeleteApartmentValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            id: joi_1.number().optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
DeleteApartmentValidator = __decorate([
    inversify_1.injectable()
], DeleteApartmentValidator);
exports.DeleteApartmentValidator = DeleteApartmentValidator;
//# sourceMappingURL=apartment.js.map