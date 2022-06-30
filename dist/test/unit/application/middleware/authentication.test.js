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
const httpMocks = require("node-mocks-http");
require("reflect-metadata");
const service_1 = require("../../../../src/application/auth/jwt/service");
const authentication_1 = require("../../../../src/application/middleware/authentication");
const constants_1 = require("../../../../src/infrastructure/constants");
describe('Test authentication middleware', () => {
    const validator = new authentication_1.IsAuthenticated();
    it('should pass when auth type is correct and token is correct for backoffice', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield service_1.signInBackOffice(1, 2, [], '', constants_1.BACKOFFICE);
        let trigger = false;
        const req = httpMocks.createRequest();
        req.headers.authorization = `Bearer ${token}`;
        const next = () => {
            trigger = true;
        };
        const res = httpMocks.createResponse();
        res.locals.allowAuthTypes = [constants_1.BACKOFFICE];
        yield validator.handler(req, res, next);
        expect(trigger).toBeTruthy();
    }));
    it('should not pass when auth type is not correct for backoffice', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield service_1.signInBackOffice(1, 2, [], '', constants_1.BACKOFFICE);
        const req = httpMocks.createRequest();
        req.headers.authorization = `Bearer ${token}`;
        const res = httpMocks.createResponse();
        res.locals.allowAuthTypes = [constants_1.COMMUNITY];
        yield validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_AUTHENTICATED');
            }
        });
    }));
    it('should not pass when auth type is correct but token is incorrect for backoffice', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield service_1.signInBackOffice(1, 2, [], '', constants_1.BACKOFFICE);
        const req = httpMocks.createRequest();
        req.headers.authorization = `Bearer ${token}hack`;
        const res = httpMocks.createResponse();
        res.locals.allowAuthTypes = [constants_1.BACKOFFICE];
        yield validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_AUTHENTICATED');
            }
        });
    }));
    it('should pass when auth type is correct and token is correct for community', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield service_1.signInCommunity(1, constants_1.COMMUNITY);
        let trigger = false;
        const req = httpMocks.createRequest();
        req.headers.authorization = `Bearer ${token}`;
        const next = () => {
            trigger = true;
        };
        const res = httpMocks.createResponse();
        res.locals.allowAuthTypes = [constants_1.COMMUNITY];
        yield validator.handler(req, res, next);
        expect(trigger).toBeTruthy();
    }));
    it('should not pass when auth type is correct but token is incorrect for community', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield service_1.signInCommunity(1, constants_1.COMMUNITY);
        const req = httpMocks.createRequest();
        req.headers.authorization = `Bearer ${token}hack`;
        const res = httpMocks.createResponse();
        res.locals.allowAuthTypes = [constants_1.COMMUNITY];
        yield validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_AUTHENTICATED');
            }
        });
    }));
    it('should not pass when auth type is correct but token is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        const emptyToken = '';
        const req = httpMocks.createRequest();
        req.headers.authorization = `Bearer ${emptyToken}`;
        const res = httpMocks.createResponse();
        res.locals.allowAuthTypes = [constants_1.COMMUNITY];
        yield validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_AUTHENTICATED');
            }
        });
    }));
});
//# sourceMappingURL=authentication.test.js.map