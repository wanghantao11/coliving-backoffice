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
exports.MembersService = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const lodash_1 = require("lodash");
const offer_1 = require("../../infrastructure/utils/offer");
let MembersService = class MembersService {
    constructor(applicationDao, contractDao, offerDao, roomDao, userDao, userScoreDao) {
        this.applicationDao = applicationDao;
        this.contractDao = contractDao;
        this.offerDao = offerDao;
        this.roomDao = roomDao;
        this.userDao = userDao;
        this.userScoreDao = userScoreDao;
        this.getInterestedMembers = (query) => this.applicationDao.getInterestedMembers(query);
        this.getPendingOfferMembers = (query) => this.offerDao.getPendingOfferMembers(query);
        this.getContractMembers = (query) => this.contractDao.getContractMembers(query);
        this.getSubscribedMembers = (facadeId, apartmentId, query) => {
            const { matching_score, sort_by, sort_order, offset = 0, limit = 10 } = query;
            const matchingScore = Number(matching_score);
            const sliceStart = Number(offset);
            const sliceEnd = Number(offset) + Number(limit);
            let total;
            return this.userDao.getSubscribedMembers(facadeId, query)
                .then(([count, members]) => count === 0 ?
                Promise.reject({ message: 'NO_CONTENT', reason: `No subscribed member found for project facade ${facadeId} with apartment ${apartmentId}` })
                : (total = count, members.map(member => (Object.assign(Object.assign({}, member), { matchingScore: '' })))))
                .then(members => Promise.resolve(members.filter(member => member.is_test_complete))
                .then(membersCompleteTest => membersCompleteTest.length !== 0 ?
                this.getSubscribedMembersMatchScore(membersCompleteTest.map(member => member.iduser), apartmentId)
                    .then(membersScore => membersCompleteTest.map(member => (Object.assign(Object.assign({}, member), { matchingScore: (lodash_1.find(membersScore, ['iduser', member.iduser]) || { matchingScore: '' }).matchingScore })))) : membersCompleteTest)
                .then(membersWithScore => matchingScore ? membersWithScore.filter(member => member.matchingScore >= matchingScore) : membersWithScore)
                .then(membersWithScore => ([...membersWithScore, ...members.filter(member => !member.is_test_complete)])))
                .then(membersWithScore => sort_by !== 'score' ? membersWithScore
                : lodash_1.orderBy(membersWithScore, 'matchingScore', [sort_order.toLowerCase()]))
                .then(membersWithScoreSorted => Promise.all(membersWithScoreSorted.map((_a) => {
                var { user_preferred_roommates } = _a, rest = __rest(_a, ["user_preferred_roommates"]);
                return user_preferred_roommates ? this.getSubscribedMembersMatchScore([user_preferred_roommates[0].iduser], apartmentId)
                    .then(scoreList => scoreList.length === 0 ?
                    (Object.assign({ user_preferred_roommates: Object.assign({ matchingScore: '' }, user_preferred_roommates[0]) }, rest)) :
                    (Object.assign({ user_preferred_roommates: Object.assign({ matchingScore: scoreList[0].matchingScore }, user_preferred_roommates[0]) }, rest)))
                    : (Object.assign({ user_preferred_roommates }, rest));
            })))
                .then(membersWithScoreSorted => ([total, membersWithScoreSorted.slice(sliceStart, sliceEnd)]));
        };
        this.getSubscribedMembersMatchScore = (idusers, apartmentId) => Promise.all([this.userScoreDao.getUserScoresByExternalIds(idusers),
            this.roomDao.getRoomsBy({ apartmentIds: [apartmentId] })
                .then(rooms => this.roomDao.getUserScoresForTenantsAndCandidatesByRoomIds(rooms.map(room => room.id)))])
            .then(([userScores, tenantAndCandidateScores]) => userScores.map(userScore => ({ iduser: userScore.iduser, matchingScore: offer_1.scoreInPercentageGenerator(userScore, tenantAndCandidateScores) })));
    }
};
MembersService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ApplicationDao')),
    __param(1, inversify_1.inject('ContractDao')),
    __param(2, inversify_1.inject('OfferDao')),
    __param(3, inversify_1.inject('RoomDao')),
    __param(4, inversify_1.inject('UserDao')),
    __param(5, inversify_1.inject('UserScoreDao')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], MembersService);
exports.MembersService = MembersService;
//# sourceMappingURL=members.service.js.map