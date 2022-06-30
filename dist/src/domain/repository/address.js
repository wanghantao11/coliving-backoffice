"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const address_1 = require("./../../domain/entity/address");
let AddressRepository = class AddressRepository {
    constructor() {
        this.REPO_NAME = 'address';
        this.createAddress = (address) => typeorm_1.getRepository(address_1.Address, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(address_1.Address)
            .values(Object.assign({}, address))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteAddress = (id) => typeorm_1.getRepository(address_1.Address, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .where('id = :id', { id })
            .execute();
        this.getAddress = (id) => typeorm_1.getRepository(address_1.Address, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id', { id })
            .getOne();
        this.getAddressesByFacadeId = (id) => typeorm_1.getRepository(address_1.Address, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('facade_id = :id', { id })
            .getMany();
        this.updateAddress = (id, data) => typeorm_1.getRepository(address_1.Address, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('id = :id', { id })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
    }
};
AddressRepository = __decorate([
    inversify_1.injectable()
], AddressRepository);
exports.AddressRepository = AddressRepository;
//# sourceMappingURL=address.js.map