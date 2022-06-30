"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
const contract_1 = require("./../../infrastructure/constants/contract");
const common_1 = require("./../../infrastructure/utils/common");
let ContractRepository = class ContractRepository {
    constructor() {
        this.REPO_NAME = 'contract';
        this.createContract = (data) => typeorm_1.getRepository(entity_1.Contract, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.Contract)
            .values(data)
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteContract = (id) => typeorm_1.getRepository(entity_1.Contract, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .where('id = :id', { id })
            .execute();
        this.getContractBy = (filter) => {
            const { participantId, externalId, iduser, status = [contract_1.CONTRACT_STATUS.PENDING, contract_1.CONTRACT_STATUS.SIGNED, contract_1.CONTRACT_STATUS.ACTIVE] } = filter;
            const queries = [];
            if (iduser) {
                queries.push(`contract.iduser = '${iduser}'`);
            }
            if (participantId) {
                queries.push(`contract.external_participant_id = '${participantId}'`);
            }
            if (externalId) {
                queries.push(`contract.external_id = '${externalId}'`);
            }
            if (status.length !== 0) {
                queries.push(`contract.status = ANY('{${status.join(',')}}')`);
            }
            return typeorm_1.getRepository(entity_1.Contract, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.User, 'user', 'user.iduser = contract.iduser')
                .select([
                '\"contract\".id',
                '\"contract\".iduser',
                '\"contract\".facade_id',
                '\"contract\".room_id',
                '\"contract\".external_id',
                '\"contract\".external_participant_id',
                '\"contract\".status',
                '\"user\".email as user_email',
                '\"user\".first_name as user_first_name',
                '\"user\".last_name as user_last_name',
            ])
                .where(queries.join(' AND '))
                .getRawOne();
        };
        this.getContractsBy = (filter) => {
            const { roomIds = [], participantId, externalId, iduser, status = [] } = filter;
            const queries = [];
            if (iduser) {
                queries.push(`contract.iduser = '${iduser}'`);
            }
            if (roomIds.length !== 0) {
                queries.push(`contract.room_id = ANY('{${roomIds.join(',')}}')`);
            }
            if (participantId) {
                queries.push(`contract.external_participant_id = '${participantId}'`);
            }
            if (externalId) {
                queries.push(`contract.external_id = '${externalId}'`);
            }
            if (status.length !== 0) {
                queries.push(`contract.status = ANY('{${status.join(',')}}')`);
            }
            return typeorm_1.getRepository(entity_1.Contract, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.User, 'user', 'user.iduser = contract.iduser')
                .select([
                '\"contract\".id',
                '\"contract\".iduser',
                '\"contract\".end_date',
                '\"contract\".facade_id',
                '\"contract\".room_id',
                '\"contract\".external_id',
                '\"contract\".external_participant_id',
                '\"contract\".start_date',
                '\"contract\".status',
                '\"user\".email as user_email',
                '\"user\".first_name as user_first_name',
                '\"user\".last_name as user_last_name',
                '\"user\".user_type',
            ])
                .where(queries.join(' AND '))
                .getRawMany();
        };
        this.getContractMembers = (query) => {
            const { facade_id, email, name, sent_from, sent_to, signed_from, signed_to, tag_ids, status, offset, limit, sort_by = 'sent_at', sort_order = 'DESC' } = query;
            const filterQuery = [`contract.status = '${status}'`];
            if (facade_id) {
                filterQuery.push(`contract.facade_id = ${facade_id}`);
            }
            if (email) {
                filterQuery.push(`(user.email ilike '%${email}%')`);
            }
            if (name) {
                filterQuery.push(`(user.first_name ilike '%${name}%' OR user.last_name ilike '%${name}%')`);
            }
            if (sent_from) {
                filterQuery.push(`contract.created_at >= '${common_1.convertDateToISOString(new Date(sent_from))}'`);
            }
            if (sent_to) {
                filterQuery.push(`contract.created_at < '${common_1.convertDateToISOString(new Date(sent_to))}'`);
            }
            if (signed_from) {
                filterQuery.push(`contract.signed_at >= '${common_1.convertDateToISOString(new Date(signed_from))}'`);
            }
            if (signed_to) {
                filterQuery.push(`contract.signed_at < '${common_1.convertDateToISOString(new Date(signed_to))}'`);
            }
            if (tag_ids) {
                filterQuery.push(`adminMemberNotes.tag_ids @> '{${tag_ids.join(',')}}'::int[]`);
            }
            const dbQuery = typeorm_1.getRepository(entity_1.Contract, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.User, 'user', 'user.iduser = contract.iduser')
                .innerJoin(entity_1.UserPreferences, 'userPreferences', 'user.user_key = userPreferences.iduser')
                .leftJoin(entity_1.AdminMemberNotes, 'adminMemberNotes', 'adminMemberNotes.iduser = contract.iduser')
                .leftJoin(entity_1.Room, 'room', 'room.id = contract.room_id')
                .leftJoin(entity_1.Apartment, 'apartment', 'apartment.id = room.apartment_id')
                .select([
                'contract.iduser AS iduser',
                'contract.created_at AS sent_at',
                'contract.signed_at AS signed_at',
                'room.name AS room_name',
                'apartment.name AS apartment_name',
                'adminMemberNotes.description AS notes',
                '\"user\".first_name',
                '\"user\".last_name',
                '\"user\".img_url',
                '\"user\".birthday',
                '\"user\".user_type',
                '\"userPreferences\".move_in_date_from',
                '\"userPreferences\".move_in_date_to',
            ])
                .where(filterQuery.join(' AND '))
                .orderBy(sort_by, sort_order);
            return Promise.all([
                dbQuery.getRawMany().then(members => members.length),
                dbQuery.offset(offset).limit(limit).getRawMany()
            ]);
        };
        this.getPendingContractsByClientId = (clientId) => typeorm_1.getRepository(entity_1.Contract, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .innerJoin(entity_1.ProjectFacade, 'project_facade', `project_facade.client_id = '${clientId}'`)
            .where(`status = '${contract_1.CONTRACT_STATUS.PENDING}' AND facade_id = project_facade.id`)
            .select([
            'facade_id',
            'COUNT(*) AS number_of_pending_contracts',
        ])
            .groupBy('facade_id')
            .getRawMany();
        this.updateContractBy = (filter, data) => {
            const { id, participantId } = filter;
            const queries = [];
            if (id) {
                queries.push(`contract.id = '${id}'`);
            }
            if (participantId) {
                queries.push(`contract.external_participant_id = '${participantId}'`);
            }
            return typeorm_1.getRepository(entity_1.Contract, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .update()
                .set(Object.assign({}, data))
                .where(queries.join(' AND '))
                .returning('*')
                .execute()
                .then(res => res.raw[0]);
        };
        this.getTenancyBy = (filter) => {
            const { room_id, status = [contract_1.CONTRACT_STATUS.ACTIVE, contract_1.CONTRACT_STATUS.SIGNED, contract_1.CONTRACT_STATUS.TERMINATED] } = filter;
            const queries = [];
            if (room_id) {
                queries.push(`contract.room_id = ${room_id}`);
            }
            if (status.length !== 0) {
                queries.push(`contract.status = ANY('{${status.join(',')}}')`);
            }
            return typeorm_1.getRepository(entity_1.Contract, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.User, 'user', 'user.iduser = contract.iduser')
                .leftJoin(entity_1.AdminMemberNotes, 'adminMemberNotes', 'adminMemberNotes.iduser = contract.iduser')
                .select([
                '\"adminMemberNotes\".description',
                '\"contract\".id as contract_id',
                '\"contract\".iduser',
                '\"contract\".room_id',
                '\"contract\".start_date',
                '\"contract\".end_date',
                '\"contract\".status',
                '\"user\".email',
                '\"user\".first_name',
                '\"user\".last_name',
                '\"user\".phone',
                '\"user\".img_url',
                '\"user\".user_type',
            ])
                .where(queries.join(' AND '))
                .orderBy('start_date', 'ASC')
                .getRawMany();
        };
    }
};
ContractRepository = __decorate([
    inversify_1.injectable()
], ContractRepository);
exports.ContractRepository = ContractRepository;
//# sourceMappingURL=contract.js.map