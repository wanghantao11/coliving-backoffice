"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseCommunityService = void 0;
const admin = require("firebase-admin");
const app_config_1 = require("./../../../config/app-config");
const firebaseCommunityService = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FB_SERVICE_ACCOUNT_KEY_COMMUNITY)),
    storageBucket: process.env.FB_STORAGE_BUCKET,
}, app_config_1.default.FIREBASE_COMMUNITY_APP);
exports.firebaseCommunityService = firebaseCommunityService;
//# sourceMappingURL=community.js.map