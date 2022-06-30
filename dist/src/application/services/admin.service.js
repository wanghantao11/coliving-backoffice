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
exports.AdminService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const constants_1 = require("./../../infrastructure/constants");
const common_1 = require("./../../infrastructure/utils/common");
const email_1 = require("./../../infrastructure/utils/email");
const service_1 = require("./../auth/jwt/service");
const chat_1 = require("./../getstream/chat");
let AdminService = class AdminService {
    constructor(adminDao) {
        this.adminDao = adminDao;
        this.createAdmin = (admin) => this.adminDao.createAdmin(admin);
        this.deleteAdmin = (id) => this.adminDao.deleteAdmin(Number(id));
        this.getAdminById = (id) => this.adminDao.getAdminBy({ id })
            .then(admin => !admin ? Promise.reject({ message: 'NOT_FOUND', reason: `No admin is found by id ${id}` }) : admin)
            .then(common_1.excludeKeysFromObject('password'));
        this.login = (email, password) => this.adminDao.getAdminBy({ email })
            .then(admin => !admin ? Promise.reject({ message: 'NOT_FOUND', reason: `No admin is found by email ${email}` }) : admin)
            .then(admin => !admin.verified ?
            Promise.reject({ message: 'NOT_VERIFIED', reason: `Admin ${email} is not verified` })
            : common_1.checkPassword(password, admin.password)
                .then(isVerified => isVerified
                ? chat_1.createChatToken(`host-${admin.id}`).then(chatToken => service_1.signInBackOffice(admin.id, admin.client.id, admin.facade_ids, chatToken, constants_1.BACKOFFICE))
                : Promise.reject({ message: 'NOT_AUTHENTICATED', reason: `Incorrect password for admin ${email}` })));
        this.getAdminsByClientId = (client_id) => this.adminDao.getAdminsBy({ client_id });
        this.getDefaultHostAdminByFacadeId = (facadeId) => this.getHostsOrSiteAdminsByFacadeId(facadeId)
            .then(hosts => hosts.length === 0 ? Promise.reject({ message: 'NOT_FOUND', reason: `No host is found in project facade ${facadeId}` }) : hosts[0]);
        this.getHostsOrSiteAdminsByFacadeId = (facadeId) => this.adminDao.getAdminsBy({ roles: [constants_1.SITE_ADMIN.name, constants_1.HOST.name], facadeIds: [facadeId], verified: true });
        this.setPasswordById = (id, password) => common_1.hashPassword(password).then(hashedPassword => this.adminDao.updateAdminBy({ id }, { password: hashedPassword, verified: true, verification_code: null }));
        this.sendForgotPasswordEmail = (email) => this.adminDao.getAdminBy({ email })
            .then(admin => !admin ? Promise.reject({ message: 'NOT_FOUND', reason: `No admin is found by email ${email}` }) : service_1.signWithEmail(email))
            .then(code => email_1.sendSetPasswordEmail(email, code, process.env.BACKOFFICE_FRONTEND, '/mail/admin/forgot-password')
            .then(() => code));
        this.sendVerificationEmail = (email) => this.adminDao.getAdminBy({ email })
            .then(admin => !admin ? Promise.reject({ message: 'NOT_FOUND', reason: `No admin is found by email ${email}` }) : service_1.signWithEmail(email))
            .then(code => email_1.sendSetPasswordEmail(email, code, process.env.BACKOFFICE_FRONTEND, '/mail/admin/verify')
            .then(() => code));
        this.verify = (verificationCode) => service_1.verify(verificationCode)
            .then(({ email }) => this.adminDao.getAdminBy({ email }))
            .then(admin => !admin.verification_code
            ? Promise.reject({ message: 'NOT_VERIFIED', reason: 'Verification failed with incorrect code' })
            : admin.id);
        this.setCodeByEmail = (email, code) => this.adminDao.updateAdminBy({ email }, { verification_code: code });
        this.updateAdminById = (id, updateObj) => this.adminDao.updateAdminBy({ id: Number(id) }, updateObj);
    }
};
AdminService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('AdminDao')),
    __metadata("design:paramtypes", [Object])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map