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
const dotenv = require("dotenv");
dotenv.config();
const authentication_1 = require("../../../../src/application/auth/jwt/authentication");
describe('should be able to pass the authentication with correct code', () => {
    const AuthenticationService = new authentication_1.Authentication();
    it('should be able to verify code generated by the service', () => __awaiter(void 0, void 0, void 0, function* () {
        const plainText = 'testing';
        const code = yield AuthenticationService.sign({ plainText });
        const isVerified = yield AuthenticationService.verify(code);
        expect(isVerified).toBeTruthy();
    }));
    it('should be able to reject the wrong code generated from the bad guys', () => __awaiter(void 0, void 0, void 0, function* () {
        const plainText = 'testing';
        yield AuthenticationService.sign({ plainText });
        const incorrectCode = 'karmaisabitch';
        try {
            yield AuthenticationService.verify(incorrectCode);
        }
        catch (error) {
            expect(error.message).toBe('NOT_AUTHENTICATED');
        }
    }));
    it('should be able to reject the empty code', () => __awaiter(void 0, void 0, void 0, function* () {
        const plainText = 'testing';
        yield AuthenticationService.sign({ plainText });
        const emptyCode = '';
        try {
            yield AuthenticationService.verify(emptyCode);
        }
        catch (error) {
            expect(error.message).toBe('NOT_AUTHENTICATED');
        }
    }));
});
//# sourceMappingURL=authentication.test.js.map