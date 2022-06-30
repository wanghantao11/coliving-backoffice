"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAuthenticated = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const httpContext = require("express-http-context");
const common_1 = require("./../../infrastructure/utils/common");
const service_1 = require("../auth/jwt/service");
let IsAuthenticated = class IsAuthenticated extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        let { authorization } = req.headers;
        if (!authorization && req.query.authorization) {
            authorization = `Bearer ${req.query.authorization}`;
        }
        if (!authorization) {
            return Promise.reject({ message: 'NOT_AUTHENTICATED', reason: 'Missing authorization token in the request header' }).catch(next);
        }
        else {
            const token = authorization.split(' ')[1];
            return service_1.verify(token)
                .then((decoded) => {
                if (!common_1.hasAuthType(res.locals.allowAuthTypes, decoded.authType)) {
                    return Promise.reject({ message: 'NOT_AUTHENTICATED', reason: 'Missing authentication type' });
                }
                else {
                    res.locals.userId = decoded.id;
                    res.locals.clientId = decoded.clientId;
                    res.locals.projectId = decoded.projectId;
                    res.locals.apartmentId = decoded.apartmentId;
                    res.locals.authType = decoded.authType;
                    res.locals.authToken = token;
                    res.locals.facadeIds = decoded.facadeIds;
                    httpContext.set('iduser', res.locals.userId);
                    next();
                }
            })
                .catch(next);
        }
    }
};
IsAuthenticated = __decorate([
    inversify_1.injectable()
], IsAuthenticated);
exports.IsAuthenticated = IsAuthenticated;
//# sourceMappingURL=authentication.js.map