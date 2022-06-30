"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
let ClientRepository = class ClientRepository {
    constructor() {
        this.REPO_NAME = 'client';
        this.createClient = (client) => typeorm_1.getRepository(entity_1.Client, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.Client)
            .values(Object.assign({}, client))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteClient = (id) => typeorm_1.getRepository(entity_1.Client, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .where('id = :id', { id })
            .execute();
        this.getClient = (id) => typeorm_1.getRepository(entity_1.Client, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id', { id })
            .getOne();
    }
};
ClientRepository = __decorate([
    inversify_1.injectable()
], ClientRepository);
exports.ClientRepository = ClientRepository;
//# sourceMappingURL=client.js.map