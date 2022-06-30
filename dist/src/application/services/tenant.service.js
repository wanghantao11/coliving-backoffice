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
exports.TenantService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const constants_1 = require("./../../infrastructure/constants");
const common_1 = require("./../../infrastructure/utils/common");
const service_1 = require("./../auth/jwt/service");
const user_1 = require("./../firebase/user");
const chat_1 = require("./../getstream/chat");
let TenantService = class TenantService {
    constructor(adminDao, contractDao, projectFacadeDocumentDao, roomDao, tenantDao, userDao) {
        this.adminDao = adminDao;
        this.contractDao = contractDao;
        this.projectFacadeDocumentDao = projectFacadeDocumentDao;
        this.roomDao = roomDao;
        this.tenantDao = tenantDao;
        this.userDao = userDao;
        /**
         * NOTE:
         * If no password in db, authenticate with firebase first and hash the password, store it in db,
         * otherwise, check the password with hashed one and login
         *
         * For backward compatibility with firebase auth
         */
        this.login = (email, password) => this.userDao.getUserBy({ email })
            .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by email ${email}` }) : user)
            .then(user => user.user_type !== constants_1.USER_TYPE.TENANT ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${email} is not tenant` }) : user)
            .then(user => this.contractDao.getContractBy({ iduser: user.iduser, status: [constants_1.CONTRACT_STATUS.ACTIVE] })
            .then(contract => !contract ?
            Promise.reject({ message: 'NOT_ALLOWED', reason: `No active contract is found for user ${email}` })
            : (Object.assign(Object.assign({}, user), { facade_id: contract.facade_id, room_id: contract.room_id }))))
            .then(tenant => this.roomDao.getRoomBy({ id: tenant.room_id })
            .then(room => !tenant.password ?
            user_1.signInWithEmailAndPassword(email, password)
                .then(() => common_1.hashPassword(password))
                .then(hashedPassword => this.userDao.updateUserBy({ iduser: tenant.iduser }, { password: hashedPassword })
                .then(updatedUser => chat_1.createChatToken(tenant.iduser)
                .then(chatToken => service_1.signInTenant(updatedUser.iduser, tenant.facade_id, room.apartment_id, chatToken, constants_1.TENANT))))
            : common_1.checkPassword(password, tenant.password).then(isVerified => isVerified ?
                chat_1.createChatToken(tenant.iduser)
                    .then(chatToken => service_1.signInTenant(tenant.iduser, tenant.facade_id, room.apartment_id, chatToken, constants_1.TENANT))
                : Promise.reject({ message: 'NOT_AUTHENTICATED', reason: `Incorrect password for user ${email}` }))));
        this.getHostsByFacadeId = (facadeId) => this.adminDao.getAdminsBy({ roles: [constants_1.HOST.name], facadeIds: [facadeId] });
        this.getTenants = (iduser, facade_id, query) => this.tenantDao.getTenants(iduser, facade_id, query);
        this.getTenantDetailById = (iduser) => this.tenantDao.getTenantDetailById(iduser)
            .then(tenant => !tenant ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by iduser ${iduser}` }) : tenant);
        this.getTenantDocumentsByFacadeId = (facadeId) => this.projectFacadeDocumentDao.getProjectFacadeDocumentsByFacadeId(facadeId);
        this.getOtherTenantDetailById = (iduser) => this.getTenantDetailById(iduser).then(common_1.excludeKeysFromObject('birthday', 'gender', 'registration_time'));
        this.setMovedOutTenantsToUsers = () => this.userDao.getUsersBy({ user_type: constants_1.USER_TYPE.TENANT }).then(tenants => Promise.all(tenants && tenants.length > 0 ? tenants.map(({ iduser }) => this.contractDao.getContractsBy({ iduser, status: [constants_1.CONTRACT_STATUS.ACTIVE, constants_1.CONTRACT_STATUS.TERMINATED] })
            .then(contracts => {
            if (!contracts || contracts.length === 0 ||
                contracts.some(contract => contract.status === constants_1.CONTRACT_STATUS.ACTIVE)) {
                return [];
            }
            if (contracts.every(contract => Date.parse(contract.end_date) < Date.now())) {
                return this.userDao.updateUserBy({ iduser }, { user_type: constants_1.USER_TYPE.LIGHT });
            }
            return [];
        })) : []));
    }
};
TenantService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('AdminDao')),
    __param(1, inversify_1.inject('ContractDao')),
    __param(2, inversify_1.inject('ProjectFacadeDocumentDao')),
    __param(3, inversify_1.inject('RoomDao')),
    __param(4, inversify_1.inject('TenantDao')),
    __param(5, inversify_1.inject('UserDao')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], TenantService);
exports.TenantService = TenantService;
//# sourceMappingURL=tenant.service.js.map