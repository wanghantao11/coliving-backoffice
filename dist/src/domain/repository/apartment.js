"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApartmentRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const apartment_1 = require("./../../domain/entity/apartment");
let ApartmentRepository = class ApartmentRepository {
    constructor() {
        this.REPO_NAME = 'apartment';
        this.createApartment = (apartment) => typeorm_1.getRepository(apartment_1.Apartment, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(apartment_1.Apartment)
            .values(Object.assign({}, apartment))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteApartment = (id) => typeorm_1.getRepository(apartment_1.Apartment, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .where('id = :id', { id })
            .execute();
        this.getApartment = (id) => typeorm_1.getRepository(apartment_1.Apartment, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id', { id })
            .getOne();
        this.getApartmentsByFacadeId = (id) => typeorm_1.getRepository(apartment_1.Apartment, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('facade_id = :id', { id })
            .getMany();
        this.updateApartment = (id, data) => typeorm_1.getRepository(apartment_1.Apartment, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('id = :id', { id })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
    }
};
ApartmentRepository = __decorate([
    inversify_1.injectable()
], ApartmentRepository);
exports.ApartmentRepository = ApartmentRepository;
//# sourceMappingURL=apartment.js.map