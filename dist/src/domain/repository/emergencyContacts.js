"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyContactsRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const emergencyContacts_1 = require("../entity/emergencyContacts");
let EmergencyContactsRepository = class EmergencyContactsRepository {
    constructor() {
        this.REPO_NAME = 'emergency_contacts';
        this.createContact = (iduser, data) => typeorm_1.getRepository(emergencyContacts_1.EmergencyContacts, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(emergencyContacts_1.EmergencyContacts)
            .values(Object.assign({ iduser }, data))
            .returning('name, image, phone, relation')
            .execute()
            .then(res => res.raw[0]);
        this.deleteContact = (id) => typeorm_1.getRepository(emergencyContacts_1.EmergencyContacts, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .where('id = :id', { id })
            .execute();
        this.getContacts = (iduser) => typeorm_1.getRepository(emergencyContacts_1.EmergencyContacts, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('iduser = :iduser', { iduser })
            .getMany();
        this.updateContact = (id, data) => typeorm_1.getRepository(emergencyContacts_1.EmergencyContacts, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('id = :id', { id })
            .returning('name, image, phone, relation')
            .execute()
            .then(res => res.raw[0]);
    }
};
EmergencyContactsRepository = __decorate([
    inversify_1.injectable()
], EmergencyContactsRepository);
exports.EmergencyContactsRepository = EmergencyContactsRepository;
//# sourceMappingURL=emergencyContacts.js.map