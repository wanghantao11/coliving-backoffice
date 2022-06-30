"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMemberNotesRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
let AdminMemberNotesRepository = class AdminMemberNotesRepository {
    constructor() {
        this.REPO_NAME = 'admin_member_notes';
        this.getAdminMemberNotes = (iduser) => typeorm_1.getRepository(entity_1.AdminMemberNotes, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('iduser = :iduser', { iduser })
            .getOne();
        this.createAdminMemberNotes = (data) => typeorm_1.getRepository(entity_1.AdminMemberNotes, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.AdminMemberNotes)
            .values(Object.assign({}, data))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.updateAdminMemberNotes = (iduser, data) => typeorm_1.getRepository(entity_1.AdminMemberNotes, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('iduser = :iduser', { iduser })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
    }
};
AdminMemberNotesRepository = __decorate([
    inversify_1.injectable()
], AdminMemberNotesRepository);
exports.AdminMemberNotesRepository = AdminMemberNotesRepository;
//# sourceMappingURL=adminMemberNotes.js.map