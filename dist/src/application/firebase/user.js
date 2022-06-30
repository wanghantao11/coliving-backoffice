"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.signInWithEmailAndPassword = void 0;
const firebase = require("firebase");
const sharp = require("sharp");
const uuid = require("uuid/v4");
const community_1 = require("./community");
const constants_1 = require("./../../infrastructure/constants");
const firebaseUserService = firebase.initializeApp(JSON.parse(process.env.FB_SERVICE_ACCOUNT_KEY_USER));
const FB_BUCKET_NAME = process.env.FB_STORAGE_BUCKET;
exports.signInWithEmailAndPassword = (email, password) => firebaseUserService
    .auth()
    .signInWithEmailAndPassword(email, password);
exports.uploadImage = (img, userId) => new Promise((resolve, reject) => {
    const remoteFileName = `images/${userId}.jpg`;
    const imageBuffer = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const file = community_1.firebaseCommunityService.storage().bucket().file(remoteFileName);
    const uuidToken = uuid();
    const downloadURL = `${constants_1.FB_STORAGE_URL_PREFIX}${FB_BUCKET_NAME}/o/images%2F${userId}.jpg?alt=media&token=${uuidToken}`;
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
//# sourceMappingURL=user.js.map