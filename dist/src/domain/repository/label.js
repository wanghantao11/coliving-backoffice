"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
let LabelRepository = class LabelRepository {
    constructor() {
        this.REPO_NAME = 'label';
        this.createLabel = (label) => typeorm_1.getRepository(entity_1.Label, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.Label)
            .values(Object.assign({}, label))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteLabel = (id) => typeorm_1.getRepository(entity_1.Label, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .where('id = :id', { id })
            .execute();
        this.getLabel = (id) => typeorm_1.getRepository(entity_1.Label, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id', { id })
            .getOne();
        this.getLabels = (ids) => typeorm_1.getRepository(entity_1.Label, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id IN (:...ids)', { ids })
            .getMany();
        this.getLabelsByFacadeId = (id) => typeorm_1.getRepository(entity_1.Label, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('facade_id = :id', { id })
            .getMany();
        this.updateLabel = (id, data) => typeorm_1.getRepository(entity_1.Label, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('id = :id', { id })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
    }
};
LabelRepository = __decorate([
    inversify_1.injectable()
], LabelRepository);
exports.LabelRepository = LabelRepository;
//# sourceMappingURL=label.js.map