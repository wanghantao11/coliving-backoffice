"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.dbErrorMap = exports.statusCodeMap = void 0;
const loggers_1 = require("../../infrastructure/utils/loggers");
/**
 * errorMessage
 * part of the mapping is based on the definition below
 * to handle error catched from service level
 *
 * @see https://tools.ietf.org/html/rfc7235#section-3.1
 */
var statusCodeMap;
(function (statusCodeMap) {
    statusCodeMap[statusCodeMap["NOT_VERIFIED"] = 400] = "NOT_VERIFIED";
    statusCodeMap[statusCodeMap["NOT_AUTHENTICATED"] = 401] = "NOT_AUTHENTICATED";
    statusCodeMap[statusCodeMap["NOT_AUTHORIZED"] = 403] = "NOT_AUTHORIZED";
    statusCodeMap[statusCodeMap["NOT_FOUND"] = 404] = "NOT_FOUND";
    statusCodeMap[statusCodeMap["CONFLICT"] = 409] = "CONFLICT";
    statusCodeMap[statusCodeMap["NOT_ALLOWED"] = 412] = "NOT_ALLOWED";
    statusCodeMap[statusCodeMap["NOT_VALIDATED"] = 422] = "NOT_VALIDATED";
    statusCodeMap[statusCodeMap["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    statusCodeMap[statusCodeMap["NO_CONTENT"] = 204] = "NO_CONTENT";
})(statusCodeMap = exports.statusCodeMap || (exports.statusCodeMap = {}));
/**
 * db error map
 * to handle error thrown from db level
 */
exports.dbErrorMap = {
    23505: { status: 409, message: 'CONFLICT' },
    40001: { status: 423, message: 'LOCKED' },
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.handleError = () => (err, req, res, next) => {
    if (err instanceof TypeError) {
        loggers_1.errorEventLogger.error({
            message: { message: err.message, detail: err.stack },
        });
    }
    else {
        loggers_1.errorEventLogger.error({ err });
    }
    const { code, message } = err;
    if (exports.dbErrorMap[code]) {
        const { status, message } = exports.dbErrorMap[code];
        res.status(status).send({ message });
    }
    else {
        return Object.keys(statusCodeMap).includes(message)
            ? res.status(statusCodeMap[message]).send({ message })
            : res.status(statusCodeMap.INTERNAL_SERVER_ERROR).send({ message: 'INTERNAL_SERVER_ERROR' });
    }
};
//# sourceMappingURL=error.js.map