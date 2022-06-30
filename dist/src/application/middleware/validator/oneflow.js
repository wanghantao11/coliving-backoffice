"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneflowResponseValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const crypto = require("crypto");
const contract_1 = require("../../../infrastructure/constants/contract");
let OneflowResponseValidator = class OneflowResponseValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const { signature, callback_id } = req.body;
        const hash = crypto.createHash('sha1');
        if (hash.update(callback_id + contract_1.SIGN_KEY).digest('hex') === signature) {
            next();
        }
        else {
            return Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid oneflow sign key' }).catch(next);
        }
    }
};
OneflowResponseValidator = __decorate([
    inversify_1.injectable()
], OneflowResponseValidator);
exports.OneflowResponseValidator = OneflowResponseValidator;
//# sourceMappingURL=oneflow.js.map