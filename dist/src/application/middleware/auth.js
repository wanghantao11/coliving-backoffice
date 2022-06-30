"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const axios_1 = require("axios");
const uuid = require("uuid/v4");
const common_1 = require("../../infrastructure/constants/common");
const common_2 = require("../../infrastructure/utils/common");
exports.AuthMiddleware = {
    generateId: (req, res, next) => {
        req.body.iduser = uuid();
        next();
    },
    needPermisson: (permission) => (req, res, next) => {
        res.locals.permission = permission;
        next();
    },
    allowAuthTypes: (types) => (req, res, next) => {
        res.locals.allowAuthTypes = types;
        next();
    },
    isVerifiedCaptcha: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        return axios_1.default.post(common_1.RECAPTCHA_VERIFY_URL, undefined, {
            params: {
                secret: process.env.CAPTCHA_SECRET_KEY,
                response: req.body.captcha,
            },
        })
            .then(common_2.getDataFromResponse)
            .then(({ success }) => success
            ? next()
            : Promise.reject({ message: 'NOT_AUTHENTICATED', reason: 'Recapcha verification failed' }))
            .catch(next);
    }),
};
//# sourceMappingURL=auth.js.map