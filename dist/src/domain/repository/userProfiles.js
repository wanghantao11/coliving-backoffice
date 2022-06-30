"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfilesRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const userProfiles_1 = require("../entity/userProfiles");
let UserProfilesRepository = class UserProfilesRepository {
    constructor() {
        this.REPO_NAME = 'user_profiles';
        this.getUserProfile = (iduser) => typeorm_1.getRepository(userProfiles_1.UserProfiles, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('iduser = :iduser', { iduser })
            .getOne();
        this.createUserProfile = (data) => typeorm_1.getRepository(userProfiles_1.UserProfiles, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(userProfiles_1.UserProfiles)
            .values(Object.assign({}, data))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.updateUserProfile = (iduser, data) => typeorm_1.getRepository(userProfiles_1.UserProfiles, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('iduser = :iduser', { iduser })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
    }
};
UserProfilesRepository = __decorate([
    inversify_1.injectable()
], UserProfilesRepository);
exports.UserProfilesRepository = UserProfilesRepository;
//# sourceMappingURL=userProfiles.js.map