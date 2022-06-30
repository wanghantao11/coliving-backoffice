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
const user_1 = require("../../../../src/domain/entity/user");
describe('testing the user entity', () => {
    const userData = {
        client_id: 2,
        iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90',
        first_name: 'First name',
        last_name: 'Last name',
        description: 'I am just a test user',
        tos_version_accepted: 1,
        user_type: 'Light',
    };
    it('should create a user entity', () => __awaiter(void 0, void 0, void 0, function* () {
        const actual = yield user_1.User.generateUser(userData);
        expect(actual).toBeInstanceOf(user_1.User);
    }));
    it('should create a user entity and test if there is mandatory properties', () => __awaiter(void 0, void 0, void 0, function* () {
        const actual = yield user_1.User.generateUser(userData);
        expect(typeof actual.iduser).toBe('string');
        expect(actual.first_name.length).toBeGreaterThan(0);
        expect(actual.last_name.length).toBeGreaterThan(0);
        expect(actual.last_name).toBe('Last name');
        expect(actual.description).toBe('I am just a test user');
        expect(actual.tos_version_accepted).toBe(1);
        expect(actual.user_type).toBe('Light');
    }));
});
//# sourceMappingURL=user.test.js.map