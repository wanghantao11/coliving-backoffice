"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const container = new inversify_1.Container();
exports.container = container;
require("./auth");
require("./controllers");
require("./database");
require("./repository");
require("./services");
require("./validators");
//# sourceMappingURL=index.js.map