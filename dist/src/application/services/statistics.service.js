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
exports.StatisticsService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const lodash_1 = require("lodash");
const user_1 = require("./../../infrastructure/utils/user");
let StatisticsService = class StatisticsService {
    constructor(applicationDao, offerEventsDao, contractEventsDao, userDao, contractDao, roomDao) {
        this.applicationDao = applicationDao;
        this.offerEventsDao = offerEventsDao;
        this.contractEventsDao = contractEventsDao;
        this.userDao = userDao;
        this.contractDao = contractDao;
        this.roomDao = roomDao;
        this.getGeneralStats = (clientId) => Promise.all([
            this.contractDao.getPendingContractsByClientId(clientId),
            this.roomDao.getRoomStatisticsByClientId(clientId),
            this.userDao.getTotalNumberOfUsersByClientId(clientId),
            this.applicationDao.getTotalNumberOfSubscribersByClientId(clientId),
        ])
            .then(([contracts, rooms, members, subscribers]) => ({ contracts, rooms, members, subscribers }));
        this.getOffersStatsByDateRange = (filters) => {
            const startDate = user_1.convertFromDateStringToISOString(filters.start_date);
            const endDate = user_1.convertToDateStringToISOString(filters.end_date);
            return this.offerEventsDao.getOfferEventsByDateRange(startDate, endDate)
                .then(dataGroupedByProjects => dataGroupedByProjects.map(({ facade_id, number_of_accepted_offers, number_of_rejected_offers, number_of_sent_offers, generated_offers, rejection_reasons }) => ({
                facade_id,
                number_of_accepted_offers,
                number_of_rejected_offers,
                number_of_sent_offers,
                number_of_room_offered: generated_offers ? lodash_1.uniq(lodash_1.flatten(generated_offers).map(({ room_id }) => room_id)).length : 0,
                count_of_rejection_reason: rejection_reasons ? rejection_reasons.reduce((result, reasons) => {
                    Object.keys(reasons).forEach(reason => {
                        result[reason] = result[reason] ? result[reason] + 1 : 1;
                    });
                    return result;
                }, {}) : {},
            })));
        };
        this.getContractsStatsByDateRange = (filters) => {
            const startDate = user_1.convertFromDateStringToISOString(filters.start_date);
            const endDate = user_1.convertToDateStringToISOString(filters.end_date);
            return this.contractEventsDao.getContractEventsByDateRange(startDate, endDate);
        };
        this.getSalesProgressStats = (filters) => __awaiter(this, void 0, void 0, function* () {
            const startDate = user_1.convertFromDateStringToISOString(filters.start_date);
            const endDate = user_1.convertToDateStringToISOString(filters.end_date);
            const facadeId = Number(filters.facade_id);
            const contractEvents = yield this.contractEventsDao.getContractEventsDetailedByDateRange(startDate, endDate, facadeId);
            const offerEvents = yield this.offerEventsDao.getOfferEventsDetailedByDateRange(startDate, endDate, facadeId);
            return ([...contractEvents, ...offerEvents]).reduce((prev, curr) => {
                const existDate = prev.findIndex(({ date }) => date === curr.date);
                if (existDate > -1) {
                    prev[existDate] = Object.assign(Object.assign({}, prev[existDate]), curr);
                    return prev;
                }
                prev.push(curr);
                return prev;
            }, []);
        });
    }
    getApplicationsStatsByDateRange(filters) {
        const startDate = user_1.convertFromDateStringToISOString(filters.start_date);
        const endDate = user_1.convertToDateStringToISOString(filters.end_date);
        return this.applicationDao.getCountOfApplicationsByDateRange(startDate, endDate)
            .then(result => result.map(item => ({
            member: item.count || 0,
            member_count_test_complete: item.count_test_complete || 0,
            project_id: item.facade_id,
            project_name: item.facade_name,
            date: item.date,
        })));
    }
    getRegistrationsStatsByDateRange(filters) {
        const startDate = user_1.convertFromDateStringToISOString(filters.start_date);
        const endDate = user_1.convertToDateStringToISOString(filters.end_date);
        return this.userDao.getCountOfUsersByDateRange(startDate, endDate)
            .then(result => result.map(item => ({
            count: item.count || 0,
            date: item.date,
        })));
    }
    getMembersStatsByDateRange(filters) {
        const startDate = user_1.convertFromDateStringToISOString(filters.start_date);
        const endDate = user_1.convertToDateStringToISOString(filters.end_date);
        const registrationTimeSpan = { startDate, endDate };
        return this.userDao.getUsersCountBy({ registrationTimeSpan });
    }
};
StatisticsService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ApplicationDao')),
    __param(1, inversify_1.inject('OfferEventsDao')),
    __param(2, inversify_1.inject('ContractEventsDao')),
    __param(3, inversify_1.inject('UserDao')),
    __param(4, inversify_1.inject('ContractDao')),
    __param(5, inversify_1.inject('RoomDao')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], StatisticsService);
exports.StatisticsService = StatisticsService;
//# sourceMappingURL=statistics.service.js.map