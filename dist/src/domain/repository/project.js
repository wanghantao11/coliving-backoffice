"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const project_1 = require("./../../domain/entity/project");
const entity_1 = require("../entity");
let ProjectRepository = class ProjectRepository {
    constructor() {
        this.REPO_NAME = 'project';
        this.createProject = (data) => typeorm_1.getRepository(project_1.Project, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(project_1.Project)
            .values(Object.assign({}, data))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteProject = (id) => typeorm_1.getRepository(project_1.Project, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id ', { id })
            .delete()
            .execute();
        this.getProject = (id) => typeorm_1.getRepository(project_1.Project, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id', { id })
            .getOne();
        this.getProjectByFacadeId = (facadeId) => typeorm_1.getRepository(project_1.Project, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('facade_id = :facadeId', { facadeId })
            .getOne();
        this.getProjectsByFacadeIds = (facadeIds) => typeorm_1.getRepository(project_1.Project, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('facade_id IN (:...facadeIds)', { facadeIds })
            .getMany();
        this.getAllPublishedProjects = (limit = 10, offset = 0) => typeorm_1.getRepository(project_1.Project, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .offset(offset)
            .limit(limit)
            .orderBy('published_at', 'DESC')
            .where('is_published = :isPublished', { isPublished: true })
            .getMany();
        this.updateProject = (id, data) => typeorm_1.getRepository(project_1.Project, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('id = :id', { id })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.getProjectDataForContractByProjectId = (projectId) => {
            const selectedFields = [
                '\"projectFacade\".name',
                '\"projectFacade\".id',
                '\"projectFacade\".landlord_name',
                '\"projectFacade\".landlord_email',
                '\"projectFacade\".landlord_org_no',
                '\"projectFacade\".landlord_street',
                '\"projectFacade\".landlord_zip',
                '\"projectFacade\".landlord_post_area',
                '\"projectFacade\".property_unit_designation',
                '\"projectFacade\".coliving_hub',
                '\"projectFacade\".post_area',
                // projectFacadeBilling
                'bankgiro_no',
                'deposit',
                'deposit_refund_weeks',
                'rent_yearly_increase_rate',
                'rent_yearly_increase_date',
                'rent_day_of_month',
                'service_fee_day_of_month',
                // contractTemplates
                'extra_fields',
                // collection
                'collection_id',
            ];
            const roomFields = [
                '\"room\".id',
                '\"room\".number',
                '\"room\".people_per_room',
                '\"room\".size',
                '\"room\".shared_area_size',
                '\"room\".floor_no',
                '\"room\".rent',
                '\"room\".service_fee',
                '\"address\".street',
                '\"address\".zip',
                '\"project\".id as project_id',
            ];
            const groupByFields = selectedFields.join(',');
            return typeorm_1.getRepository(project_1.Project, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .where(`project.id = ${projectId}`)
                .innerJoin(entity_1.ProjectFacade, 'projectFacade', 'projectFacade.id = project.facade_id')
                .innerJoin(entity_1.ProjectFacadeBilling, 'project_facade_billing', 'project_facade_billing.facade_id = project.facade_id')
                .innerJoin(entity_1.ContractTemplates, 'contract_templates', 'contract_templates.facade_id = project.facade_id')
                .innerJoinAndSelect(subquery => subquery
                .from(project_1.Project, 'project')
                .innerJoin(entity_1.ProjectFacade, 'projectFacade', 'projectFacade.id = project.facade_id')
                .innerJoin(entity_1.Room, 'room', 'room.facade_id = project.facade_id')
                .innerJoin(entity_1.Address, 'address', 'address.id = room.address_id')
                .select(roomFields), 'room', `room.project_id = ${projectId}`)
                .select(selectedFields)
                .addSelect('json_agg(room) FILTER (WHERE room.id IS NOT NULL) AS rooms')
                .groupBy(groupByFields)
                .getRawOne();
        };
    }
};
ProjectRepository = __decorate([
    inversify_1.injectable()
], ProjectRepository);
exports.ProjectRepository = ProjectRepository;
//# sourceMappingURL=project.js.map