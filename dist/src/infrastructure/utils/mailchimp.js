"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUser = exports.batchOperations = exports.updateUserTags = exports.updateUser = exports.importUsers = exports.archiveUser = exports.importUser = void 0;
const axios_1 = require("axios");
const loggers_1 = require("./loggers");
const constants_1 = require("../constants");
const common_1 = require("./common");
const mailChimpAxios = axios_1.default.create({
    baseURL: process.env.MAILCHIMP_API,
    auth: {
        username: 'any',
        password: process.env.MAILCHIMP_API_KEY,
    },
});
mailChimpAxios.interceptors.request.use(config => {
    if (process.env.NODE_ENV !== 'production') {
        throw new axios_1.default.Cancel('Only send request in production');
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
});
mailChimpAxios.interceptors.response.use(response => response, ({ response }) => response && loggers_1.errorEventLogger.error({ data: response.data }));
exports.importUser = (list_id) => (member) => mailChimpAxios.post(`/lists/${list_id}/members`, JSON.stringify(Object.assign({}, member)));
exports.archiveUser = (list_id) => ({ email_address }) => mailChimpAxios.delete(`/lists/${list_id}/members/${common_1.convertStringToMd5Hash(email_address)}`);
exports.importUsers = (list_id) => (members) => mailChimpAxios.post(`/lists/${list_id}`, JSON.stringify({ members, update_existing: true }));
exports.updateUser = (list_id) => (_a) => {
    var { email_address } = _a, data = __rest(_a, ["email_address"]);
    return mailChimpAxios.patch(`/lists/${list_id}/members/${common_1.convertStringToMd5Hash(email_address)}`, JSON.stringify(Object.assign({}, data)));
};
exports.updateUserTags = (list_id) => ({ email_address, tags, }) => mailChimpAxios.post(`/lists/${list_id}/members/${common_1.convertStringToMd5Hash(email_address)}/tags`, JSON.stringify({ tags }));
exports.batchOperations = (operations) => mailChimpAxios.post('/batches', JSON.stringify({ operations }));
exports.formatUser = ({ first_name, last_name, birthday, email, contract, registration_time, is_test_complete, interest_ids, subscribed_project_ids, facade_id, status = constants_1.TAG_STATUS.ACTIVE, }) => {
    // init
    const tags = [];
    const merge_fields = {};
    const formattedUser = {
        email_address: email,
        status: constants_1.EMAIL_MARKETING_STATUS.SUBSCRIBED,
    };
    // merge_fields
    if (first_name) {
        merge_fields.FNAME = first_name;
    }
    if (last_name) {
        merge_fields.LNAME = last_name;
    }
    if (birthday) {
        merge_fields.BIRTHDAY = birthday.toLocaleDateString('en-US');
    }
    if (registration_time) {
        merge_fields.REGTIME = registration_time.toLocaleDateString('en-US');
    }
    if (!common_1.isObjectEmpty(merge_fields)) {
        formattedUser.merge_fields = merge_fields;
    }
    // interests
    if (interest_ids) {
        const interests = interest_ids.reduce((result, id) => {
            result[constants_1.INTEREST_MAILCHIMP_MAPPING[id]] = true;
            return result;
        }, {});
        formattedUser.interests = interests;
    }
    // tags
    if (facade_id) {
        tags.push({
            status,
            name: (constants_1.PROJECT_MAILCHIMP_TAG_MAPPING[facade_id] || { tenant: null })
                .tenant,
        });
    }
    if (subscribed_project_ids) {
        tags.push(...subscribed_project_ids.map(id => ({
            status,
            name: (constants_1.PROJECT_MAILCHIMP_TAG_MAPPING[id] || { subscription: null })
                .subscription,
        })));
    }
    if (is_test_complete) {
        tags.push({
            status,
            name: constants_1.EVENT_MAILCHIMP_TAGS.ROOMIE_TEST_COMPLETE,
        });
    }
    if (contract) {
        if (constants_1.PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id] && contract.status === constants_1.CONTRACT_STATUS.PENDING) {
            tags.push({
                status,
                name: constants_1.PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id].contract.generated,
            });
        }
        if (constants_1.PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id] && contract.status === constants_1.CONTRACT_STATUS.REJECTED) {
            tags.push({
                status: constants_1.TAG_STATUS.INACTIVE,
                name: constants_1.PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id].contract.generated,
            });
        }
        if (constants_1.PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id] && contract.status === constants_1.CONTRACT_STATUS.SIGNED) {
            tags.push({
                status,
                name: constants_1.PROJECT_MAILCHIMP_TAG_MAPPING[contract.facade_id].contract.signed,
            });
        }
    }
    formattedUser.tags = tags;
    return formattedUser;
};
//# sourceMappingURL=mailchimp.js.map