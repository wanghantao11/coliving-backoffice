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
const admin_1 = require("../../../../../src/application/middleware/validator/admin");
describe('Test admin validators', () => {
    let trigger;
    let req;
    let res;
    const next = () => (trigger = true);
    beforeEach(() => {
        trigger = false;
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });
    it('should pass when only first name is given', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {
            first_name: 'new first name',
        };
        const validator = new admin_1.UpdateAdminValidator();
        validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
    it('should pass when both first name and last name are given', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {
            first_name: 'new first name',
            last_name: 'new last name',
        };
        const validator = new admin_1.UpdateAdminValidator();
        validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
    it('should not pass when last name is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {
            first_name: 'new first name',
            last_name: '',
        };
        const validator = new admin_1.UpdateAdminValidator();
        validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'));
    }));
    it('should not pass when email is not given', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {};
        const validator = new admin_1.ResendEmailValidator();
        validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'));
    }));
    it('should not pass if email is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = { email: 'random', password: '123' };
        const validator = new admin_1.LoginAdminValidator();
        validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'));
    }));
    it('should not pass if admin id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: 'random' };
        const validator = new admin_1.DeleteAdminValidator();
        validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'));
    }));
});
//# sourceMappingURL=admin.test.js.map