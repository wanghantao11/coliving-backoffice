"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const service_1 = require("./../infrastructure/persistence/typeorm/service");
_1.container
    .bind('TypeORMConnectionService')
    .to(service_1.TypeORMConnectionService)
    .inSingletonScope();
//# sourceMappingURL=database.js.map