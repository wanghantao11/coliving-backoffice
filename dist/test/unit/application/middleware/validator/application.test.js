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
require("reflect-metadata");
const inversify_express_utils_1 = require("inversify-express-utils");
const httpMocks = require("node-mocks-http");
const application_1 = require("../../../../../src/application/middleware/validator/application");
describe('test application validators', () => {
    beforeEach(done => {
        inversify_express_utils_1.cleanUpMetadata();
        done();
    });
    describe('test create application validator', () => {
        let req;
        let res;
        const next = jest.fn();
        beforeEach(() => {
            req = null;
            res = null;
            next.mockReset();
        });
        it('should pass the validator with valid request body', () => {
            const validator = new application_1.CreateApplicationValidator();
            req = httpMocks.createRequest({
                method: 'POST',
                url: 'v1/application/apply',
                body: {
                    facade_id: 23,
                },
            });
            res = httpMocks.createResponse();
            validator.handler(req, res, next);
            expect(res.statusCode).toBe(200);
        });
        it('should fail the validator with faulty request body', () => __awaiter(void 0, void 0, void 0, function* () {
            const validator = new application_1.CreateApplicationValidator();
            req = httpMocks.createRequest({
                method: 'POST',
                url: 'v1/application/apply',
                body: {
                    projectId: 23,
                },
            });
            res = httpMocks.createResponse();
            validator.handler(req, res, err => {
                if (err) {
                    expect(err.message).toBe('NOT_VALIDATED');
                }
            });
        }));
        it('should fail the validator with empty request body', () => __awaiter(void 0, void 0, void 0, function* () {
            const validator = new application_1.CreateApplicationValidator();
            req = httpMocks.createRequest({
                method: 'POST',
                url: 'v1/application/apply',
                body: {},
            });
            res = httpMocks.createResponse();
            validator.handler(req, res, err => {
                if (err) {
                    expect(err.message).toBe('NOT_VALIDATED');
                }
            });
        }));
    });
});
//# sourceMappingURL=application.test.js.map