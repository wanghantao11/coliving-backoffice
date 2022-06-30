"use strict";
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
require("reflect-metadata");
const inversify_express_utils_1 = require("inversify-express-utils");
const repository_1 = require("./../../../../src/domain/repository");
const entity_1 = require("./../../../../src/domain/entity");
const __1 = require("../../../");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('testing the Room', () => {
    const roomDao = new repository_1.RoomRepository();
    const addressDao = new repository_1.AddressRepository();
    const projectFacadeDao = new repository_1.ProjectFacadeRepository();
    const clientDao = new repository_1.ClientRepository();
    const clientData = {
        name: 'Welive AB',
        org_no: '5555-555',
        type: 'admin',
        email: 'admin@ddd.se',
        phone: '319-816-2476',
        country: 'Sweden',
    };
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repo = yield __1.db.getRepo(entity_1.Room);
            yield repo.query('DELETE FROM room;');
            const projectFacadeRepo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield projectFacadeRepo.query('DELETE FROM project_facade;');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
            const addressRepo = yield __1.db.getRepo(entity_1.Address);
            yield addressRepo.query('DELETE FROM address;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
        }
    }));
    afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repo = yield __1.db.getRepo(entity_1.Room);
            yield repo.query('DELETE FROM room;');
            const projectFacadeRepo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield projectFacadeRepo.query('DELETE FROM project_facade;');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
            const addressRepo = yield __1.db.getRepo(entity_1.Address);
            yield addressRepo.query('DELETE FROM address;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
            redis_1.redisClient.quit(done);
        }
    }));
    it('should create an room object', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE 1',
            address: 'Brommavägen 22',
            post_area: 'Stockholm',
        });
        const savedAcc = yield projectFacadeDao.createProjectFacade(projectFacade);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
        const room = yield entity_1.Room.generateRoom({
            address_id: savedAddress.id,
            facade_id: savedAcc.id,
            number: '1301',
            size: 10,
            rent: 5000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const actual = yield roomDao.createRoom(room);
        expect(actual).toBeInstanceOf(Object);
        expect(actual.id).toBe(1);
    }));
    it('should update an already stored room', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE 2',
            address: 'Högdalensv 21',
            post_area: 'Stockholm',
        });
        const savedAcc = yield projectFacadeDao.createProjectFacade(projectFacade);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
        const expected = yield entity_1.Room.generateRoom({
            address_id: savedAddress.id,
            facade_id: savedAcc.id,
            number: '1301',
            size: 10,
            rent: 5000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const savedRoom = yield roomDao.createRoom(expected);
        expect(savedRoom).toBeInstanceOf(Object);
        const actual = yield roomDao.updateRoomBy({ id: savedRoom.id }, { number: '123', rent: 6000 });
        expect(actual.number).not.toBe(1);
        expect(actual.rent).toBe(6000);
    }));
    it('should find already stored room', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE 3',
            address: 'Högdalensv 21',
            post_area: 'Stockholm',
        });
        const savedAcc = yield projectFacadeDao.createProjectFacade(projectFacade);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
        const expected = yield entity_1.Room.generateRoom({
            address_id: savedAddress.id,
            facade_id: savedAcc.id,
            number: '1301',
            size: 10,
            rent: 5000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const room = yield roomDao.createRoom(expected);
        const _room = yield roomDao.getRoomBy({ id: room.id });
        expect(_room.id).toBe(room.id);
    }));
    it('should find already stored rooms', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE 4',
            address: 'Högdalensv 21',
            post_area: 'Stockholm',
        });
        const savedAcc = yield projectFacadeDao.createProjectFacade(projectFacade);
        const address = yield entity_1.Address.generateAddress({
            facade_id: savedAcc.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const savedAddress = yield addressDao.createAddress(address);
        const expected = yield entity_1.Room.generateRoom({
            address_id: savedAddress.id,
            facade_id: savedAcc.id,
            number: '1301',
            size: 10,
            rent: 5000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const savedRoom = yield roomDao.createRoom(expected);
        const rooms = yield roomDao.getRoomsBy({ facadeId: savedAcc.id });
        expect(rooms).toBeInstanceOf(Array);
        expect(rooms.length).toBe(1);
    }));
});
//# sourceMappingURL=room.test.js.map