var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// eslint-disable-next-line
const axiosInstance2 = require('axios');
const setMovedOutTenantsToUsers = () => __awaiter(this, void 0, void 0, function* () {
    const args = process.argv.slice(2);
    yield axiosInstance2.post(args[0] + '/job/set-moved-out-tenants-to-users', {})
        .catch(({ message }) => Promise.reject({
        message, reason: 'Failed to start setMovedOutTenantsToUsers() cronjob',
    }));
});
setMovedOutTenantsToUsers();
//# sourceMappingURL=set_moved_out_tenants_to_users.js.map