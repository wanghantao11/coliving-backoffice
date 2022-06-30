"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUEST = exports.TENANT = exports.COMMUNITY = exports.BACKOFFICE = exports.HOST = exports.COMMUNITY_MANAGER = exports.PROJECT_MANAGER = exports.SITE_ADMIN = void 0;
const scope = require("./scope");
exports.SITE_ADMIN = {
    name: 'site_admin',
    scopes: [scope.FULL],
};
exports.PROJECT_MANAGER = {
    name: 'project_manager',
    scopes: [scope.ACCOMMODATION_FULL, scope.APPLICATION_READ, scope.ROOM_FULL, scope.CONTRACT_FULL, scope.ADMIN_READ, scope.ROLE_READ, scope.NEWSLETTER_READ, scope.USER_READ],
};
exports.COMMUNITY_MANAGER = {
    name: 'community_manager',
    scopes: [scope.ACCOMMODATION_READ, scope.APPLICATION_FULL, scope.ROOM_READ, scope.CONTRACT_FULL, scope.ADMIN_READ, scope.ROLE_READ, scope.NEWSLETTER_FULL, scope.USER_FULL],
};
exports.HOST = {
    name: 'host',
    scopes: [scope.INCIDENT_FULL, scope.INCIDENT_READ],
};
exports.BACKOFFICE = 'backoffice';
exports.COMMUNITY = 'community';
exports.TENANT = 'tenant';
exports.GUEST = 'guest';
//# sourceMappingURL=admin.js.map