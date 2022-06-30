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
const constants_1 = require("./../../../../src/infrastructure/constants");
const __1 = require("../../../");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('testing the Room', () => {
    const addressDao = new repository_1.AddressRepository();
    const clientDao = new repository_1.ClientRepository();
    const userDao = new repository_1.UserRepository();
    const projectFacadeDao = new repository_1.ProjectFacadeRepository();
    const roomDao = new repository_1.RoomRepository();
    const contractDao = new repository_1.ContractRepository();
    const clientData = {
        name: 'Welive AB',
        org_no: '5555-555',
        type: 'admin',
        email: 'admin@ddd.se',
        phone: '319-816-2476',
        country: 'Sweden',
    };
    const userData = {
        iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90',
        first_name: 'First name',
        last_name: 'Last name',
        description: 'I am just a test user',
        tos_version_accepted: 1,
        user_type: 'Light',
        birthday: new Date('1991-01-01'),
        registration_time: new Date('2018-08-08'),
        email: 'fake@fafake.fake',
    };
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
            const contractRepo = yield __1.db.getRepo(entity_1.Contract);
            yield contractRepo.query('DELETE FROM contract;');
            const projectFacadeRepo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield projectFacadeRepo.query('DELETE FROM project_facade;');
            const roomRepo = yield __1.db.getRepo(entity_1.Room);
            yield roomRepo.query('DELETE FROM room;');
            const userRepo = yield __1.db.getRepo(entity_1.User);
            yield userRepo.query('DELETE FROM "user";');
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
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
            const contractRepo = yield __1.db.getRepo(entity_1.Contract);
            yield contractRepo.query('DELETE FROM contract;');
            const projectFacadeRepo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield projectFacadeRepo.query('DELETE FROM project_facade;');
            const roomRepo = yield __1.db.getRepo(entity_1.Room);
            yield roomRepo.query('DELETE FROM room;');
            const userRepo = yield __1.db.getRepo(entity_1.User);
            yield userRepo.query('DELETE FROM "user";');
            const addressRepo = yield __1.db.getRepo(entity_1.Address);
            yield addressRepo.query('DELETE FROM address;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
            redis_1.redisClient.quit(done);
        }
    }));
    it('should create an contract object', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const createdUser = yield userDao.createUser(user);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            post_area: 'Stockholm',
        });
        const createdProjectFacade = yield projectFacadeDao.createProjectFacade(projectFacade);
        const address = yield entity_1.Address.generateAddress({
            facade_id: createdProjectFacade.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const createdAddress = yield addressDao.createAddress(address);
        const room = yield entity_1.Room.generateRoom({
            facade_id: createdProjectFacade.id,
            number: '1301',
            address_id: createdAddress.id,
            size: 10,
            rent: 5000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const createdRoom = yield roomDao.createRoom(room);
        const contract = yield entity_1.Contract.generateContract({
            iduser: createdUser.iduser,
            room_id: createdRoom.id,
            facade_id: createdProjectFacade.id,
            status: constants_1.CONTRACT_STATUS.PENDING,
        });
        const createdContract = yield contractDao.createContract(contract);
        expect(createdContract).toBeInstanceOf(Object);
        expect(createdContract.status).toBe(constants_1.CONTRACT_STATUS.PENDING);
        expect(createdContract.room_id).toBe(createdRoom.id);
    }));
    it('should update an already stored contract', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const createdUser = yield userDao.createUser(user);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient,
            name: 'COLIVE Högdalen',
            post_area: 'Stockholm',
        });
        const createdProjectFacade = yield projectFacadeDao.createProjectFacade(projectFacade);
        const address = yield entity_1.Address.generateAddress({
            facade_id: createdProjectFacade.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const createdAddress = yield addressDao.createAddress(address);
        const room = yield entity_1.Room.generateRoom({
            facade_id: createdProjectFacade.id,
            number: '1301',
            address_id: createdAddress.id,
            size: 10,
            rent: 5000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const createdRoom = yield roomDao.createRoom(room);
        const contract = yield entity_1.Contract.generateContract({
            iduser: createdUser.iduser,
            room_id: createdRoom.id,
            facade_id: createdProjectFacade.id,
            status: constants_1.CONTRACT_STATUS.PENDING,
        });
        const createdContract = yield contractDao.createContract(contract);
        const updatedContract = yield contractDao.updateContractBy({ id: createdContract.id }, { status: constants_1.CONTRACT_STATUS.SIGNED, external_id: 200 });
        expect(updatedContract.status).not.toBe(constants_1.CONTRACT_STATUS.PENDING);
        expect(updatedContract.external_id).toBe(200);
    }));
    it('should find ongoing contracts by room id', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const createdUser = yield userDao.createUser(user);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            post_area: 'Stockholm',
        });
        const createdProjectFacade = yield projectFacadeDao.createProjectFacade(projectFacade);
        const address = yield entity_1.Address.generateAddress({
            facade_id: createdProjectFacade.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const createdAddress = yield addressDao.createAddress(address);
        const room = yield entity_1.Room.generateRoom({
            facade_id: createdProjectFacade.id,
            number: '1301',
            address_id: createdAddress.id,
            size: 10,
            rent: 5000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const createdRoom = yield roomDao.createRoom(room);
        const contract = yield entity_1.Contract.generateContract({
            iduser: createdUser.iduser,
            room_id: createdRoom.id,
            facade_id: createdProjectFacade.id,
            status: constants_1.CONTRACT_STATUS.PENDING,
        });
        const createdContract = yield contractDao.createContract(contract);
        const fetchedContracts = yield contractDao.getContractsBy({ roomIds: [createdRoom.id], status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED, constants_1.CONTRACT_STATUS.ACTIVE] });
        expect(fetchedContracts.length).toBe(1);
        expect(fetchedContracts[0].status).toBe(constants_1.CONTRACT_STATUS.PENDING);
    }));
    it('should not find inactive contracts by room id', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const createdUser = yield userDao.createUser(user);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            post_area: 'Stockholm',
        });
        const createdProjectFacade = yield projectFacadeDao.createProjectFacade(projectFacade);
        const address = yield entity_1.Address.generateAddress({
            facade_id: createdProjectFacade.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const createdAddress = yield addressDao.createAddress(address);
        const room = yield entity_1.Room.generateRoom({
            facade_id: createdProjectFacade.id,
            number: '1301',
            address_id: createdAddress.id,
            size: 10,
            rent: 5000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const createdRoom = yield roomDao.createRoom(room);
        const contract = yield entity_1.Contract.generateContract({
            iduser: createdUser.iduser,
            room_id: createdRoom.id,
            facade_id: createdProjectFacade.id,
            status: constants_1.CONTRACT_STATUS.TERMINATED,
        });
        const createdContract = yield contractDao.createContract(contract);
        const fetchedContracts = yield contractDao.getContractsBy({ roomIds: [createdRoom.id], status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED, constants_1.CONTRACT_STATUS.ACTIVE] });
        expect(fetchedContracts.length).toBe(0);
    }));
    it('should find all contracts by room ids', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const createdUser = yield userDao.createUser(user);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            post_area: 'Stockholm',
        });
        const createdProjectFacade = yield projectFacadeDao.createProjectFacade(projectFacade);
        const address = yield entity_1.Address.generateAddress({
            facade_id: createdProjectFacade.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const createdAddress = yield addressDao.createAddress(address);
        const room = yield entity_1.Room.generateRoom({
            facade_id: createdProjectFacade.id,
            number: '1301',
            address_id: createdAddress.id,
            size: 10,
            rent: 5000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const createdRoom = yield roomDao.createRoom(room);
        const room2 = yield entity_1.Room.generateRoom({
            facade_id: createdProjectFacade.id,
            number: '1302',
            address_id: createdAddress.id,
            size: 15,
            rent: 7000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const createdRoom2 = yield roomDao.createRoom(room2);
        const contract = yield entity_1.Contract.generateContract({
            iduser: createdUser.iduser,
            room_id: createdRoom.id,
            facade_id: createdProjectFacade.id,
            status: constants_1.CONTRACT_STATUS.TERMINATED,
        });
        yield contractDao.createContract(contract);
        const contract2 = yield entity_1.Contract.generateContract({
            iduser: createdUser.iduser,
            room_id: createdRoom2.id,
            facade_id: createdProjectFacade.id,
            status: constants_1.CONTRACT_STATUS.PENDING,
        });
        yield contractDao.createContract(contract2);
        const fetchedContracts = yield contractDao.getContractsBy({ roomIds: [createdRoom.id, createdRoom2.id], status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.TERMINATED] });
        expect(fetchedContracts.length).toBe(2);
    }));
    it('should find the ongoing contract by iduser', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const createdUser = yield userDao.createUser(user);
        userData.email = 'fake2@fake.se';
        userData.iduser = 'U9iqIePQ6mdlMxZ1NLbiDehIKg91';
        const user2 = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const createdUser2 = yield userDao.createUser(user2);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            post_area: 'Stockholm',
        });
        const createdProjectFacade = yield projectFacadeDao.createProjectFacade(projectFacade);
        const address = yield entity_1.Address.generateAddress({
            facade_id: createdProjectFacade.id,
            careof: 'Driver',
            city: 'Stockholm',
            country: 'Sweden',
            street: '85819 Fay Ridges',
            zip: '12222',
        });
        const createdAddress = yield addressDao.createAddress(address);
        const room = yield entity_1.Room.generateRoom({
            facade_id: createdProjectFacade.id,
            number: '1301',
            address_id: createdAddress.id,
            size: 10,
            rent: 5000,
            service_fee: 2000,
            shared_area_size: 100,
            is_suitable_for_disability: true,
            people_per_room: 2,
        });
        const createdRoom = yield roomDao.createRoom(room);
        const contract = yield entity_1.Contract.generateContract({
            iduser: createdUser.iduser,
            room_id: createdRoom.id,
            facade_id: createdProjectFacade.id,
            status: constants_1.CONTRACT_STATUS.PENDING,
            external_id: 1,
        });
        yield contractDao.createContract(contract);
        const contract2 = yield entity_1.Contract.generateContract({
            iduser: createdUser2.iduser,
            room_id: createdRoom.id,
            facade_id: createdProjectFacade.id,
            status: constants_1.CONTRACT_STATUS.PENDING,
            external_id: 1,
        });
        yield contractDao.createContract(contract2);
        const fetchedContracts = yield contractDao.getContractsBy({ externalId: 1, status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED, constants_1.CONTRACT_STATUS.ACTIVE] });
        expect(fetchedContracts.length).toBe(2);
    }));
});
//# sourceMappingURL=contract.test.js.map