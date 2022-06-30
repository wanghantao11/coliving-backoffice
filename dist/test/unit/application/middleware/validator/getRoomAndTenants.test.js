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
const room_1 = require("../../../../../src/application/middleware/validator/room");
describe('Test getRoomAndTenants validators', () => {
    it('should pass when the facadeId is number', () => __awaiter(void 0, void 0, void 0, function* () {
        let trigger = false;
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: '1',
        };
        const next = () => {
            trigger = true;
        };
        const res = httpMocks.createResponse();
        const validator = new room_1.GetRoomAndTenantsValidator();
        validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
    it('should pass when the facadeId is number and proper query', () => __awaiter(void 0, void 0, void 0, function* () {
        let trigger = false;
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: '1',
        };
        req.query = {
            status: 'Reserved',
            name: 'Lab',
            people_per_room: 2,
        };
        const next = () => {
            trigger = true;
        };
        const res = httpMocks.createResponse();
        const validator = new room_1.GetRoomAndTenantsValidator();
        validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
    it('should not pass when the facadeId is number and invalid property', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: '1',
        };
        req.query = {
            status: 'Reserved',
            name: 'Lab',
            people_per_room: 2,
            invalid_key: 'invalid_value',
        };
        const res = httpMocks.createResponse();
        const validator = new room_1.GetRoomAndTenantsValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    }));
    it('should not pass when the facadeId is number and invalid value', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: '1',
        };
        req.query = {
            status: 'Out Of Service',
            name: 'Lab',
            people_per_room: 2,
        };
        const res = httpMocks.createResponse();
        const validator = new room_1.GetRoomAndTenantsValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    }));
    it('should not pass when the facadeId is not number', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: 'test',
        };
        const res = httpMocks.createResponse();
        const validator = new room_1.GetRoomAndTenantsValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    }));
    it('should not pass when the facadeId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = httpMocks.createRequest();
        req.params = {};
        const res = httpMocks.createResponse();
        const validator = new room_1.GetRoomAndTenantsValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    }));
    it('should not pass when the facadeId is empty string', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: '',
        };
        const res = httpMocks.createResponse();
        const validator = new room_1.GetRoomAndTenantsValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    }));
});
//# sourceMappingURL=getRoomAndTenants.test.js.map