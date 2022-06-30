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
exports.Authorization = void 0;
const inversify_1 = require("inversify");
const common_1 = require("./../../infrastructure/utils/common");
let Authorization = class Authorization {
    constructor(roleDao, adminDao) {
        this.roleDao = roleDao;
        this.adminDao = adminDao;
        this.authorize = (admin_id, values) => this.adminDao.getAdminBy({ id: admin_id })
            .then(admin => !admin ? Promise.reject({ message: 'NOT_FOUND', reason: `No admin is found for ${admin_id} during authorization` }) : admin)
            .then(admin => admin.role.id)
            .then(this.roleDao.getRole)
            .then(({ scopes }) => !scopes ? scopes : common_1.hasPermission(scopes, values));
    }
};
Authorization = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('RoleDao')),
    __param(1, inversify_1.inject('AdminDao')),
    __metadata("design:paramtypes", [Object, Object])
], Authorization);
exports.Authorization = Authorization;
//# sourceMappingURL=authorization.js.map