"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const statuscodes = require("http-status-codes");
const inversify_express_utils_1 = require("inversify-express-utils");
const httpMocks = require("node-mocks-http");
const projectFacade_1 = require("../../../../../src/application/middleware/validator/projectFacade");
describe('Test project facade validators', () => {
    beforeEach(done => {
        inversify_express_utils_1.cleanUpMetadata();
        done();
    });
    describe('test create and update project facade validator', () => {
        /**
         * Mocked Express Request object.
         */
        let req;
        /**
         * Mocked Express Response object.
         */
        let res;
        /**
         * Mocked Express Next function.
         */
        const next = jest.fn();
        beforeEach(() => {
            req = null;
            res = null;
            next.mockReset();
        });
        it('should fail the CreateProjectFacadeValidator with incorrect request data', () => {
            const validator = new projectFacade_1.CreateProjectFacadeValidator();
            req = httpMocks.createRequest({
                method: 'POST',
                url: 'v1/project-facade',
                body: {
                    published: true,
                    published_at: new Date(),
                },
            });
            res = httpMocks.createResponse();
            validator.handler(req, res, err => {
                if (err) {
                    expect(err.message).toBe('NOT_VALIDATED');
                }
            });
        });
        it('should pass the CreateProjectFacadeValidator with correct request data', () => {
            const validator = new projectFacade_1.CreateProjectFacadeValidator();
            const next = jest.fn();
            req = httpMocks.createRequest({
                method: 'POST',
                url: 'v1/project-facade',
                body: {
                    name: 'COLIVE Bromma',
                    post_area: 'Stockholm',
                },
            });
            res = httpMocks.createResponse();
            validator.handler(req, res, next);
            expect(res.statusCode).toBeDefined();
            expect(res.statusCode).toBe(statuscodes.OK);
        });
        it('should pass the UpdateProjectFacadeValidator with correct request data', () => {
            const validator = new projectFacade_1.UpdateProjectFacadeValidator();
            const next = jest.fn();
            req = httpMocks.createRequest({
                method: 'PUT',
                url: 'v1/project-facade/:id',
                body: {
                    name: 'COLIVE Bromma',
                    address: 'Stockholm 123',
                },
                params: {
                    id: 1,
                },
            });
            res = httpMocks.createResponse();
            validator.handler(req, res, next);
            expect(res.statusCode).toBeDefined();
            expect(res.statusCode).toBe(statuscodes.OK);
        });
        it('should fail the UpdateProjectFacadeValidator with missing request params', () => {
            const validator = new projectFacade_1.UpdateProjectFacadeValidator();
            const next = jest.fn();
            req = httpMocks.createRequest({
                method: 'PUT',
                url: 'v1/project-facade/:id',
                body: {
                    name: 'COLIVE Bromma',
                    address: 'Stockholm 123',
                },
                params: {},
            });
            res = httpMocks.createResponse();
            validator.handler(req, res, err => {
                if (err) {
                    expect(err.message).toBe('NOT_VALIDATED');
                }
            });
        });
    });
});
//# sourceMappingURL=projectFacade.test.js.map