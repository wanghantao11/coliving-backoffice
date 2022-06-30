"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
require("reflect-metadata");
const winston = require("winston");
const { combine, timestamp, printf, label, colorize, simple } = winston.format;
const customizedFormat = printf(({ message, label, timestamp }) => `${timestamp} [${label}]: ${JSON.stringify(message)}`);
winston.loggers.add('general_event', {
    format: combine(label({ label: 'general_event' }), timestamp(), colorize(), simple(), customizedFormat),
    transports: [new winston.transports.Console()],
});
const logger = winston.loggers.get('general_event');
exports.logger = logger;
logger.stream = {
    write: (message) => {
        logger.info(message);
    },
};
if (process.env.NODE_ENV !== 'production') {
    logger.info('Logging initialized at debug level');
}
//# sourceMappingURL=generalEvent.js.map