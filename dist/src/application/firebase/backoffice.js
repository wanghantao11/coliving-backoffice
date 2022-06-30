"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseBackofficeService = void 0;
const admin = require("firebase-admin");
const app_config_1 = require("./../../../config/app-config");
exports.firebaseBackofficeService = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FB_SERVICE_ACCOUNT_KEY_BACKOFFICE)),
    storageBucket: process.env.FB_STORAGE_BUCKET_BACKOFFICE,
}, app_config_1.default.FIREBASE_BACKOFFICE_APP);
//# sourceMappingURL=backoffice.js.map