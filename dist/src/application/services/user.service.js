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
exports.UserService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const entity_1 = require("./../../domain/entity");
const constants_1 = require("./../../infrastructure/constants");
const common_1 = require("./../../infrastructure/utils/common");
const email_1 = require("./../../infrastructure/utils/email");
const contract_1 = require("../../infrastructure/utils/contract");
const user_1 = require("./../../infrastructure/utils/user");
const service_1 = require("./../auth/jwt/service");
const user_2 = require("./../firebase/user");
const common_2 = require("./../../infrastructure/utils/common");
const loggers_1 = require("../../infrastructure/utils/loggers");
const mailchimp_1 = require("../../infrastructure/utils/mailchimp");
const redis_1 = require("../../infrastructure/persistence/redis");
let UserService = class UserService {
    constructor(userDao, transaticonDao, contractDao) {
        this.userDao = userDao;
        this.transaticonDao = transaticonDao;
        this.contractDao = contractDao;
        this.createUser = (user) => entity_1.User.generateUser(user)
            .then(user => this.userDao.getUserBy({ email: user.email, is_verified: null })
            .then(storedUser => {
            if (storedUser && storedUser.is_verified) {
                return Promise.reject({ message: 'CONFLICT', reason: `User ${storedUser.email} existed already` });
            }
            if (storedUser && !storedUser.is_verified) {
                return this.userDao.updateUserBy({ email: user.email, is_verified: false }, Object.assign(Object.assign({}, common_2.excludeKeysFromObject('iduser', 'captcha')(user)), { is_verified: true }));
            }
            if (!storedUser) {
                return this.transaticonDao.createUserWithPreferencesAndProfiles(user);
            }
        })
            .then(() => mailchimp_1.formatUser(user))
            .then(mailchimp_1.importUser(process.env.MAILCHIMP_LIST_ID))
            .then(() => email_1.emailAxiosPost('/mail/new-user', {
            email: user.email,
            name: user.first_name,
        }).catch(error => loggers_1.logger.info(`Failed to send welcome emails. Reason: ${error.message}`))));
        this.deleteUserByExternalId = (iduser) => this.contractDao.getContractBy({ iduser })
            .then(contract => {
            if (contract) {
                if (contract.status === constants_1.CONTRACT_STATUS.PENDING) {
                    return this.contractDao.getContractsBy({ externalId: contract.external_id, status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED, constants_1.CONTRACT_STATUS.ACTIVE] })
                        .then(this.transaticonDao.updateContractsAndRelatedInfoAfterRejection)
                        .then(() => loggers_1.contractEventLogger.info({
                        type: 'contract_rejected',
                        data: { contract, reason: 'account_deleted' },
                        iduser,
                        facade_id: contract.facade_id,
                    }))
                        .then(() => contract_1.deleteContract(contract.external_id));
                }
                else {
                    return Promise.reject({ message: 'NOT_ALLOWED', reason: `Non-pending contract is found for user ${iduser}` });
                }
            }
            else {
                return null;
            }
        })
            .then(() => this.userDao.deleteUserByExternalId(iduser))
            .then(({ email: email_address }) => mailchimp_1.archiveUser(process.env.MAILCHIMP_LIST_ID)({ email_address }));
        this.findMeByExternalId = (iduser) => this.userDao.getUserBy({ iduser })
            .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by iduser ${iduser}` }) : user)
            .then(common_2.excludeKeysFromObject('password', 'user_key'));
        this.findUserByExternalId = (iduser) => this.userDao.getUserBy({ iduser })
            .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by iduser ${iduser}` }) : user)
            .then(common_2.excludeKeysFromObject('phone', 'email', 'registration_time', 'password', 'user_key'));
        this.getOtherUsers = (iduser, data) => {
            const { minAge, maxAge, locations, offset, limit } = data;
            let query = { offset, limit, exclude: [iduser] };
            if (minAge && maxAge) {
                if (Number(minAge) !== 18 || Number(maxAge) !== 100) {
                    const maxBirthday = user_1.convertAgeToBirthday(minAge);
                    const minBirthday = user_1.convertAgeToBirthday(maxAge);
                    const ageSpan = { maxBirthday, minBirthday };
                    query = Object.assign(query, { ageSpan });
                }
            }
            if (locations) {
                query = Object.assign(query, { locations: user_1.checkForMissingLocation(locations) });
            }
            return this.userDao.getUsersBy(query)
                .then(user_1.otherUserMapping);
        };
        this.getUserCount = (iduser, data) => {
            const { minAge, maxAge, locations } = data;
            let query = { exclude: [iduser] };
            if (minAge && maxAge) {
                if (Number(minAge) !== 18 || Number(maxAge) !== 100) {
                    const maxBirthday = user_1.convertAgeToBirthday(minAge);
                    const minBirthday = user_1.convertAgeToBirthday(maxAge);
                    const ageSpan = { maxBirthday, minBirthday };
                    query = Object.assign(query, { ageSpan });
                }
            }
            if (locations) {
                query = Object.assign(query, { locations: user_1.checkForMissingLocation(locations) });
            }
            return this.userDao.getUsersCountBy(query);
        };
        this.updateUserByExternalId = (iduser, data) => this.userDao.updateUserBy({ iduser }, data)
            .then(user => (data.birthday && mailchimp_1.updateUser(process.env.MAILCHIMP_LIST_ID)(mailchimp_1.formatUser(user)),
            data.is_test_complete && mailchimp_1.updateUserTags(process.env.MAILCHIMP_LIST_ID)(mailchimp_1.formatUser(user)),
            user));
        /**
         * NOTE:
         * If no password in db, authenticate with firebase first and hash the password, store it in db,
         * otherwise, check the password with hashed one and login
         *
         * For backward compatibility with firebase auth
         */
        this.login = (email, password) => this.userDao.getUserBy({ email: email.toLowerCase() })
            .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by email ${email}` }) : user)
            .then(user => !user.password ?
            user_2.signInWithEmailAndPassword(email, password).then(() => common_1.hashPassword(password))
                .then(hashedPassword => this.userDao.updateUserBy({ iduser: user.iduser }, { password: hashedPassword })
                .then(updatedUser => service_1.signInCommunity(updatedUser.iduser, constants_1.COMMUNITY)))
            : common_1.checkPassword(password, user.password).then(isVerified => isVerified
                ? service_1.signInCommunity(user.iduser, constants_1.COMMUNITY)
                : Promise.reject({ message: 'NOT_AUTHENTICATED', reason: `Incorrect password for user ${email}` })));
        this.sendVerificationEmail = (email) => this.userDao.getUserBy({ email })
            .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user is found by email ${email}` }) : service_1.signWithEmail(email))
            .then(code => email_1.sendSetPasswordEmail(email, code, process.env.COMMUNITY_FRONTEND, '/mail/user/verify')
            .then(() => code));
        this.setCodeByEmail = (email, code) => this.userDao.updateUserBy({ email }, { verification_code: code });
        this.verify = (verificationCode) => service_1.verify(verificationCode)
            .then(({ email }) => this.userDao.getUserBy({ email }))
            .then(user => user.verification_code !== verificationCode
            ? Promise.reject({ message: 'NOT_VERIFIED', reason: 'Verification failed with incorrect code' })
            : user.iduser);
        this.setPasswordById = (iduser, password) => common_1.hashPassword(password)
            .then(hashedPassword => this.userDao.updateUserBy({ iduser }, { password: hashedPassword, verification_code: null }));
        this.setRoomieTestStartedTagOnMailchimp = (iduser) => this.userDao.getUserBy({ iduser })
            .then(({ email: email_address }) => mailchimp_1.updateUserTags(process.env.MAILCHIMP_LIST_ID)({ email_address, tags: [{ name: constants_1.EVENT_MAILCHIMP_TAGS.ROOMIE_TEST_STARTED, status: constants_1.TAG_STATUS.ACTIVE }] }));
        this.sendPincode = (email) => this.userDao.getUserBy({ email, is_verified: null })
            .then(user => !user || !user.is_verified ? Promise.resolve(common_1.createRandomCode({ size: constants_1.PIN_CODE_SIZE }))
            .then(code => (redis_1.redisClient.setex(email, constants_1.PIN_CODE_EXPIRE_TIME, code),
            email_1.sendPinCodeEmail({ email, code })))
            : Promise.reject({ message: 'CONFLICT', reason: `User ${email} existed already` }));
        this.verifyPincode = (email, code) => Promise.resolve(redis_1.getAsync(email))
            .then(storedCode => storedCode === code)
            .then(isVerified => !isVerified ? Promise.reject({ message: 'NOT_VERIFIED', reason: `PIN code not correct for email ${email}` }) : redis_1.redisClient.del(email));
    }
};
UserService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('UserDao')),
    __param(1, inversify_1.inject('TransactionDao')),
    __param(2, inversify_1.inject('ContractDao')),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map