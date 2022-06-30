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
const axios = require('axios');
const createMonthlyRentPayment = () => __awaiter(this, void 0, void 0, function* () {
    const args = process.argv.slice(2);
    yield axios.post(args[0] + '/job/create-monthly-rent', {})
        .catch(({ message }) => Promise.reject({
        message, reason: 'Failed to start createMonthlyRentPayment() cronjob',
    }));
});
createMonthlyRentPayment();
//# sourceMappingURL=create_monthly_rent_payment.js.map