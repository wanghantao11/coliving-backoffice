"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceException = void 0;
class DataSourceException extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, DataSourceException.prototype);
    }
}
exports.DataSourceException = DataSourceException;
//# sourceMappingURL=datasourceexception.js.map