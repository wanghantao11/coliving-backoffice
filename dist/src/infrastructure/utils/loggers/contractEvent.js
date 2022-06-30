"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractEventLogger = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const winston = require("winston");
const Transport = require("winston-transport");
const repository_1 = require("../../../domain/repository");
let ContractEventTransport = class ContractEventTransport extends Transport {
    constructor(contractEventsDao) {
        super();
        this.contractEventsDao = contractEventsDao;
    }
    log({ message }, callback) {
        const { type, log, data, facade_id, iduser } = message;
        this.contractEventsDao.createContractEvent({ iduser, type, data, log, facade_id });
        callback();
    }
};
ContractEventTransport = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ContractEventsDao')),
    __metadata("design:paramtypes", [Object])
], ContractEventTransport);
const { combine, timestamp, printf, label, splat } = winston.format;
const customizedFormat = printf(({ message, label, timestamp }) => `${timestamp} [${label}]: ${JSON.stringify(message, null, 2)}`);
const contractEventsDao = new repository_1.ContractEventsRepository();
const contractEventDBTransport = new ContractEventTransport(contractEventsDao);
const contractEventconsoleTransport = new winston.transports.Console({
    format: combine(label({ label: 'contract_event' }), timestamp(), splat(), customizedFormat),
});
winston.loggers.add('contract_event', {
    transports: [contractEventDBTransport],
});
const contractEventLogger = winston.loggers.get('contract_event');
exports.contractEventLogger = contractEventLogger;
if (process.env.NODE_ENV !== 'production') {
    contractEventLogger.add(contractEventconsoleTransport);
}
//# sourceMappingURL=contractEvent.js.map