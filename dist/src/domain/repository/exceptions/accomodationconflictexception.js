"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccomodationConflictException = void 0;
class AccomodationConflictException extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, AccomodationConflictException.prototype);
    }
}
exports.AccomodationConflictException = AccomodationConflictException;
//# sourceMappingURL=accomodationconflictexception.js.map