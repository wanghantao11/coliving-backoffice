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
const entity_1 = require("./../../../../src/domain/entity");
const repository_1 = require("./../../../../src/domain/repository");
const inversify_express_utils_1 = require("inversify-express-utils");
const __1 = require("./../../../");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('testing the user dao', () => {
    const clientDao = new repository_1.ClientRepository();
    const userPreferredRoommatesDao = new repository_1.UserPreferredRoommatesRepository();
    const userDao = new repository_1.UserRepository();
    const clientData = {
        name: 'Welive AB',
        org_no: '5555-555',
        type: 'admin',
        email: 'admin@ddd.se',
        phone: '319-816-2476',
        country: 'Sweden',
    };
    const userData_1 = {
        iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90',
        first_name: 'First name',
        last_name: 'Last name',
        description: 'I am just a test user',
        tos_version_accepted: 1,
        user_type: 'Light',
        birthday: new Date('1991-01-01'),
        registration_time: new Date('2018-08-08'),
        email: 'fake1@fafake.fake',
    };
    const userData_2 = {
        iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg91',
        first_name: 'First name',
        last_name: 'Last name',
        description: 'I am just a test user',
        tos_version_accepted: 1,
        user_type: 'Light',
        birthday: new Date('1991-01-01'),
        registration_time: new Date('2018-08-08'),
        email: 'fake2@fafake.fake',
    };
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userRepo = yield __1.db.getRepo(entity_1.User);
            yield userRepo.query('DELETE FROM "user";');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
            const userPreferredRoommatesRepo = yield __1.db.getRepo(entity_1.UserPreferredRoommates);
            yield userPreferredRoommatesRepo.query('DELETE FROM user_preferred_roommates;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
        }
    }));
    afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userRepo = yield __1.db.getRepo(entity_1.User);
            yield userRepo.query('DELETE FROM "user";');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
            const userPreferredRoommatesRepo = yield __1.db.getRepo(entity_1.UserPreferredRoommates);
            yield userPreferredRoommatesRepo.query('DELETE FROM user_preferred_roommates;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
            redis_1.redisClient.quit(done);
        }
    }));
    it('should create a pending roommate pair', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user_1 = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData_1), { client_id: savedClient.id }));
        const user_2 = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData_2), { client_id: savedClient.id }));
        const actual_1 = yield userDao.createUser(user_1);
        const actual_2 = yield userDao.createUser(user_2);
        const roommate = yield userPreferredRoommatesDao.createUserPreferredRoommate({ inviter_id: actual_1.iduser, invitee_id: actual_2.iduser });
        expect(roommate.status).toBe('Pending');
    }));
    it('should not be able to create if roommate is self', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user_1 = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData_1), { client_id: savedClient.id }));
        const actual_1 = yield userDao.createUser(user_1);
        userPreferredRoommatesDao.createUserPreferredRoommate({ inviter_id: actual_1.iduser, invitee_id: actual_1.iduser })
            .catch(({ code }) => expect(code).toBe('23514'));
    }));
});
//# sourceMappingURL=userPreferredRoommates.test.js.map