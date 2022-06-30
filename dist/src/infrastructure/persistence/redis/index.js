"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsync = exports.redisClient = void 0;
const redis = require("redis");
const util = require("util");
exports.redisClient = redis.createClient(process.env.REDIS_URL);
exports.getAsync = util.promisify(exports.redisClient.get).bind(exports.redisClient);
//# sourceMappingURL=index.js.map