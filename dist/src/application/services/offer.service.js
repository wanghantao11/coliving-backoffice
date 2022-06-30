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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const httpContext = require("express-http-context");
const room_1 = require("../../infrastructure/constants/room");
const offer_queue_1 = require("../../infrastructure/persistence/queue/offer.queue");
const common_1 = require("../../infrastructure/utils/common");
const email_1 = require("../../infrastructure/utils/email");
const loggers_1 = require("../../infrastructure/utils/loggers");
const offer_1 = require("../../infrastructure/utils/offer");
const error_1 = require("../../infrastructure/utils/error");
const queue_config_1 = require("../../../config/queue-config");
const user_1 = require("../../infrastructure/utils/user");
const service_1 = require("../auth/jwt/service");
const constants_1 = require("../../infrastructure/constants");
const loggers_2 = require("../../infrastructure/utils/loggers");
let OfferService = class OfferService {
    constructor(offerDao, adminDao, projectDao, roomDao, transactionDao, userPreferencesDao, userDao, userProfilesDao, userScoreDao, userPreferredRoommatesDao, contractDao) {
        this.offerDao = offerDao;
        this.adminDao = adminDao;
        this.projectDao = projectDao;
        this.roomDao = roomDao;
        this.transactionDao = transactionDao;
        this.userPreferencesDao = userPreferencesDao;
        this.userDao = userDao;
        this.userProfilesDao = userProfilesDao;
        this.userScoreDao = userScoreDao;
        this.userPreferredRoommatesDao = userPreferredRoommatesDao;
        this.contractDao = contractDao;
        this.createOffer = (offer) => this.offerDao.createOffer(offer);
        this.acceptOffer = (id) => this.offerDao.getOfferBy({ id })
            .then(offer => !offer ? Promise.reject({ message: 'NOT_FOUND', reason: `No offer is found by id ${id}` }) : offer)
            .then(offer => this.offerDao.getOffersBy({ iduser: offer.iduser })
            .then(offer_1.checkIfUserHasAcceptedOffer)
            .then(hasAcceptedOffer => hasAcceptedOffer ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${offer.iduser} has accepted offer already` }) : offer))
            .then(offer => this.userPreferredRoommatesDao.getPairedPreferredRoommate(offer.iduser)
            .then(roommate => !roommate ? [offer.iduser] : [roommate.inviter_id, roommate.invitee_id])
            .then(idusers => this.roomDao.getRoomBy({ id: offer.room_id })
            .then(room => room.status === room_1.ROOM_STATUS.AVAILABLE ?
            this.transactionDao.updateRoomAndOfferStatusAndUserType(offer, idusers) :
            Promise.reject({ message: 'NOT_ALLOWED', reason: 'Room is not available anymore' }))))
            .then(offer => (loggers_1.offerEventLogger.info({
            type: 'offer_accepted',
            data: { offer },
            facade_id: offer.facade_id,
        }), offer));
        this.rejectOffer = (id, rejection_reason) => this.offerDao.getOfferBy({ id })
            .then(offer => !offer ? Promise.reject({ message: 'NOT_FOUND', reason: `No offer is found by id ${id}` }) : offer)
            .then(offer => this.userPreferredRoommatesDao.getPairedPreferredRoommate(offer.iduser)
            .then(roommate => !roommate ? [offer.iduser] : [roommate.inviter_id, roommate.invitee_id])
            .then(idusers => this.roomDao.getRoomBy({ id: offer.room_id })
            .then(room => room.status !== room_1.ROOM_STATUS.AVAILABLE
            ? Promise.reject({ message: 'NOT_ALLOWED', reason: 'Room is not available anymore' })
            : Promise.all(idusers.map(iduser => (offer_1.processOfferRejection({ rejection_reason, iduser, offer }, this.offerDao, this.userDao, this.userPreferencesDao),
                this.userDao.getUserBy({ iduser }).then(user => this.projectDao.getProjectByFacadeId(offer.facade_id).then(project => email_1.emailAxiosPost('/mail/offer-rejection', {
                    name: `${user.first_name} ${user.last_name}`,
                    sent_at: common_1.convertDateToISOString(offer.created_at).slice(0, 10),
                    move_in_date: room.move_in_date || project.move_in_date,
                    room: room.name,
                    project: project.name,
                    reject_reason: JSON.stringify(rejection_reason),
                }))),
                loggers_1.offerEventLogger.info({
                    type: 'offer_rejected',
                    data: { offer: { room_id: offer.room_id, iduser }, reason: rejection_reason },
                    facade_id: offer.facade_id,
                })))))));
        this.getOffersByExternalId = (iduser) => this.offerDao.getOffersBy({ iduser })
            .then((offers) => offers.length === 0 ? Promise.reject({ message: 'NO_CONTENT', reason: `No offer is found for user ${iduser}` }) : offers);
        this.requestOffer = (data) => {
            offer_queue_1.OfferQueue.add('requestOffer', data, queue_config_1.default.job);
            return Promise.resolve(true);
        };
        this.searchMatchedOffer = (data) => {
            const { iduser, preferred_roommate_iduser, facade_id } = data, preferences = __rest(data, ["iduser", "preferred_roommate_iduser", "facade_id"]);
            let isPreferencesMatched = true;
            let searchOfferLog = {};
            httpContext.set('iduser', iduser);
            loggers_1.offerEventLogger.info({ type: 'search_started', data: { preferred_roommate_iduser, preferences }, facade_id });
            return this.userDao.getUserBy({ iduser })
                .then(user_1.isCandidate)
                .then(isCandidate => isCandidate ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${iduser} is candidate`, data: searchOfferLog }) : null)
                .then(() => this.offerDao.getOffersBy({ iduser }))
                .then((offers) => offers.length !== 0 ? Promise.resolve(offer_1.checkIfUserHasNonRejectedOffers(offers))
                .then(hasNonRejectedOffers => hasNonRejectedOffers && Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${iduser} has non-rejected Offers`, data: searchOfferLog }))
                : null)
                .then(() => this.roomDao.getRoomsBy({ facadeId: facade_id, status: room_1.ROOM_STATUS.AVAILABLE }))
                .then(rooms => offer_1.checkIsRoomListEmpty(rooms) ?
                Promise.reject({ message: 'NOT_FOUND', reason: 'No available room is found', data: searchOfferLog })
                : (searchOfferLog.total_available = rooms.length, rooms))
                .then(rooms => this.offerDao.getOffersBy({ iduser, status: room_1.OFFER_STATUS.REJECTED })
                .then(offer_1.excludeRejectedOffersFromRooms(rooms)))
                .then(rooms => offer_1.checkIsRoomListEmpty(rooms) ?
                Promise.reject({ message: 'NOT_FOUND', reason: 'No available room is found after filtering out rejected rooms', data: searchOfferLog })
                : (searchOfferLog.after_rejected_offers = rooms.length, rooms))
                .then(offer_1.excludeOrphanRooms)
                .then(rooms => offer_1.checkIsRoomListEmpty(rooms) ?
                Promise.reject({ message: 'NOT_FOUND', reason: 'Available rooms are orphan rooms', data: searchOfferLog })
                : (searchOfferLog.after_orphan_check = rooms.length, rooms))
                .then(rooms => preferred_roommate_iduser
                ? this.userDao.getUserBy({ iduser: preferred_roommate_iduser })
                    .then(({ user_key }) => this.userPreferencesDao.getUserPreferences(user_key))
                    .then(offer_1.getJointPreferences(preferences))
                    .then(offer_1.filterRoomsByPreferences(rooms))
                : offer_1.filterRoomsByPreferences(rooms)(preferences))
                .then(({ rooms, isPreferencesMatched: _isPreferencesMatched, filterLog }) => offer_1.checkIsRoomListEmpty(rooms) ?
                Promise.reject({ message: 'NOT_FOUND', reason: 'No available room is found after preference filtering', log: Object.assign(Object.assign({}, searchOfferLog), filterLog) })
                : (isPreferencesMatched = _isPreferencesMatched, searchOfferLog = Object.assign(Object.assign({}, searchOfferLog), filterLog), rooms))
                .then(offer_1.pickNonIdenticalRooms)
                .then(rooms => this.roomDao.getRoomsBy({ apartmentIds: rooms.map(room => room.apartment_id) })
                .then(allRooms => offer_1.checkIfAllApartmentsEmpty(allRooms)
                ? offer_1.pickRoomsByPriority(rooms)(preferences)
                : Promise.all([
                    this.userScoreDao.getUserScoreByExternalId(iduser),
                    this.roomDao.getUserScoresForTenantsAndCandidatesByRoomIds(allRooms.map(room => room.id)),
                ])
                    .then(([userScore, tenantsWithScore]) => offer_1.pickRoomsByScore(rooms)(userScore, tenantsWithScore))
                    .then(rooms => offer_1.checkIsRoomListEmpty(rooms) ?
                    Promise.reject({ message: 'NOT_FOUND', reason: 'No available room is found after picking by score', data: searchOfferLog })
                    : (searchOfferLog.after_picking_by_score = rooms.length, rooms))))
                .then(offer_1.pickTopRankedRooms)
                .then(pickedRooms => pickedRooms.map(room => preferred_roommate_iduser
                ? this.offerDao.createOffersForPair(iduser, preferred_roommate_iduser, room.id, facade_id, isPreferencesMatched)
                : this.offerDao.createOffer({ iduser, room_id: room.id, facade_id, is_preferences_matched: isPreferencesMatched })))
                .then(promises => Promise.all(promises))
                .then(offers => loggers_1.offerEventLogger.info({ type: 'search_ended', data: { offers, search_offer_log: searchOfferLog }, facade_id }))
                .then(() => this.userDao.getUserBy({ iduser }).then(user => service_1.signInCommunity(user.iduser, constants_1.COMMUNITY, '365d').then(token => email_1.emailAxiosPost('/mail/offer-notification', { email: user.email, link: process.env.COMMUNITY_FRONTEND + `/offers?token=${token}` }))))
                .catch(error_1.handleNoOfferException(facade_id));
        };
        this.sendOffersToSelectedMembers = (room_id, facade_id, facade_name, offer_info_list, move_in_date, sender_id) => Promise.all(offer_info_list.map(({ iduser, is_preferences_matched, matching_score }) => this.contractDao.getContractsBy({ iduser, status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED, constants_1.CONTRACT_STATUS.ACTIVE] })
            .then(contracts => {
            const hasSignedContract = !!contracts.find(contract => contract.status === constants_1.CONTRACT_STATUS.SIGNED);
            const hasPendingContract = !!contracts.find(contract => contract.status === constants_1.CONTRACT_STATUS.PENDING);
            const hasActiveContract = !!contracts.find(contract => contract.status === constants_1.CONTRACT_STATUS.ACTIVE);
            if (hasActiveContract) {
                return Promise.all(contracts.filter(contract => contract.status === constants_1.CONTRACT_STATUS.ACTIVE)
                    .map(contract => move_in_date && contract.start_date > move_in_date
                    ? Promise.reject({ message: 'NOT_ALLOWED', reason: `user ${iduser} already has an onging contract after this move-in date` })
                    : null))
                    .then(() => move_in_date && this.roomDao.updateRoomBy({ id: room_id }, { move_in_date }));
            }
            else if (hasSignedContract) {
                return Promise.reject({ message: 'NOT_ALLOWED', reason: `user ${iduser} has signed contract` });
            }
            else if (hasPendingContract) {
                return Promise.all(contracts.filter(contract => contract.status === constants_1.CONTRACT_STATUS.PENDING)
                    .map(contract => this.transactionDao.updateContractsAndRelatedInfoAfterRejection([contract])
                    .then(() => loggers_2.contractEventLogger.info({
                    type: 'contract_rejected',
                    data: { contract, reason: 'admin' },
                    facade_id,
                }))));
            }
        })
            .then(() => this.offerDao.getOffersBy({ iduser, status: room_1.OFFER_STATUS.PENDING })
            .then(offers => offers.length !== 0 && Promise.all(offers.map(offer => this.offerDao.updateOfferBy({ id: offer.id }, { status: room_1.OFFER_STATUS.REJECTED })
            .then(() => loggers_1.offerEventLogger.info({
            type: 'offer_rejected',
            data: { offer: { room_id: offer.room_id, iduser }, reason: { admin: true } },
            facade_id: offer.facade_id,
        }))))))
            .then(() => this.offerDao.createOffer({ iduser, room_id, facade_id, is_preferences_matched, is_sent_by_admin: true, matching_score })
            .then(offer => (httpContext.set('iduser', iduser), loggers_1.offerEventLogger.info({ type: 'offer_sent', data: { offer }, facade_id })))
            .then(() => this.userDao.getUserBy({ iduser })
            .then(user => {
            email_1.emailAxiosPost('/mail/offer-admin-notification', { email: user.email, link: process.env.COMMUNITY_FRONTEND + '/offers' });
            return `${user.first_name} ${user.last_name}`;
        })))))
            .then(data => this.adminDao.getAdminBy({ id: sender_id })
            .then(admin => this.roomDao.getRoomBy({ id: room_id })
            .then(room => email_1.emailAxiosPost('/mail/offer-admin-summary', { email: admin.email, data, facade_name, room_name: room.name, move_in_date: room.move_in_date }))));
        this.requestManualOffer = (iduser, project_name) => this.userDao.getUserBy({ iduser })
            .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user found for iduser ${iduser}` }) : user)
            .then(({ email, first_name, last_name, user_key, age }) => this.userPreferencesDao.updateUserPreferences(user_key, { needs_manual_offer: true })
            .then(() => (email_1.emailAxiosPost('/mail/manual-offer-request-confirmation/user', { email, first_name, last_name, project_name }),
            email_1.emailAxiosPost('/mail/manual-offer-request-confirmation/admin', { age, first_name, last_name, link: `${process.env.BACKOFFICE_FRONTEND}/members/${iduser}` }))));
    }
};
OfferService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('OfferDao')),
    __param(1, inversify_1.inject('AdminDao')),
    __param(2, inversify_1.inject('ProjectDao')),
    __param(3, inversify_1.inject('RoomDao')),
    __param(4, inversify_1.inject('TransactionDao')),
    __param(5, inversify_1.inject('UserPreferencesDao')),
    __param(6, inversify_1.inject('UserDao')),
    __param(7, inversify_1.inject('UserProfilesDao')),
    __param(8, inversify_1.inject('UserScoreDao')),
    __param(9, inversify_1.inject('UserPreferredRoommatesDao')),
    __param(10, inversify_1.inject('ContractDao')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], OfferService);
exports.OfferService = OfferService;
//# sourceMappingURL=offer.service.js.map