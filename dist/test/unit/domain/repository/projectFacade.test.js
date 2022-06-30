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
const Chance = require("chance");
const entity_1 = require("../../../../src/domain/entity");
const repository_1 = require("../../../../src/domain/repository");
const inversify_express_utils_1 = require("inversify-express-utils");
const __1 = require("../../../");
const typeorm_1 = require("typeorm");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('testing the projectFacade dao', () => {
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
            const repo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield repo.query('DELETE FROM project_facade;');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
            redis_1.redisClient.quit(done);
        }
    }));
    afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield repo.query('DELETE FROM project_facade;');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
        }
    }));
    it('should create a projectFacade object', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            post_area: 'Stockholm',
        });
        const actual = yield projectFacadeDao.createProjectFacade(projectFacade);
        expect(actual.id).toBe(1);
    }));
    it('should get an stored project facade', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            address: 'Högdalensv 21',
            post_area: 'Stockholm',
        });
        // Act
        const actual = yield projectFacadeDao.createProjectFacade(projectFacade);
        // Assert
        expect(actual.name).toBe(projectFacade.name);
    }));
    it('should update an already stored project facade', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            address: 'Högdalensv 21',
            post_area: 'Stockholm',
        });
        const savedAcc = yield projectFacadeDao.createProjectFacade(projectFacade);
        const actual = yield projectFacadeDao.updateProjectFacade(savedAcc.id, { address: 'Högdalshöjden 12', published: true });
        // Assert
        expect(actual.name).toBe(projectFacade.name);
        expect(actual.address).not.toBe('Högdalensv 21');
        expect(actual.address).toBe('Högdalshöjden 12');
    }));
    it('should delete an stored project facade', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const projectFacade = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            address: 'Högdalensv 23',
            post_area: 'Stockholm',
        });
        const savedProjectFacade = yield projectFacadeDao.createProjectFacade(projectFacade);
        const actual = yield projectFacadeDao.deleteProjectFacade(savedProjectFacade.id);
        expect(actual).toBeInstanceOf(typeorm_1.DeleteResult);
    }));
    it('should return 12 project facades', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const LIMIT = 12;
        const TOTAL = 13;
        const accomodations = [];
        const chance = new Chance();
        for (let index = 0; index < TOTAL; index++) {
            const element = yield entity_1.ProjectFacade.generateProjectFacade({
                client_id: savedClient.id,
                name: chance.address(),
                post_area: 'Stockholm',
            });
            element.published_at = new Date(`2019-01-${index + 1}`);
            element.published = true;
            accomodations.push(element);
        }
        yield Promise.all(accomodations.map(acc => projectFacadeDao.createProjectFacade(acc)));
        const actual = yield projectFacadeDao.getMyProjectFacades(savedClient.id, true, LIMIT, 0);
        expect(actual.length).toBe(LIMIT);
        expect(actual.length).not.toBeGreaterThan(LIMIT);
    }));
});
//# sourceMappingURL=projectFacade.test.js.map