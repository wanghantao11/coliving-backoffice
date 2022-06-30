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
exports.ClientService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
let ClientService = class ClientService {
    constructor(clientDao, transactionDao) {
        this.clientDao = clientDao;
        this.transactionDao = transactionDao;
        this.createClient = (client) => this.transactionDao.createClientAndRoles(client);
        this.deleteClient = (id) => this.clientDao.deleteClient(Number(id));
        this.getClient = (id) => this.clientDao.getClient(id);
    }
};
ClientService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ClientDao')),
    __param(1, inversify_1.inject('TransactionDao')),
    __metadata("design:paramtypes", [Object, Object])
], ClientService);
exports.ClientService = ClientService;
//# sourceMappingURL=client.service.js.map