"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentReportRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
let IncidentReportRepository = class IncidentReportRepository {
    constructor() {
        this.REPO_NAME = 'incident_report';
        this.createIncidentReport = (incidentReport) => typeorm_1.getRepository(entity_1.IncidentReport, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.IncidentReport)
            .values(Object.assign({}, incidentReport))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.getIncidentReportById = (id) => typeorm_1.getRepository(entity_1.IncidentReport, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .leftJoin(entity_1.Admin, 'admin', 'incident_report.owner_id = admin.id')
            .select([
            '\"admin\".id AS owner_id',
            '\"admin\".first_name AS owner_first_name',
            '\"admin\".last_name AS owner_last_name',
            '\"admin\".img_url AS owner_img_url',
            '\"incident_report\".id',
            '\"incident_report\".category',
            '\"incident_report\".client_id',
            '\"incident_report\".closed_at',
            '\"incident_report\".created_at',
            '\"incident_report\".decline_reason',
            '\"incident_report\".description',
            '\"incident_report\".estimated_done_date',
            '\"incident_report\".facade_id',
            '\"incident_report\".feedback',
            '\"incident_report\".is_private',
            '\"incident_report\".location',
            '\"incident_report\".owner_comment',
            '\"incident_report\".photos',
            '\"incident_report\".priority',
            '\"incident_report\".reporter_id',
            '\"incident_report\".satisfaction_level',
            '\"incident_report\".subcategory',
            '\"incident_report\".status',
            '\"incident_report\".title',
        ])
            .where('incident_report.id = :id', { id })
            .getRawOne();
        this.getIncidentReportsByClientId = (id, facadeIds, query) => {
            const { status, offset = 0, limit = 10, } = query;
            let filterQuery = `client_id = ${id}`;
            if (facadeIds) {
                filterQuery = filterQuery + ` AND (facade_id = ANY('{${facadeIds.join(',')}}'::int[]))`;
            }
            if (status) {
                filterQuery = filterQuery + ` AND (status = ANY('{${status.join(',')}}'))`;
            }
            const dbQuery = typeorm_1.getRepository(entity_1.IncidentReport, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .where(filterQuery);
            return Promise.all([
                dbQuery.getMany().then(incidents => incidents.length),
                dbQuery.offset(offset).limit(limit).getMany()
            ]);
        };
        this.getIncidentReportsForTenant = (id, facadeId, query) => {
            const { closed_at, status, offset = 0, limit = 10, } = query;
            let filterQuery = `incident_report.facade_id = ${facadeId} AND (incident_report.reporter_id = '${id}' OR incident_report.is_private = FALSE)`;
            if (closed_at) {
                filterQuery = filterQuery + ` AND (incident_report.closed_at IS NULL OR incident_report.closed_at >= (${closed_at})::timestamp)`;
            }
            if (status) {
                filterQuery = filterQuery + ` AND (incident_report.status = ANY('{${status.join(',')}}'))`;
            }
            const dbQuery = typeorm_1.getRepository(entity_1.IncidentReport, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .select([
                'incident_report.id',
                'incident_report.closed_at',
                'incident_report.created_at',
                'incident_report.client_id',
                'incident_report.estimated_done_date',
                'incident_report.facade_id',
                'incident_report.is_private',
                'incident_report.location',
                'incident_report.status',
                'incident_report.title',
            ])
                .where(filterQuery);
            return Promise.all([
                dbQuery.getMany().then(incidents => incidents.length),
                dbQuery.offset(offset).limit(limit).getMany()
            ]);
        };
        this.updateIncidentReport = (id, data) => typeorm_1.getRepository(entity_1.IncidentReport, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('id = :id', { id })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
    }
};
IncidentReportRepository = __decorate([
    inversify_1.injectable()
], IncidentReportRepository);
exports.IncidentReportRepository = IncidentReportRepository;
//# sourceMappingURL=incidentReport.js.map