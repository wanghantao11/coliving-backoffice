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
const common_1 = require("../../../../src/infrastructure/utils/common");
describe('Test the utils function hasPermission()', () => {
    it('should pass when values and scope has common element', () => __awaiter(void 0, void 0, void 0, function* () {
        const scope = [1, 2, 3, 4, 5];
        const values = [2, 6];
        const res = common_1.hasPermission(scope, values);
        expect(res).toBeTruthy();
    }));
    it('should not pass when values and scope has no common element', () => __awaiter(void 0, void 0, void 0, function* () {
        const scope = [1, 2, 3, 4, 5];
        const values = [7, 6];
        const res = common_1.hasPermission(scope, values);
        expect(res).toBeFalsy();
    }));
    it('should not pass when values is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        const scope = [1, 2, 3, 4, 5];
        const values = [];
        const res = common_1.hasPermission(scope, values);
        expect(res).toBeFalsy();
    }));
    it('should not pass when scope is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        const scope = [];
        const values = [7, 6];
        const res = common_1.hasPermission(scope, values);
        expect(res).toBeFalsy();
    }));
});
describe('Test the utils function convertDateToISOString()', () => {
    it('should convert a past date', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = new Date('05 October 2019 14:48 UTC');
        const res = common_1.convertDateToISOString(input);
        expect(res).toBe('2019-10-05T14:48:00.000Z');
    }));
    it('should convert a future date', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = new Date('2111-10-05 14:48 UTC');
        const res = common_1.convertDateToISOString(input);
        expect(res).toBe('2111-10-05T14:48:00.000Z');
    }));
    it('should return empty string for converting an empty date', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = new Date('');
        const res = common_1.convertDateToISOString(input);
        expect(res).toBe('');
    }));
    it('should return empty string for converting an null date', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = null;
        const res = common_1.convertDateToISOString(input);
        expect(res).toBe('');
    }));
});
describe('Test the utils function formatEmail()', () => {
    it('should lowercase the email', () => {
        const email = 'A@b.Com';
        const _email = common_1.formatEmail(email);
        expect(_email).toBe('a@b.com');
    });
    it('should trim the space of the email', () => {
        const email = '  A@b.Com      ';
        const _email = common_1.formatEmail(email);
        expect(_email).toBe('a@b.com');
    });
});
describe('Test the utils function excludeKeysFromObject()', () => {
    it('should exclude the fields provided', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const _obj = common_1.excludeKeysFromObject('a', 'b')(obj);
        expect(_obj).toEqual({ c: 3 });
    });
    it('should pass even if object is empty', () => {
        const obj = {};
        const _obj = common_1.excludeKeysFromObject('a', 'b')(obj);
        expect(_obj).toEqual({});
    });
    it('should return data directly if data is not object', () => {
        const obj = null;
        const _obj = common_1.excludeKeysFromObject('a', 'b')(obj);
        expect(_obj).toEqual(null);
    });
});
describe('Test the utils function convertStringToBoolean()', () => {
    it('should convert a true string to true', () => {
        const res = common_1.convertStringToBoolean('True');
        expect(res).toEqual(true);
    });
    it('should convert a whitespaced true string to true', () => {
        const res = common_1.convertStringToBoolean('  TRuE ');
        expect(res).toEqual(true);
    });
    it('should convert a false string to false', () => {
        const res = common_1.convertStringToBoolean('FALSe');
        expect(res).toEqual(false);
    });
    it('should convert a empty string to false', () => {
        const res = common_1.convertStringToBoolean('');
        expect(res).toEqual(false);
    });
});
describe('Testing the utils function convertStringToMd5Hash()', () => {
    it('should convert string to md5hash', () => {
        const res = common_1.convertStringToMd5Hash('test');
        expect(res).toEqual('098f6bcd4621d373cade4e832627b4f6');
    });
    it('should convert string to md5hash', () => {
        const res = common_1.convertStringToMd5Hash('');
        expect(res).toEqual('');
    });
    it('should convert string to md5hash', () => {
        const res = common_1.convertStringToMd5Hash(null);
        expect(res).toEqual('');
    });
});
describe('Testing the utils function createRandomCode()', () => {
    it('should create random code based on size', () => {
        const res = common_1.createRandomCode({ size: 1 });
        expect(res).toHaveLength(1);
    });
});
//# sourceMappingURL=common.test.js.map