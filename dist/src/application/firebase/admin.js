"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const sharp = require("sharp");
const uuid = require("uuid/v4");
const backoffice_1 = require("./backoffice");
const constants_1 = require("./../../infrastructure/constants");
const BUCKET_NAME = process.env.FB_STORAGE_BUCKET_BACKOFFICE;
exports.uploadImage = (img, adminId) => new Promise((resolve, reject) => {
    const currentTimestamp = Date.now();
    const remoteFileName = `avatars/${adminId}_${currentTimestamp}.jpg`;
    const imageBuffer = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const file = backoffice_1.firebaseBackofficeService.storage().bucket().file(remoteFileName);
    const uuidToken = uuid();
    const downloadURL = `${constants_1.FB_STORAGE_URL_PREFIX}${BUCKET_NAME}/o/avatars%2F${adminId}_${currentTimestamp}.jpg?alt=media&token=${uuidToken}`;
    return sharp(imageBuffer)
        .resize({ height: 500 })
        .toBuffer()
        .then(buffer => file.save(buffer, {
        metadata: {
            contentType: 'image/jpeg',
            metadata: { firebaseStorageDownloadTokens: uuidToken },
        },
    }))
        .then(() => resolve({ downloadURL }))
        .catch(reject);
});
//# sourceMappingURL=admin.js.map