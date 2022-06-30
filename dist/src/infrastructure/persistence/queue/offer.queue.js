"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferQueue = void 0;
const Queue = require("bull");
const app_config_1 = require("./../../../../config/app-config");
const loggers_1 = require("../../utils/loggers");
exports.OfferQueue = new Queue('offer', app_config_1.default.REDIS_URL);
exports.OfferQueue.on('completed', data => {
    loggers_1.logger.info({ type: 'job_complete', data });
});
exports.OfferQueue.on('failed', data => {
    loggers_1.logger.info({ type: 'job_failed', data });
});
//# sourceMappingURL=offer.queue.js.map