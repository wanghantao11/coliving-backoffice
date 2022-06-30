"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminsValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let GetAdminsValidator = class GetAdminsValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            facadeId: joi_1.number(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetAdminsValidator = __decorate([
    inversify_1.injectable()
], GetAdminsValidator);
exports.GetAdminsValidator = GetAdminsValidator;
//# sourceMappingURL=admins.js.map