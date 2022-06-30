"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberTagsRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
let MemberTagsRepository = class MemberTagsRepository {
    constructor() {
        this.REPO_NAME = 'member_tags';
        this.createMemberTag = (tag) => typeorm_1.getRepository(entity_1.MemberTags, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.MemberTags)
            .values(Object.assign({}, tag))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteMemberTag = (id) => typeorm_1.getRepository(entity_1.MemberTags, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .where('id = :id', { id })
            .execute();
        this.getMemberTag = (id) => typeorm_1.getRepository(entity_1.MemberTags, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id', { id })
            .getOne();
        this.getMemberTags = (ids) => typeorm_1.getRepository(entity_1.MemberTags, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id IN (:...ids)', { ids })
            .getMany();
        this.getMemberTagsByClientId = (id) => typeorm_1.getRepository(entity_1.MemberTags, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('client_id = :id', { id })
            .getMany();
        this.updateMemberTag = (id, data) => typeorm_1.getRepository(entity_1.MemberTags, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('id = :id', { id })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
    }
};
MemberTagsRepository = __decorate([
    inversify_1.injectable()
], MemberTagsRepository);
exports.MemberTagsRepository = MemberTagsRepository;
//# sourceMappingURL=memberTags.js.map