"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserProcessor {
    postProcess(name, object) {
        object.email = object.email.toLowerCase();
        object.img_url = 'https://firebasestorage.googleapis.com/v0/b/colive-auth-stage.appspot.com/o/images%2FDefaultProfileImage.png?alt=media&token=4454115e-1a34-401b-91d5-80d477e85e4b';
    }
}
exports.default = UserProcessor;
//# sourceMappingURL=user.processor.js.map