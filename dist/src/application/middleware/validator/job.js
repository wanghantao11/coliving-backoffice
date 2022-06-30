"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMonthlyRentValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
let CreateMonthlyRentValidator = class CreateMonthlyRentValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const now = new Date();
        const dayOfMonth = now.getUTCDate();
        if (dayOfMonth === 1) {
            next();
        }
        else {
            res.sendStatus(200);
        }
    }
};
CreateMonthlyRentValidator = __decorate([
    inversify_1.injectable()
], CreateMonthlyRentValidator);
exports.CreateMonthlyRentValidator = CreateMonthlyRentValidator;
//# sourceMappingURL=job.js.map