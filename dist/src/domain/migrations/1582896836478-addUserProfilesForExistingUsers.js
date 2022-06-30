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
exports.AddUserProfilesForExistingUsers1582896836478 = void 0;
class AddUserProfilesForExistingUsers1582896836478 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.manager.query('INSERT INTO user_profiles (iduser) SELECT iduser FROM "user" ON CONFLICT DO NOTHING');
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
exports.AddUserProfilesForExistingUsers1582896836478 = AddUserProfilesForExistingUsers1582896836478;
//# sourceMappingURL=1582896836478-addUserProfilesForExistingUsers.js.map