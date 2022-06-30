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
const httpMocks = require("node-mocks-http");
require("reflect-metadata");
const inversify_express_utils_1 = require("inversify-express-utils");
const authorization_1 = require("../../../../src/application/middleware/authorization");
const authorization_2 = require("../../../../src/application/auth/authorization");
const __1 = require("../../..");
const repository_1 = require("../../../../src/domain/repository");
const entity_1 = require("../../../../src/domain/entity");
const constants_1 = require("../../../../src/infrastructure/constants");
const redis_1 = require("../../../../src/infrastructure/persistence/redis");
describe('Test authorization middleware', () => {
    const roleDao = new repository_1.RoleRepository();
    const adminDao = new repository_1.AdminRepository();
    const clientDao = new repository_1.ClientRepository();
    const authorization = new authorization_2.Authorization(roleDao, adminDao);
    const validator = new authorization_1.IsAuthorized(authorization);
    const allowPermission = 1;
    const notAllowPermission = 2;
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
    it('should pass when auth type is community', () => __awaiter(void 0, void 0, void 0, function* () {
        let trigger = false;
        const req = httpMocks.createRequest();
        const next = () => {
            trigger = true;
        };
        const res = httpMocks.createResponse();
        res.locals.allowAuthTypes = constants_1.COMMUNITY;
        yield validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
    it('should pass when auth type is backoffice with proper authorization', () => __awaiter(void 0, void 0, void 0, function* () {
        const clientObj = {
            name: 'olive',
            org_no: '12345',
            phone: '54321',
            email: 'oliveAB@thisisfake.colive.se',
            country: 'se',
            type: 'IT',
        };
        const client = yield entity_1.Client.generateClient(clientObj);
        const createdClient = yield clientDao.createClient(client);
        const roleObj = {
            name: 'sys_admin',
            client_id: createdClient.id,
            scopes: [allowPermission],
        };
        const role = yield entity_1.Role.generateRole(roleObj);
        const createdRole = yield roleDao.createRole(role);
        const adminObj = {
            first_name: 'oliver',
            last_name: 'jam',
            email: 'oliver@thisisfake.colive.se',
            verified: true,
            role_id: createdRole.id,
            client_id: createdClient.id,
        };
        const admin = yield entity_1.Admin.generateAdmin(adminObj);
        const createdAdmin = yield adminDao.createAdmin(admin);
        let trigger = false;
        const req = httpMocks.createRequest();
        const next = () => {
            trigger = true;
        };
        const res = httpMocks.createResponse();
        res.locals.allowAuthTypes = constants_1.BACKOFFICE;
        res.locals.authType = constants_1.BACKOFFICE;
        res.locals.userId = createdAdmin.id;
        res.locals.permission = [allowPermission];
        yield validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
    it('should not pass when auth type is backoffice without proper authorization', () => __awaiter(void 0, void 0, void 0, function* () {
        const clientObj = {
            name: 'olive',
            org_no: '12345',
            phone: '54321',
            email: 'oliveAB@thisisfake.colive.se',
            country: 'se',
            type: 'IT',
        };
        const client = yield entity_1.Client.generateClient(clientObj);
        const createdClient = yield clientDao.createClient(client);
        const roleObj = {
            name: 'sys_admin',
            client_id: createdClient.id,
            scopes: [allowPermission],
        };
        const role = yield entity_1.Role.generateRole(roleObj);
        const createdRole = yield roleDao.createRole(role);
        const adminObj = {
            first_name: 'oliver',
            last_name: 'jam',
            email: 'oliver@thisisfake.colive.se',
            verified: true,
            role_id: createdRole.id,
            client_id: createdClient.id,
        };
        const admin = yield entity_1.Admin.generateAdmin(adminObj);
        const createdAdmin = yield adminDao.createAdmin(admin);
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        res.locals.allowAuthTypes = constants_1.BACKOFFICE;
        res.locals.authType = constants_1.BACKOFFICE;
        res.locals.userId = createdAdmin.id;
        res.locals.permission = [notAllowPermission];
        yield validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_AUTHORIZED');
            }
        });
    }));
});
//# sourceMappingURL=authorization.test.js.map