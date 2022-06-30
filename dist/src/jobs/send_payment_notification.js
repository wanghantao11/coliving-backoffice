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
// eslint-disable-next-line
const axios_1 = require("axios");
const sendPaymentNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    const args = process.argv.slice(2);
    yield axios_1.default.post(args[0] + '/job/send-payment-notification', {})
        .catch(({ message }) => Promise.reject({
        message, reason: 'Failed to start sendPaymentNotification() cronjob',
    }));
});
sendPaymentNotification();
//# sourceMappingURL=send_payment_notification.js.map