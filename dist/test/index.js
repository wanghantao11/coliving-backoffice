"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv = require("dotenv");
dotenv.config();
const container_1 = require("./../src/container");
const loggers_1 = require("../src/infrastructure/utils/loggers");
const db = container_1.container.get('TypeORMConnectionService');
exports.db = db;
db.startConn()
    .then(() => loggers_1.logger.info('Connected to db.'))
    .catch(reason => loggers_1.logger.error(`Error when connecting to db! ${reason}`));
//# sourceMappingURL=index.js.map