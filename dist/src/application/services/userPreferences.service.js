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
exports.UserPreferencesService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const uuid = require("uuid/v4");
const entity_1 = require("./../../domain/entity/");
const email_1 = require("./../../infrastructure/utils/email");
const service_1 = require("./../auth/jwt/service");
const user_1 = require("../../infrastructure/utils/user");
const common_1 = require("../../infrastructure/utils/common");
const constants_1 = require("../../infrastructure/constants");
let UserPreferencesService = class UserPreferencesService {
    constructor(userDao, userPreferencesDao, userPreferredRoommatesDao, transactionDao, offerDao) {
        this.userDao = userDao;
        this.userPreferencesDao = userPreferencesDao;
        this.userPreferredRoommatesDao = userPreferredRoommatesDao;
        this.transactionDao = transactionDao;
        this.offerDao = offerDao;
        this.createUserPreferences = (preferences) => this.userPreferencesDao.createUserPreferences(preferences);
        this.getUserPreferences = (iduser) => this.userDao.getUserBy({ iduser })
            .then(({ user_key }) => this.userPreferencesDao.getUserPreferences(user_key)
            .then(userPreferences => !userPreferences
            ? this.userPreferencesDao.createUserPreferences({ iduser: user_key, locations: [] })
            : userPreferences));
        this.updateUserPreferences = (iduser, data) => this.userDao.getUserBy({ iduser })
            .then(({ user_key }) => this.userPreferencesDao.updateUserPreferences(user_key, data))
            .then(updatedPreference => (data.needs_contact_back && this.userDao.getUserBy({ iduser })
            .then(({ email, first_name }) => email_1.sendCallbackAutoReplyEmail({ email, first_name })),
            updatedPreference));
        this.sendInvitation = (inviter, email) => this.userDao.getUserBy({ iduser: inviter.iduser })
            .then(inviter => inviter.email === common_1.formatEmail(email) ? Promise.reject({ message: 'NOT_ALLOWED', reason: 'Roommate can not be self' }) : inviter)
            .then(inviter => user_1.isUserCandidateOrTenant(inviter)
            ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${inviter.iduser} has accepted offer or signed contract` }) : null)
            .then(() => this.userDao.getUserBy({ email }))
            .then(invitee => !invitee ? Promise.reject({ message: 'NOT_FOUND', reason: 'User email does not exist' }) : invitee)
            .then(invitee => !invitee.is_test_complete
            ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${invitee.iduser} has not completed test` }) : invitee)
            .then(invitee => user_1.isUserCandidateOrTenant(invitee)
            ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${invitee.iduser} has accepted offer or signed contract` }) : invitee)
            .then(invitee => service_1.signShareRoomInvitation(inviter, invitee.iduser)
            .then(invitation_code => email_1.emailAxiosPost('/mail/preferred-roommate-invitation', {
            inviter: {
                img_url: inviter.img_url,
                first_name: inviter.first_name,
            },
            invitee: {
                email: invitee.email,
                first_name: invitee.first_name,
            },
            link: `${process.env.COMMUNITY_FRONTEND}/preferred-roommate/${invitation_code}`,
        }).then(() => this.userPreferredRoommatesDao.createUserPreferredRoommate({ inviter_id: inviter.iduser, invitee_id: invitee.iduser, invitation_code }))));
        this.replyInvitation = (data) => this.userDao.getUserBy({ iduser: data.inviter_id })
            .then(inviter => user_1.isUserCandidateOrTenant(inviter)
            ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${inviter.iduser} has accepted offer or signed contract` }) : null)
            .then(() => this.userDao.getUserBy({ iduser: data.invitee_id })
            .then(invitee => user_1.isUserCandidateOrTenant(invitee)
            ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${invitee.iduser} has accepted offer or signed contract` }) : null))
            .then(() => this.transactionDao.acceptPreferredRommmateInvitation(data));
        this.deletePreferredRoommate = (id) => this.userPreferredRoommatesDao.deleteUserPreferredRoommate(id);
        this.getPreferredRoommate = (iduser) => this.userPreferredRoommatesDao.getUserPreferredRoommates(iduser)
            .then(preferredRoommate => !preferredRoommate ? Promise.reject({ message: 'NOT_FOUND', reason: `No roommate is found by iduser ${iduser}` }) : preferredRoommate);
        this.connectPreferredRoommate = (inviter_id, { email, first_name, last_name, client_id }) => 
        // check if user exists
        this.userDao.getUserBy({ email, is_verified: null })
            .then(user => !user ?
            // if user not exist, create a shadow user
            entity_1.User.generateUser({ client_id, email, first_name, last_name, tos_version_accepted: 0, iduser: uuid(), is_verified: false })
                .then(this.transactionDao.createUserWithPreferencesAndProfiles)
            : user)
            // check if self
            .then(user => user.iduser === inviter_id ? Promise.reject({ message: 'NOT_ALLOWED', reason: 'Roommate can not be self' }) : user)
            // check user type
            // TODO should be user.user_type === USER_TYPE.CANDIDATE since if the user is already a tenant,
            // we should allow him to get connected, leaving the rest of the checks to host then
            .then(user => user.user_type !== constants_1.USER_TYPE.LIGHT ? Promise.reject({ message: 'NOT_ALLOWED', reason: 'Roommate has already pending contract' }) : user)
            .then(({ iduser: invitee_id, user_key: invitee_user_key }) => 
        // pair 2 users and sync preference
        this.transactionDao.connectPreferredRoommate({ inviter_id, invitee_id }, invitee_user_key)
            // create the same offer for invitee
            .then(() => this.offerDao.getOfferBy({ iduser: inviter_id, status: constants_1.OFFER_STATUS.PENDING }))
            .then(offer => offer && entity_1.Offer.generateOffer({
            iduser: invitee_id,
            room_id: offer.room_id,
            facade_id: offer.facade_id,
            is_preferences_matched: offer.is_preferences_matched,
        })
            .then(this.offerDao.createOffer)));
    }
};
UserPreferencesService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('UserDao')),
    __param(1, inversify_1.inject('UserPreferencesDao')),
    __param(2, inversify_1.inject('UserPreferredRoommatesDao')),
    __param(3, inversify_1.inject('TransactionDao')),
    __param(4, inversify_1.inject('OfferDao')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], UserPreferencesService);
exports.UserPreferencesService = UserPreferencesService;
//# sourceMappingURL=userPreferences.service.js.map