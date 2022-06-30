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
const emergencyContact_1 = require("../../../../../src/application/middleware/validator/emergencyContact");
describe('Test emergencyContact validators', () => {
    it('should not pass when there is field that is not allowed to pass in', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = httpMocks.createRequest();
        req.body = {
            name: 'test name',
            phone: '1234567',
            relation: 'Not Related',
            iduser: 'NOT_ALLOWED',
        };
        const res = httpMocks.createResponse();
        const validator = new emergencyContact_1.CreateEmergencyContactValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    }));
    it('should not pass when there is empty field which is required', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = httpMocks.createRequest();
        req.body = {
            name: '',
            phone: '1234567',
            relation: 'Not Related',
        };
        const res = httpMocks.createResponse();
        const validator = new emergencyContact_1.CreateEmergencyContactValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    }));
    it('should pass when data is properly passed in ', () => __awaiter(void 0, void 0, void 0, function* () {
        let trigger = false;
        const req = httpMocks.createRequest();
        req.body = {
            name: 'dwa',
            phone: '1234567',
            relation: 'Not Related',
        };
        const next = () => {
            trigger = true;
        };
        const res = httpMocks.createResponse();
        const validator = new emergencyContact_1.CreateEmergencyContactValidator();
        validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
});
describe('Validation: \'updateEmergencyContactValidator\', testing the validation function', () => {
    it('should not pass when data when there is field that is not allowed to pass in ', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = httpMocks.createRequest();
        req.body = {
            name: 'test name',
            phone: '1234567',
            iduser: 'NOT_ALLOWED',
        };
        const res = httpMocks.createResponse();
        const validator = new emergencyContact_1.UpdateEmergencyContactValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    }));
    it('should pass when data is properly passed in ', () => __awaiter(void 0, void 0, void 0, function* () {
        let trigger = false;
        const req = httpMocks.createRequest();
        req.body = {
            relation: 'Related',
        };
        const next = () => {
            trigger = true;
        };
        const res = httpMocks.createResponse();
        const validator = new emergencyContact_1.UpdateEmergencyContactValidator();
        validator.handler(req, res, next);
        expect(trigger).toBe(true);
    }));
});
//# sourceMappingURL=emergencyContact.test.js.map