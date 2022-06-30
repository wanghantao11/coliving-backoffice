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
require("reflect-metadata");
const inversify_express_utils_1 = require("inversify-express-utils");
const entity_1 = require("./../../../../src/domain/entity");
const repository_1 = require("./../../../../src/domain/repository");
const __1 = require("../../../");
const typeorm_1 = require("typeorm");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('testing the ApplicationRepo', () => {
    const applicationDao = new repository_1.ApplicationRepo();
    const projectFacadeDao = new repository_1.ProjectFacadeRepository();
    const userDao = new repository_1.UserRepository();
    const clientDao = new repository_1.ClientRepository();
    const clientData = {
        name: 'Welive AB',
        org_no: '5555-555',
        type: 'admin',
        email: 'admin@ddd.se',
        phone: '319-816-2476',
        country: 'Sweden',
    };
    const applicationSvc = new application_service_1.ApplicationService(applicationDao, userDao, projectFacadeDao);
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
            const repo = yield __1.db.getRepo(entity_1.Application);
            yield repo.query('DELETE FROM application;');
            const accRepo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield accRepo.query('DELETE FROM project_facade;');
            const userRepo = yield __1.db.getRepo(entity_1.User);
            yield userRepo.query('DELETE FROM "user";');
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
            const repo = yield __1.db.getRepo(entity_1.Application);
            yield repo.query('DELETE FROM application;');
            const accRepo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield accRepo.query('DELETE FROM project_facade;');
            const userRepo = yield __1.db.getRepo(entity_1.User);
            yield userRepo.query('DELETE FROM "user";');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
            redis_1.redisClient.quit(done);
        }
    }));
    it('should create an AppliedAccommodation in db', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            post_area: 'Stockholm',
        });
        const createdProjectFacade = yield projectFacadeDao.createProjectFacade(projectFacade);
        const appAcc = new entity_1.Application(savedUser.iduser, createdProjectFacade.id, savedClient.id);
        const actual = yield applicationDao.createApplication(appAcc);
        expect(actual).toBeInstanceOf(Object);
        expect(actual.facade_id).toBe(createdProjectFacade.id);
        expect(actual.iduser).toBe(savedUser.iduser);
    }));
    it('should throw an error if applying to same accommodation again', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            post_area: 'Stockholm',
        });
        const createdProjectFacade = yield projectFacadeDao.createProjectFacade(projectFacade);
        const appAcc = new entity_1.Application(savedUser.iduser, createdProjectFacade.id, savedClient.id);
        yield applicationDao.createApplication(appAcc);
        const actual = applicationDao.createApplication(appAcc);
        yield expect(actual).rejects.toThrowError(typeorm_1.QueryFailedError);
    }));
    it('should get all applications done by a member', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const projectFacade1 = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen1',
            post_area: 'Stockholm',
        });
        const createdProjectFacade1 = yield projectFacadeDao.createProjectFacade(projectFacade1);
        const projectFacade2 = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen2',
            post_area: 'Stockholm',
        });
        const createdProjectFacade2 = yield projectFacadeDao.createProjectFacade(projectFacade2);
        const projectFacade3 = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen3',
            post_area: 'Stockholm',
        });
        const createdProjectFacade3 = yield projectFacadeDao.createProjectFacade(projectFacade3);
        const appAccs = [
            new entity_1.Application(savedUser.iduser, createdProjectFacade1.id, savedClient.id),
            new entity_1.Application(savedUser.iduser, createdProjectFacade2.id, savedClient.id),
            new entity_1.Application(savedUser.iduser, createdProjectFacade3.id, savedClient.id),
        ];
        yield Promise.all(appAccs.map(appAcc => applicationDao.createApplication(appAcc)));
        const result = yield applicationDao.getMemberApplications({ iduser: savedUser.iduser });
        const actual = result.sort();
        expect(actual).toHaveLength(3);
    }));
    it('should remove an application from a member', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const user = yield entity_1.User.generateUser(Object.assign(Object.assign({}, userData), { client_id: savedClient.id }));
        const savedUser = yield userDao.createUser(user);
        const projectFacade1 = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen1',
            post_area: 'Stockholm',
        });
        const createdProjectFacade1 = yield projectFacadeDao.createProjectFacade(projectFacade1);
        const projectFacade2 = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen2',
            post_area: 'Stockholm',
        });
        const createdProjectFacade2 = yield projectFacadeDao.createProjectFacade(projectFacade2);
        const projectFacade3 = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen3',
            post_area: 'Stockholm',
        });
        const createdProjectFacade3 = yield projectFacadeDao.createProjectFacade(projectFacade3);
        const appAccs = [
            new entity_1.Application(savedUser.iduser, createdProjectFacade1.id, savedClient.id),
            new entity_1.Application(savedUser.iduser, createdProjectFacade2.id, savedClient.id),
            new entity_1.Application(savedUser.iduser, createdProjectFacade3.id, savedClient.id),
        ];
        const appliedAccs = yield Promise.all(appAccs.map(appAcc => applicationDao.createApplication(appAcc)));
        yield applicationDao.deleteApplication(createdProjectFacade3.id, savedUser.iduser);
        const actual = yield applicationDao.getMemberApplications({ iduser: savedUser.iduser });
        expect(actual).toHaveLength(2);
    }));
});
//# sourceMappingURL=application.test.js.map