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
const dotenv = require("dotenv");
dotenv.config();
const repository_1 = require("./../../../../src/domain/repository");
const user_service_1 = require("./../../../../src/application/services/user.service");
const entity_1 = require("./../../../../src/domain/entity");
const inversify_express_utils_1 = require("inversify-express-utils");
const __1 = require("../../../");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('test the user service', () => {
    const clientDao = new repository_1.ClientRepository();
    const userDao = new repository_1.UserRepository();
    const transactionDao = new repository_1.TransactionRepository();
    const contractDao = new repository_1.ContractRepository();
    const userService = new user_service_1.UserService(userDao, transactionDao, contractDao);
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
        email: 'test@thisisfake.colive.se',
        first_name: 'First name',
        last_name: 'Last name',
        description: 'I am just a test user',
        tos_version_accepted: 1,
        user_type: 'Light',
        birthday: new Date('1991-01-01'),
        registration_time: new Date('2018-08-08'),
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
    it('should save data with the service and create a user object and save it in db', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const expected = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        yield userService.createUser(expected);
        const actual = yield userDao.getUserBy({ iduser: userData.iduser });
        expect(actual.first_name).toEqual(expected.first_name);
        expect(actual.last_name).toEqual(expected.last_name);
        expect(actual.user_type).toBe('Light');
    }));
    it('should update a user object and save it in db', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const expected = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const user = yield userService.createUser(expected);
        const dataToUpdate = {
            last_name: 'New last name',
            tos_version_accepted: 0,
        };
        const actual = yield userService.updateUserByExternalId(expected.iduser, dataToUpdate);
        expect(actual.first_name).toEqual(expected.first_name);
        expect(actual.last_name).toEqual(dataToUpdate.last_name);
    }));
});
//# sourceMappingURL=user.service.test.js.map