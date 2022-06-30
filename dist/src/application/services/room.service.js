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
exports.RoomService = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const constants_1 = require("./../../infrastructure/constants");
const common_1 = require("./../../infrastructure/utils/common");
let RoomService = class RoomService {
    constructor(adminMemberNotesDao, labelDao, roomDao, contractDao, offerDao, userDao, userPreferencesDao, userScoreDao) {
        this.adminMemberNotesDao = adminMemberNotesDao;
        this.labelDao = labelDao;
        this.roomDao = roomDao;
        this.contractDao = contractDao;
        this.offerDao = offerDao;
        this.userDao = userDao;
        this.userPreferencesDao = userPreferencesDao;
        this.userScoreDao = userScoreDao;
        this.createRoom = (room) => this.roomDao.createRoom(room);
        this.deleteRoom = (id) => this.roomDao.getRoomBy({ id: Number(id) })
            .then(room => room && ![constants_1.ROOM_STATUS.RESERVED, constants_1.ROOM_STATUS.OCCUPIED].includes(room.status)
            ? this.roomDao.deleteRoom(Number(id))
            : Promise.reject({ message: 'NOT_ALLOWED', reason: `Room ${id} is either reserved or occupied` }));
        this.deleteRooms = (ids) => Promise.all([ids.forEach(id => this.roomDao.deleteRoom(id))]);
        this.getLabelsByRoomId = (id) => this.roomDao.getRoomBy({ id: Number(id) }).then(room => this.labelDao.getLabels(room.label_ids));
        this.getPendingOffersSentByAdminByRoomId = (id) => this.offerDao.getOffersBy({ is_sent_by_admin: true, roomId: Number(id), status: constants_1.OFFER_STATUS.PENDING })
            .then(offers => Promise.all(offers && offers.length > 0 ? offers.map(({ iduser, created_at, matching_score }) => Promise.all([
            this.userDao.getUserBy({ iduser }),
            this.adminMemberNotesDao.getAdminMemberNotes(iduser)
        ])
            .then(([user, notes]) => this.userPreferencesDao.getUserPreferences(user.user_key)
            .then(({ move_in_date_from, move_in_date_to }) => ({
            iduser,
            sent_at: created_at,
            birthday: user.birthday,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            img_url: user.img_url,
            matching_score,
            move_in_date_from,
            move_in_date_to,
            notes: notes ? notes.description : '',
        })))) : []));
        this.getRoom = (id) => this.roomDao.getRoomBy({ id: Number(id) });
        this.getRooms = (ids) => this.roomDao.getRoomsBy({ ids });
        this.getRoomsByFacadeId = (id, today) => __awaiter(this, void 0, void 0, function* () {
            const rooms = yield this.roomDao.getRoomsBy({ facadeId: Number(id) });
            if (!today) { // If date not passed then don't get tenancy for room
                return rooms;
            }
            return Promise.all(rooms.map((room) => __awaiter(this, void 0, void 0, function* () {
                const tenancy = yield this.getTenancyBy({ room_id: room.id, today });
                return Object.assign(Object.assign({}, room), { has_future_tenants: tenancy.future.length > 0 });
            })));
        });
        this.getRoomsWithTenants = (facadeId, query) => this.roomDao.getRoomsWithTenantsBy(Object.assign(Object.assign({}, query), { facadeId }))
            .then(roomsWithTenants => roomsWithTenants.reduce((result, { room_id, users }) => (result[room_id] = users.map(common_1.excludeKeysFromObject('password', 'user_key')), result), {}));
        this.getRoomsWithTerminatedContracts = (facadeId) => this.roomDao.getRoomsWithTerminatedContractsByFacadeId(facadeId).then(roomsAndContracts => roomsAndContracts.reduce((result, { room_id, contracts }) => (result[room_id] = contracts[0], result), {}));
        this.getTenancyBy = (filter) => __awaiter(this, void 0, void 0, function* () {
            const today = new Date(filter.today);
            const tenancies = yield this.contractDao.getTenancyBy(filter);
            const filteredTenancies = (tenancies || []).filter(tenancy => [constants_1.CONTRACT_STATUS.ACTIVE, constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED].includes(tenancy.status) ||
                (tenancy.status === constants_1.CONTRACT_STATUS.TERMINATED && tenancy.end_date > today));
            const tenants = { current: [], future: [] };
            yield Promise.all(filteredTenancies.map((tenant) => __awaiter(this, void 0, void 0, function* () {
                try {
                    tenant.contracts = yield this.contractDao.getContractsBy({
                        iduser: tenant.iduser,
                        status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED, constants_1.CONTRACT_STATUS.ACTIVE],
                    });
                }
                catch (_a) {
                    tenant.contracts = [];
                }
                if (tenant.start_date <= today || filteredTenancies.length === 1) {
                    tenants.current.push(tenant);
                }
                else {
                    tenants.future.push(tenant);
                }
                return tenant;
            })));
            return tenants;
        });
        this.updateRoom = (id, data) => this.roomDao.updateRoomBy({ id: Number(id) }, data);
    }
};
RoomService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('AdminMemberNotesDao')),
    __param(1, inversify_1.inject('LabelDao')),
    __param(2, inversify_1.inject('RoomDao')),
    __param(3, inversify_1.inject('ContractDao')),
    __param(4, inversify_1.inject('OfferDao')),
    __param(5, inversify_1.inject('UserDao')),
    __param(6, inversify_1.inject('UserPreferencesDao')),
    __param(7, inversify_1.inject('UserScoreDao')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map