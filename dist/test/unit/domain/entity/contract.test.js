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
const entity_1 = require("../../../../src/domain/entity");
const constants_1 = require("../../../../src/infrastructure/constants");
describe('testing the contract entity', () => {
    it('should create a contract entity with minimum properties', () => __awaiter(void 0, void 0, void 0, function* () {
        const actual = yield entity_1.Contract.generateContract({
            iduser: 's4i1dhB1krbJyrvwkDG152Y5eI80',
            room_id: 20,
            facade_id: 1,
            status: constants_1.CONTRACT_STATUS.PENDING,
        });
        expect(actual).toBeInstanceOf(entity_1.Contract);
    }));
    it('should create a contract entity with all properties', () => __awaiter(void 0, void 0, void 0, function* () {
        const actual = yield entity_1.Contract.generateContract({
            iduser: 's4i1dhB1krbJyrvwkDG152Y5eI80',
            room_id: 20,
            facade_id: 1,
            status: constants_1.CONTRACT_STATUS.PENDING,
            external_id: 2302,
            start_date: new Date(),
            end_date: new Date(),
        });
        expect(actual).toBeInstanceOf(entity_1.Contract);
        expect(actual.room_id).toBe(20);
        expect(actual.status).toBe(constants_1.CONTRACT_STATUS.PENDING);
        expect(actual.external_id).toBe(2302);
    }));
});
//# sourceMappingURL=contract.test.js.map