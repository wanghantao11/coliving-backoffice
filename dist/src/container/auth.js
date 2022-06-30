"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const authorization_1 = require("../application/middleware/authorization");
const authentication_1 = require("../application/middleware/authentication");
const authorization_2 = require("../application/auth/authorization");
_1.container.bind('Authorization').to(authorization_2.Authorization);
_1.container.bind('isAuthorized').to(authorization_1.IsAuthorized);
_1.container.bind('isAuthenticated').to(authentication_1.IsAuthenticated);
//# sourceMappingURL=auth.js.map