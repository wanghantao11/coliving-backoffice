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
exports.UserProfilesService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const mailchimp_1 = require("../../infrastructure/utils/mailchimp");
let UserProfilesService = class UserProfilesService {
    constructor(userProfilesDao, userDao) {
        this.userProfilesDao = userProfilesDao;
        this.userDao = userDao;
        this.createUserProfile = (data) => this.userProfilesDao.createUserProfile(data);
        this.getUserProfile = (iduser) => this.userProfilesDao.getUserProfile(iduser)
            .then(userProfiles => !userProfiles
            ? this.userProfilesDao.createUserProfile({ iduser, interest_ids: [] })
            : userProfiles);
        this.updateUserProfile = (iduser, data) => this.userProfilesDao.updateUserProfile(iduser, data)
            .then(userProfile => this.userDao.getUserBy({ iduser })
            .then(({ email }) => data.interest_ids ?
            Promise.resolve(mailchimp_1.formatUser({ email, interest_ids: userProfile.interest_ids }))
                .then(mailchimp_1.updateUser(process.env.MAILCHIMP_LIST_ID)) : null)
            .then(() => userProfile));
    }
};
UserProfilesService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('UserProfilesDao')),
    __param(1, inversify_1.inject('UserDao')),
    __metadata("design:paramtypes", [Object, Object])
], UserProfilesService);
exports.UserProfilesService = UserProfilesService;
//# sourceMappingURL=userProfiles.service.js.map