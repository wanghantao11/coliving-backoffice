"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
let RoleRepository = class RoleRepository {
    constructor() {
        this.REPO_NAME = 'role';
        this.createRole = (role) => typeorm_1.getRepository(entity_1.Role, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.Role)
            .values(Object.assign({}, role))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.getRole = (id) => typeorm_1.getRepository(entity_1.Role, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id', { id })
            .getOne();
        this.getRolesByClientId = (clientId) => typeorm_1.getRepository(entity_1.Role, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('role.client_id = :clientId', { clientId })
            .getMany();
    }
};
RoleRepository = __decorate([
    inversify_1.injectable()
], RoleRepository);
exports.RoleRepository = RoleRepository;
//# sourceMappingURL=role.js.map