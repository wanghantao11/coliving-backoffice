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
const projectFacade_service_1 = require("./../../../../src/application/services/projectFacade.service");
const entity_1 = require("./../../../../src/domain/entity");
const repository_1 = require("./../../../../src/domain/repository");
const inversify_express_utils_1 = require("inversify-express-utils");
const __1 = require("./../../../");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('test the projectFacade service', () => {
    const projectFacadeDao = new repository_1.ProjectFacadeRepository();
    const transactionDao = new repository_1.TransactionRepository();
    const clientDao = new repository_1.ClientRepository();
    const offerDao = new repository_1.OfferRepository();
    const projectFacadeSvc = new projectFacade_service_1.ProjectFacadeService(projectFacadeDao, transactionDao, offerDao);
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
            const roomRepo = yield __1.db.getRepo(entity_1.Room);
            yield roomRepo.query('DELETE FROM room;');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
            const repo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield repo.query('DELETE FROM project_facade;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
        }
    }));
    afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomRepo = yield __1.db.getRepo(entity_1.Room);
            yield roomRepo.query('DELETE FROM room;');
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
            const repo = yield __1.db.getRepo(entity_1.ProjectFacade);
            yield repo.query('DELETE FROM project_facade;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
            redis_1.redisClient.quit(done);
        }
    }));
    it('should save data with the service and create a projectFacade object', () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const expected = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Högdalen',
            address: 'högdalsvägen 31',
            cover_image_source: 'https://via.placeholder.com/250',
            post_area: 'Stockholm',
        });
        // Act
        const acc = yield projectFacadeSvc.createProjectFacade(expected);
        const actual = yield projectFacadeDao.getProjectFacade(acc.id);
        // Assert
        expect(actual.name).toEqual(expected.name);
        expect(actual.published).toEqual(false);
        expect(actual.published_at).toBeDefined();
    }));
});
//# sourceMappingURL=projectFacade.service.test.js.map