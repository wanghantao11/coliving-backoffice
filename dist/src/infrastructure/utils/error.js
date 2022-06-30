"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNoOfferException = void 0;
const loggers_1 = require("./loggers");
const errorLogMap = {
    NOT_FOUND: (facade_id, reason, data) => loggers_1.offerEventLogger.info({ type: 'search_failed', data, log: { reason }, facade_id }),
    NOT_ALLOWED: (facade_id, reason, data) => loggers_1.offerEventLogger.info({ type: 'search_failed', data, log: { reason }, facade_id }),
};
exports.handleNoOfferException = (facade_id) => (error) => errorLogMap[error.message]
    ? errorLogMap[error.message](facade_id, error.reason, error.data)
    : loggers_1.offerEventLogger.info({ type: 'search_failed', log: error, facade_id });
//# sourceMappingURL=error.js.map