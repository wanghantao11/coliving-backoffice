"use strict";
// This file contains all firebase util functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseImagePath = void 0;
exports.parseImagePath = (url) => url.match(/(?<=2F).*(?=\?)/g)[0];
//# sourceMappingURL=firebase.js.map