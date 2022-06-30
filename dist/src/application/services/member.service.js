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
exports.MemberService = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const common_1 = require("../../infrastructure/utils/common");
const constants_1 = require("../../infrastructure/constants");
let MemberService = class MemberService {
    constructor(projectFacadeDao, adminMemberNotesDao, applicationDao, interestsDao, memberTagsDao, userDao, userPreferencesDao, userProfilesDao, userScoreDao, contractDao, transactionDao) {
        this.projectFacadeDao = projectFacadeDao;
        this.adminMemberNotesDao = adminMemberNotesDao;
        this.applicationDao = applicationDao;
        this.interestsDao = interestsDao;
        this.memberTagsDao = memberTagsDao;
        this.userDao = userDao;
        this.userPreferencesDao = userPreferencesDao;
        this.userProfilesDao = userProfilesDao;
        this.userScoreDao = userScoreDao;
        this.contractDao = contractDao;
        this.transactionDao = transactionDao;
        this.getMember = (iduser) => this.userDao.getUserBy({ iduser })
            .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user found for iduser ${iduser}` }) : user)
            .then(common_1.excludeKeysFromObject('password', 'user_key'))
            .then(user => user.is_test_complete
            ? this.userScoreDao.getUserScoreByExternalId(iduser)
                .then(userScore => (Object.assign(Object.assign({}, user), { test_completed_at: userScore.created_at })))
            : user);
        this.getMemberNotes = (iduser) => this.adminMemberNotesDao.getAdminMemberNotes(iduser)
            .then(notes => !notes || !notes.tag_ids || notes.tag_ids.length === 0 ?
            notes : this.memberTagsDao.getMemberTags(notes.tag_ids)
            .then(tags => {
            notes.tags = tags;
            return notes;
        }));
        this.getMemberPreferences = (iduser) => this.userDao.getUserBy({ iduser })
            .then(({ user_key }) => this.userPreferencesDao.getUserPreferences(user_key));
        this.getMemberProfile = (iduser) => this.userProfilesDao.getUserProfile(iduser)
            .then(profile => !profile || !profile.interest_ids || profile.interest_ids.length === 0 ? profile :
            this.interestsDao.getInterestsByIds(profile.interest_ids)
                .then(interests => {
                profile.interests = interests;
                return profile;
            }));
        this.getMemberSubscriptions = (iduser) => this.applicationDao.getMemberApplications({ iduser }).then(applications => applications.length === 0 ? [] :
            Promise.resolve(applications.map(application => application.facade_id))
                .then(facadeIds => this.projectFacadeDao.getProjectFacades(facadeIds))
                .then(projects => projects.map(({ id, name }) => ({
                name,
                subscribed_at: applications.filter(application => application.facade_id === id)[0].created_at,
            }))));
        this.getMemberWishedRoomies = (iduser) => this.userDao.getUserBy({ iduser })
            .then(({ user_key }) => this.userPreferencesDao.getUserPreferences(user_key)
            .then(userPreference => !userPreference ? [] : userPreference.roomies)
            .then(ids => (!ids || ids.length === 0 ? [] : this.userDao.getUsersBy({ userKeys: ids }))));
        this.createMemberNotes = (data) => this.adminMemberNotesDao.createAdminMemberNotes(data);
        this.updateMemberNotes = (iduser, data) => this.adminMemberNotesDao.updateAdminMemberNotes(iduser, data);
    }
    approveMemberToTenant(iduser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contract = yield this.contractDao.getContractBy({ iduser, status: [constants_1.CONTRACT_STATUS.SIGNED] });
                if (!contract) {
                    return Promise.reject({ message: 'NOT_FOUND', reason: `No signed contracts found for ${iduser}` });
                }
                yield this.transactionDao.updateContractAndRelatedInfoAfterApproveTenant(contract);
                return this.getMember(iduser);
            }
            catch (e) {
                return Promise.reject({ message: 'INTERNAL_SERVER_ERROR', reason: 'Approve tenant failed', detail: e.message });
            }
        });
    }
};
MemberService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ProjectFacadeDao')),
    __param(1, inversify_1.inject('AdminMemberNotesDao')),
    __param(2, inversify_1.inject('ApplicationDao')),
    __param(3, inversify_1.inject('InterestsDao')),
    __param(4, inversify_1.inject('MemberTagsDao')),
    __param(5, inversify_1.inject('UserDao')),
    __param(6, inversify_1.inject('UserPreferencesDao')),
    __param(7, inversify_1.inject('UserProfilesDao')),
    __param(8, inversify_1.inject('UserScoreDao')),
    __param(9, inversify_1.inject('ContractDao')),
    __param(10, inversify_1.inject('TransactionDao')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], MemberService);
exports.MemberService = MemberService;
//# sourceMappingURL=member.service.js.map