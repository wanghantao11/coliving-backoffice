"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const jwt = require("jsonwebtoken");
class Authentication {
    constructor() {
        this.secret = process.env.JWT_SECRET;
    }
    sign(data, expiresIn = '1d', algorithm = 'HS256') {
        return Promise.resolve(jwt.sign(data, this.secret, { algorithm, expiresIn }));
    }
    verify(token) {
        try {
            return Promise.resolve(jwt.verify(token, this.secret));
        }
        catch (e) {
            return Promise.reject({ message: 'NOT_AUTHENTICATED', reason: 'Verification failed', detail: e.message });
        }
    }
}
exports.Authentication = Authentication;
//# sourceMappingURL=authentication.js.map