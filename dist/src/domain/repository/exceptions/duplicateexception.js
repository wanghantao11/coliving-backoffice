"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateException = void 0;
class DuplicateException extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, DuplicateException.prototype);
    }
}
exports.DuplicateException = DuplicateException;
//# sourceMappingURL=duplicateexception.js.map