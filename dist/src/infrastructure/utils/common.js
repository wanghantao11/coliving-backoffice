"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectEmpty = exports.hasPermission = exports.hasAuthType = exports.hashPassword = exports.getDataFromResponse = exports.formatDueDate = exports.formatEmail = exports.excludeKeysFromObject = exports.createRandomCode = exports.convertStringToMd5Hash = exports.convertStringToBoolean = exports.convertDateToISOString = exports.checkPassword = void 0;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const lodash_1 = require("lodash");
const common_1 = require("./../constants/common");
exports.checkPassword = (password, passwordHash) => bcrypt.compare(password, passwordHash);
exports.convertDateToISOString = (date) => {
    try {
        return date ? date.toISOString() : '';
    }
    catch (e) {
        return '';
    }
};
exports.convertStringToBoolean = (input) => input ? input.toLowerCase().trim() === 'true' : false;
exports.convertStringToMd5Hash = (input) => input ? crypto.createHash('md5').update(input).digest('hex') : '';
exports.createRandomCode = (config) => config.size <= 0 ? '' : crypto.randomBytes(Math.ceil(config.size / 2)).toString('hex').slice(0, config.size);
exports.excludeKeysFromObject = (...keys) => data => {
    if (!lodash_1.isObject(data)) {
        return data;
    }
    keys.forEach(key => {
        delete data[key];
    });
    return data;
};
exports.formatEmail = (email) => !email ? '' : email.toLowerCase().trim();
exports.formatDueDate = (createdAt, dueDay) => !dueDay ? createdAt : new Date(createdAt.setDate(dueDay));
exports.getDataFromResponse = ({ data }) => data;
exports.hashPassword = (password) => bcrypt.hash(password, common_1.SALT_ROUNDS);
exports.hasAuthType = (typeArr, value) => typeArr.includes(value);
exports.hasPermission = (scopes, values) => Boolean(values.filter(value => scopes.includes(value)).length);
exports.isObjectEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;
//# sourceMappingURL=common.js.map