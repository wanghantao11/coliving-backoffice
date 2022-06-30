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
    const userDao = new repository_1.UserRepository();
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
            const repo = yield __1.db.getRepo(entity_1.User);
            yield repo.query('DELETE FROM "user";');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
        }
    }));
    afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repo = yield __1.db.getRepo(entity_1.User);
            yield repo.query('DELETE FROM "user";');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
            redis_1.redisClient.quit(done);
        }
    }));
    it('should create a user object', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const actual = yield userDao.createUser(user);
        expect(actual.last_name).toBe('Last name');
    }));
    it('should not create a user object that has the same email except for the case sensitivity', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        yield userDao.createUser(user);
        const user1 = yield entity_1.User.generateUser(Object.assign(user, { email: user.email.toUpperCase() }));
        userDao.createUser(user1).catch(e => expect(Number(e.code)).toEqual(23505));
    }));
    it('should update an already stored user', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const actual = yield userDao.updateUserBy({ iduser: savedUser.iduser }, { first_name: 'New first name', tos_version_accepted: 0 });
        expect(actual.first_name).toBe('New first name');
    }));
    it('should delete an stored user', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const actual = yield userDao.deleteUserByExternalId(savedUser.iduser);
        expect(actual).toBeInstanceOf(Object);
        expect(actual.email).toBe('fake@fafake.fake');
    }));
});
//# sourceMappingURL=user.test.js.map