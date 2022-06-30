"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorEventLogger = void 0;
require("reflect-metadata");
const winston = require("winston");
const { combine, timestamp, printf, label, colorize, simple } = winston.format;
const customizedFormat = printf(({ message, label, timestamp }) => `${timestamp} [${label}]: ${JSON.stringify(message)}`);
winston.loggers.add('error_event', {
    format: combine(label({ label: 'error_event' }), timestamp(), colorize(), simple(), customizedFormat),
    transports: [new winston.transports.Console()],
});
const errorEventLogger = winston.loggers.get('error_event');
exports.errorEventLogger = errorEventLogger;
errorEventLogger.stream = {
    write: (message) => {
        errorEventLogger.error(message);
    },
};
//# sourceMappingURL=errorEvent.js.map