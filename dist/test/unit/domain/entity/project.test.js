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
const project_1 = require("../../../../src/domain/entity/project");
describe('testing the project entity', () => {
    it('should create a project entity with minimum properties', () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        // Act
        const actual = yield project_1.Project.generateProject({
            facade_id: 1,
            client_id: 1,
            name: 'COLIVE Test Project',
        });
        // Assert
        expect(actual).toBeInstanceOf(project_1.Project);
    }));
});
//# sourceMappingURL=project.test.js.map