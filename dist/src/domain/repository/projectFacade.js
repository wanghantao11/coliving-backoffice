"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFacadeRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
let ProjectFacadeRepository = class ProjectFacadeRepository {
    constructor() {
        this.REPO_NAME = 'project_facade';
        this.createProjectFacade = (projectFacade) => typeorm_1.getRepository(entity_1.ProjectFacade, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.ProjectFacade)
            .values(Object.assign({}, projectFacade))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.updateProjectFacade = (id, data) => typeorm_1.getRepository(entity_1.ProjectFacade, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('id = :id', { id })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteProjectFacade = (id) => typeorm_1.getRepository(entity_1.ProjectFacade, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .where('id = :id ', { id })
            .execute();
        this.getProjectFacade = (id) => typeorm_1.getRepository(entity_1.ProjectFacade, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id', { id })
            .getOne();
        this.getProjectFacades = (ids) => typeorm_1.getRepository(entity_1.ProjectFacade, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id IN (:...ids)', { ids })
            .getMany();
        this.getPublishedProjectFacade = (id) => typeorm_1.getRepository(entity_1.ProjectFacade, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id AND published = :published', { id, published: true })
            .getOne();
        this.getAllPublishedProjectFacades = (limit, offset) => typeorm_1.getRepository(entity_1.ProjectFacade, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .offset(offset)
            .limit(limit)
            .orderBy('published_at', 'DESC')
            .where('published = :published', { published: true })
            .getMany();
        this.getAllMyProjectFacades = (clientId, limit, offset) => typeorm_1.getRepository(entity_1.ProjectFacade, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .offset(offset)
            .limit(limit)
            .orderBy('published_at', 'DESC')
            .where('client_id = :id', { id: clientId })
            .getMany();
        this.getMyProjectFacades = (clientId, published, limit, offset) => typeorm_1.getRepository(entity_1.ProjectFacade, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .offset(offset)
            .limit(limit)
            .orderBy('published_at', 'DESC')
            .where('client_id= :id AND published = :published', { id: clientId, published })
            .getMany();
        this.getProjectDataForContract = (roomId) => typeorm_1.getRepository(entity_1.ProjectFacade, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .innerJoin(entity_1.Room, 'room', `room.id = ${roomId}`)
            .innerJoin(entity_1.ProjectFacadeBilling, 'project_facade_billing', 'project_facade_billing.facade_id = room.facade_id')
            .innerJoin(entity_1.ContractTemplates, 'contract_templates', 'contract_templates.facade_id = room.facade_id')
            .innerJoin(entity_1.Address, 'address', 'address.id = room.address_id')
            .where('project_facade.id = room.facade_id')
            .select([
            // projectFacade
            'project_facade.name as project_name',
            'project_facade.id as facade_id',
            'landlord_name',
            'landlord_email',
            'landlord_org_no',
            'landlord_street',
            'landlord_zip',
            'landlord_post_area',
            'property_unit_designation',
            'coliving_hub',
            'post_area',
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
            // room
            'room.id',
            'number',
            'people_per_room',
            'size',
            'shared_area_size',
            'floor_no',
            'street',
            'zip',
            'rent',
            'service_fee',
            // collection
            'collection_id'
        ])
            .getRawOne();
    }
};
ProjectFacadeRepository = __decorate([
    inversify_1.injectable()
], ProjectFacadeRepository);
exports.ProjectFacadeRepository = ProjectFacadeRepository;
//# sourceMappingURL=projectFacade.js.map