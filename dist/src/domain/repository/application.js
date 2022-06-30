"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepo = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
const user_1 = require("../../infrastructure/constants/user");
const common_1 = require("../../infrastructure/utils/common");
let ApplicationRepo = class ApplicationRepo {
    constructor() {
        this.REPO_NAME = 'application';
        this.createApplication = (application) => typeorm_1.getRepository(entity_1.Application, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.Application)
            .values(Object.assign({}, application))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteApplication = (facadeId, iduser) => typeorm_1.getRepository(entity_1.Application, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('iduser = :iduser AND facade_id = :facadeId', { iduser, facadeId })
            .delete()
            .execute();
        this.getCountOfApplicationsByDateRange = (startDate, endDate) => typeorm_1.getRepository(entity_1.Application, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .innerJoin(entity_1.ProjectFacade, 'project_facade', 'project_facade.id = application.facade_id')
            .leftJoinAndSelect(entity_1.User, 'user', 'user.iduser = application.iduser')
            .where('application.created_at > :startDate', { startDate })
            .andWhere('application.created_at <= :endDate', { endDate })
            .select([
            'COUNT(*)',
            'COUNT(*) FILTER (WHERE user.is_test_complete) AS count_test_complete',
            'project_facade.name AS facade_name',
            'TO_CHAR(application.created_at::DATE, \'YYYY-MM-DD\') AS date',
            'project_facade.id AS facade_id',
        ])
            .groupBy('project_facade.id, date')
            .getRawMany();
        this.getInterestedMembers = (query) => {
            const { facade_id, email, name, subscribed_from, subscribed_to, tag_ids, offset, limit, sort_by = 'subscribed_at', sort_order = 'DESC' } = query;
            const filterQuery = [`user.user_type = '${user_1.USER_TYPE.LIGHT}'`];
            if (facade_id) {
                filterQuery.push(`application.facade_id = ${facade_id}`);
            }
            if (email) {
                filterQuery.push(`(user.email ilike '%${email}%')`);
            }
            if (name) {
                filterQuery.push(`(user.first_name ilike '%${name}%' OR user.last_name ilike '%${name}%')`);
            }
            if (subscribed_from) {
                filterQuery.push(`application.created_at >= '${common_1.convertDateToISOString(new Date(subscribed_from))}'`);
            }
            if (subscribed_to) {
                filterQuery.push(`application.created_at < '${common_1.convertDateToISOString(new Date(subscribed_to))}'`);
            }
            if (tag_ids) {
                filterQuery.push(`adminMemberNotes.tag_ids @> '{${tag_ids.join(',')}}'::int[]`);
            }
            const dbQuery = typeorm_1.getRepository(entity_1.Application, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.User, 'user', 'user.iduser = application.iduser')
                .innerJoin(entity_1.UserPreferences, 'userPreferences', 'user.user_key = userPreferences.iduser')
                .leftJoin(entity_1.AdminMemberNotes, 'adminMemberNotes', 'adminMemberNotes.iduser = application.iduser')
                .select([
                'user.iduser as iduser',
                'application.created_at AS subscribed_at',
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
        this.getMemberApplications = (query) => {
            const queries = [];
            const { iduser, facade_id, client_id } = query;
            if (iduser) {
                queries.push(`iduser = '${iduser}'`);
            }
            if (facade_id) {
                queries.push(`facade_id = '${facade_id}'`);
            }
            if (client_id) {
                queries.push(`client_id = '${client_id}'`);
            }
            return typeorm_1.getRepository(entity_1.Application, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .where(queries.join(' AND '))
                .getMany();
        };
        this.getTotalNumberOfSubscribersByClientId = (clientId) => typeorm_1.getRepository(entity_1.Application, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .leftJoinAndSelect(entity_1.User, 'user', 'user.iduser = application.iduser')
            .where('application.client_id = :clientId', { clientId })
            .select([
            'COUNT(DISTINCT application.iduser)',
            'COUNT(DISTINCT application.iduser) FILTER (WHERE user.is_test_complete) AS count_test_complete',
        ])
            .getRawOne();
    }
};
ApplicationRepo = __decorate([
    inversify_1.injectable()
], ApplicationRepo);
exports.ApplicationRepo = ApplicationRepo;
//# sourceMappingURL=application.js.map