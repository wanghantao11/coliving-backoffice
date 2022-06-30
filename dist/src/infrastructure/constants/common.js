"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECAPTCHA_VERIFY_URL = exports.MILLISECONDS_IN_A_YEAR = exports.SALT_ROUNDS = exports.DEFAULT_PROFILE_IMAGE = exports.FB_STORAGE_URL_PREFIX = exports.API_VERSION = void 0;
exports.API_VERSION = '/v1';
exports.FB_STORAGE_URL_PREFIX = 'https://firebasestorage.googleapis.com/v0/b/';
exports.DEFAULT_PROFILE_IMAGE = `${exports.FB_STORAGE_URL_PREFIX}${process.env.FB_STORAGE_BUCKET}/o/images%2FDefaultProfileImage.png?alt=media&token=4454115e-1a34-401b-91d5-80d477e85e4b`;
exports.SALT_ROUNDS = 10;
exports.MILLISECONDS_IN_A_YEAR = 31556952000;
exports.RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
//# sourceMappingURL=common.js.map