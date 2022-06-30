"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpMocks = require("node-mocks-http");
require("reflect-metadata");
const member_1 = require("../../../../../src/application/middleware/validator/member");
describe('Test member validators', () => {
    it('should pass when the facadeId is number and proper query', () => {
        let trigger = false;
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: '1',
            apartmentId: '1',
        };
        req.query = {
            name: 'Li',
            has_double_room: true,
            has_single_room: true,
            has_private_bathroom: true,
            has_shared_bathroom: true,
            has_private_toilet: true,
            has_shared_toilet: true,
            include_unspecified_age: true,
            include_unspecified_move_in_date: true,
            exclude_users_with_offers: false,
            exclude_current_tenants: false,
            is_only_matching_rent: true,
            is_only_suitable_for_disability: true,
            is_only_today: true,
            is_only_test_complete: true,
            age_from: 20,
            rent: 5000,
            subscribe_from: '1992-02-03',
        };
        const next = () => {
            trigger = true;
        };
        const res = httpMocks.createResponse();
        const validator = new member_1.GetSubscribedMembersValidator();
        validator.handler(req, res, next);
        expect(trigger).toBe(true);
    });
    it('should not pass when the query has invalid field', () => {
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: '1',
        };
        req.query = {
            name: 'Li',
            has_double_room: true,
            age_from: 20,
            subscribe_from: '1992-02-03',
            invalid_key: 'invalid_value',
        };
        const res = httpMocks.createResponse();
        const validator = new member_1.GetSubscribedMembersValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    });
    it('should not pass when the query has invalid value', () => {
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: '1',
        };
        req.query = {
            name: 'Li',
            has_double_room: true,
            age_from: 20,
            subscribe_from: 'invalid_value',
        };
        const res = httpMocks.createResponse();
        const validator = new member_1.GetSubscribedMembersValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    });
    it('should not pass when the facadeId is not number', () => {
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: 'test',
        };
        const res = httpMocks.createResponse();
        const validator = new member_1.GetSubscribedMembersValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    });
    it('should not pass when the facadeId is not provided', () => {
        const req = httpMocks.createRequest();
        req.params = {};
        const res = httpMocks.createResponse();
        const validator = new member_1.GetSubscribedMembersValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    });
    it('should not pass when the facadeId is empty string', () => {
        const req = httpMocks.createRequest();
        req.params = {
            facadeId: '',
        };
        const res = httpMocks.createResponse();
        const validator = new member_1.GetSubscribedMembersValidator();
        validator.handler(req, res, err => {
            if (err) {
                expect(err.message).toBe('NOT_VALIDATED');
            }
        });
    });
});
//# sourceMappingURL=member.test.js.map