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
const application_service_1 = require("./../../../../src/application/services/application.service");
const entity_1 = require("./../../../../src/domain/entity");
const repository_1 = require("./../../../../src/domain/repository");
const inversify_express_utils_1 = require("inversify-express-utils");
const __1 = require("../../../");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('testing ApplicationService', () => {
    const appAccRepo = new repository_1.ApplicationRepo();
    const projectFacadeDao = new repository_1.ProjectFacadeRepository();
    const clientRepo = new repository_1.ClientRepository();
    const userRepo = new repository_1.UserRepository();
    const appAccSvc = new application_service_1.ApplicationService(appAccRepo, userRepo, projectFacadeDao);
    const clientData = {
        name: 'Welive AB',
        org_no: '5555-555',
        type: 'admin',
        email: 'admin@ddd.se',
        phone: '319-816-2476',
        country: 'Sweden',
    };
    const userData = {
        user_key: 123,
        iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90',
        email: 'test@test.com',
        first_name: 'Firstname',
        last_name: 'Lastname',
        description: 'I am just a test user',
        tos_version_accepted: 1,
        user_type: 'Light',
        birthday: new Date('1991-01-01'),
        img_url: '',
    };
    beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userRepo = yield __1.db.getRepo(entity_1.User);
            yield userRepo.query('DELETE FROM "user";');
            const accRepo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield accRepo.query('DELETE FROM project_facade;');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
            const repo = yield __1.db.getRepo(entity_1.Application);
            yield repo.query('DELETE FROM application;');
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
            const accRepo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield accRepo.query('DELETE FROM project_facade;');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
            const repo = yield __1.db.getRepo(entity_1.Application);
            yield repo.query('DELETE FROM application;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
            redis_1.redisClient.quit(done);
        }
    }));
    it('should apply a member to an accommodation', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientRepo.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userRepo.createUser(user);
        const acc = new entity_1.ProjectFacade();
        acc.name = 'COLIVE Test';
        acc.client_id = savedClient.id;
        acc.post_area = 'Stockholm';
        const result = yield projectFacadeDao.createProjectFacade(acc);
        const accId = result.id;
        const actual = yield appAccSvc.applyForProject(savedUser.iduser, accId);
        expect(actual.facade_id).toEqual(accId);
        expect(actual.iduser).toEqual(savedUser.iduser);
        expect(actual.id).toBeDefined();
    }));
});
//# sourceMappingURL=application.service.test.js.map