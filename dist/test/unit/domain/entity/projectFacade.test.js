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
const entity_1 = require("../../../../src/domain/entity");
const repository_1 = require("../../../../src/domain/repository");
const __1 = require("./../../../");
const inversify_express_utils_1 = require("inversify-express-utils");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('testing the projectFacade entity', () => {
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
            const clientRepo = yield __1.db.getRepo(entity_1.Client);
            yield clientRepo.query('DELETE FROM client;');
        }
        finally {
            inversify_express_utils_1.cleanUpMetadata();
            done();
            redis_1.redisClient.quit(done);
        }
    }));
    it('should create a projectFacade object', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        const actual = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Husby',
            post_area: 'Stockholm',
        });
        expect(actual).toBeInstanceOf(entity_1.ProjectFacade);
    }));
    it('should create a projectFacade object and test if there is mandatory properties', () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield entity_1.Client.generateClient(clientData);
        const savedClient = yield clientDao.createClient(client);
        // Act
        const actual = yield entity_1.ProjectFacade.generateProjectFacade({
            client_id: savedClient.id,
            name: 'COLIVE Fridhemsplan',
            post_area: 'Stockholm',
        });
        // Assert
        expect(typeof actual.name).toBe('string');
        expect(actual.name.length).toBeGreaterThan(0);
        expect(actual.published).toBeFalsy();
    }));
});
//# sourceMappingURL=projectFacade.test.js.map