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
const address_1 = require("../../../../../src/application/middleware/validator/address");
describe('Test address validators', () => {
    let trigger;
    let req;
    let res;
    const next = () => (trigger = true);
    beforeEach(() => {
        trigger = false;
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });
    it('should pass when all data is given for address creation', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {
            facade_id: 1,
            country: 'Sweden',
            city: 'Stockholm',
            zip: '10 990',
            street: 'Drottninggatan 123',
        };
        const validator = new address_1.CreateAddressValidator();
        validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
    it('should not pass when street is missing for address creation', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {
            project_id: 1,
            country: 'Sweden',
            city: 'Stockholm',
            zip: '10 990',
        };
        const validator = new address_1.CreateAddressValidator();
        validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'));
    }));
    it('should not pass when country is missing for address creation', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {
            project_id: 1,
            city: 'Stockholm',
            zip: '10 990',
            street: 'Drottninggatan 123',
        };
        const validator = new address_1.CreateAddressValidator();
        validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'));
    }));
    it('should pass when nothing is sent in for address update', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {};
        const validator = new address_1.UpdateAddressValidator();
        validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
    it('should pass when number is passed for address deletion', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        const validator = new address_1.DeleteAddressValidator();
        validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
    it('should fail when non-number is passed for address deletion', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: 'string' };
        const validator = new address_1.DeleteAddressValidator();
        validator.handler(req, res, err => err && expect(err.message).toBe('NOT_VALIDATED'));
    }));
});
//# sourceMappingURL=address.test.js.map