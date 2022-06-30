"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeformResponseValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const lodash_1 = require("lodash");
const joi_1 = require("joi");
let TypeformResponseValidator = class TypeformResponseValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const schema = joi_1.object().keys({
            iduser: joi_1.string().required(),
            rawData: joi_1.array().required(),
        });
        res.locals.rawData = lodash_1.get(req.body, 'form_response.answers') || lodash_1.get(req.body, 'answers');
        res.locals.iduser = lodash_1.get(req.body, 'form_response.hidden.iduser') || lodash_1.get(req.body, 'hidden.iduser');
        res.locals.iduser = res.locals.iduser.trim();
        const data = res.locals;
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
TypeformResponseValidator = __decorate([
    inversify_1.injectable()
], TypeformResponseValidator);
exports.TypeformResponseValidator = TypeformResponseValidator;
//# sourceMappingURL=typeform.js.map