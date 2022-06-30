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
exports.EmergencyContactsService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
let EmergencyContactsService = class EmergencyContactsService {
    constructor(emergencyContactsDao) {
        this.emergencyContactsDao = emergencyContactsDao;
        this.createContact = (iduser, data) => this.emergencyContactsDao.createContact(iduser, data);
        this.getContacts = (iduser) => this.emergencyContactsDao.getContacts(iduser);
        this.updateContact = (id, data) => this.emergencyContactsDao.updateContact(id, data);
        this.deleteContact = (id) => this.emergencyContactsDao.deleteContact(id);
    }
};
EmergencyContactsService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('EmergencyContactsDao')),
    __metadata("design:paramtypes", [Object])
], EmergencyContactsService);
exports.EmergencyContactsService = EmergencyContactsService;
//# sourceMappingURL=emergencyContacts.service.js.map