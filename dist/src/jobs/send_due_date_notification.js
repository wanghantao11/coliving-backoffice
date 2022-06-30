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
const axiosHandler = require('axios');
const sendDueDateNotification = () => __awaiter(this, void 0, void 0, function* () {
    const args = process.argv.slice(2);
    yield axiosHandler.post(args[0] + '/job/send-due-date-notification', {})
        .catch(({ message }) => Promise.reject({
        message, reason: 'Failed to start sendDueDateNotification() cronjob',
    }));
});
sendDueDateNotification();
//# sourceMappingURL=send_due_date_notification.js.map