"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCallbackAutoReplyEmail = exports.sendPinCodeEmail = exports.sendSetPasswordEmail = exports.emailAxiosDelete = exports.emailAxiosGet = exports.emailAxiosPost = void 0;
const axios_1 = require("axios");
const loggers_1 = require("./loggers");
// This file contains all email util functions
const emailAxios = axios_1.default.create({
    baseURL: process.env.EMAIL_SERVICE_API,
});
emailAxios.interceptors.request.use(config => {
    if (process.env.NODE_ENV === 'test') {
        throw new axios_1.default.Cancel('No email will be sent in test env');
    }
    const token = process.env.FUNCTIONS_API_KEY;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});
emailAxios.interceptors.response.use(response => response, ({ response }) => response && loggers_1.errorEventLogger.error({ data: response.data }));
exports.emailAxiosPost = (endpointURL, params) => emailAxios.post(endpointURL, params)
    .catch(({ message }) => Promise.reject({ message }));
exports.emailAxiosGet = endpointURL => emailAxios.get(endpointURL);
exports.emailAxiosDelete = endpointURL => emailAxios.delete(endpointURL);
exports.sendSetPasswordEmail = (email, code, hostname, endpoint) => {
    const link = `${hostname}/set-password/${code}`;
    return exports.emailAxiosPost(endpoint, { email, link })
        .then(res => res.data);
};
exports.sendPinCodeEmail = ({ email, code }) => exports.emailAxiosPost('/mail/pin-code', { email, code });
exports.sendCallbackAutoReplyEmail = ({ email, first_name }) => exports.emailAxiosPost('/mail/callback-auto-reply', { email, first_name });
//# sourceMappingURL=email.js.map