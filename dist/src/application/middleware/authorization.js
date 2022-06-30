"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAuthorized = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const constants_1 = require("./../../infrastructure/constants");
const authorization_1 = require("./../auth/authorization");
let IsAuthorized = class IsAuthorized extends inversify_express_utils_1.BaseMiddleware {
    constructor(authorization) {
        super();
        this.authorization = authorization;
    }
    handler(req, res, next) {
        if (res.locals.authType === constants_1.BACKOFFICE) {
            return this.authorization.authorize(res.locals.userId, res.locals.permission)
                .then(isAuthorized => !isAuthorized ?
                Promise.reject({ message: 'NOT_AUTHORIZED', reason: 'Admin authorization failed' }) : next())
                .catch(next);
        }
        next();
    }
};
IsAuthorized = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('Authorization')),
    __metadata("design:paramtypes", [authorization_1.Authorization])
], IsAuthorized);
exports.IsAuthorized = IsAuthorized;
//# sourceMappingURL=authorization.js.map