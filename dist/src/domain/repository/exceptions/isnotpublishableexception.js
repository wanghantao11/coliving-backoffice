"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNotPublishableException = void 0;
class IsNotPublishableException extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, IsNotPublishableException.prototype);
    }
}
exports.IsNotPublishableException = IsNotPublishableException;
//# sourceMappingURL=isnotpublishableexception.js.map