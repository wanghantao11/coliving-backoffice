"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpMocks = require("node-mocks-http");
require("reflect-metadata");
const tenant_1 = require("../../../../../src/application/middleware/validator/tenant");
describe('Test getTenants validators', () => {
    it('should not pass when data is not given correctly', () => {
        const req = httpMocks.createRequest();
        req.query = {
            age_from: '',
        };
        const res = httpMocks.createResponse();
        const validator = new tenant_1.GetTenantsValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    });
});
//# sourceMappingURL=getTenants.test.js.map