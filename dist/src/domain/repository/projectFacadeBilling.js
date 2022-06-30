"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFacadeBillingRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const projectFacadeBilling_1 = require("../entity/projectFacadeBilling");
let ProjectFacadeBillingRepository = class ProjectFacadeBillingRepository {
    constructor() {
        this.REPO_NAME = 'project_facade_billing';
        this.createProjectFacadeBilling = (data) => typeorm_1.getRepository(projectFacadeBilling_1.ProjectFacadeBilling, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(projectFacadeBilling_1.ProjectFacadeBilling)
            .values(Object.assign({}, data))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.getProjectFacadeBilling = (id) => typeorm_1.getRepository(projectFacadeBilling_1.ProjectFacadeBilling, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('facade_id = :id', { id })
            .getOne();
        this.updateProjectFacadeBilling = (id, data) => typeorm_1.getRepository(projectFacadeBilling_1.ProjectFacadeBilling, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('facade_id = :id', { id })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
    }
};
ProjectFacadeBillingRepository = __decorate([
    inversify_1.injectable()
], ProjectFacadeBillingRepository);
exports.ProjectFacadeBillingRepository = ProjectFacadeBillingRepository;
//# sourceMappingURL=projectFacadeBilling.js.map