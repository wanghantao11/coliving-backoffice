"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./../../../../src/domain/entity");
describe('testing AppliedAccommodation entity', () => {
    it('should creata a AppliedAccmmodation entity', () => {
        // Arrange
        // Act
        const actual = new entity_1.Application('e59f1c57-3413-42bf-a3b2-cee34f3df64a', 23, 2);
        // Assert
        expect(actual).toBeInstanceOf(entity_1.Application);
        expect(actual.id).not.toBeDefined();
        expect(actual.iduser).toBe('e59f1c57-3413-42bf-a3b2-cee34f3df64a');
    });
});
//# sourceMappingURL=application.test.js.map