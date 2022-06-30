"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentReportService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const common_1 = require("./../../infrastructure/utils/common");
let IncidentReportService = class IncidentReportService {
    constructor(incidentReportDao, adminDao, userDao) {
        this.incidentReportDao = incidentReportDao;
        this.adminDao = adminDao;
        this.userDao = userDao;
        this.createIncidentReport = (incidentReport) => this.incidentReportDao.createIncidentReport(incidentReport);
        this.getIncidentReportForAdmin = (id) => this.getIncidentReportById(Number(id));
        this.getIncidentReportsByClientId = (id, facadeIds, query) => this.incidentReportDao.getIncidentReportsByClientId(Number(id), facadeIds, query)
            .then(([total, incidents]) => total === 0 ? Promise.reject({ message: 'NO_CONTENT', reason: 'No incident report is found' })
            : ({ total, incidents }));
        this.getIncidentReportForTenant = (id) => this.getIncidentReportById(Number(id))
            .then(incident => !incident ? Promise.reject({ message: 'NOT_FOUND', reason: 'No incident report is found' }) : incident)
            .then(common_1.excludeKeysFromObject('priority'));
        this.getIncidentReportsForTenant = (id, facadeId, query) => this.incidentReportDao.getIncidentReportsForTenant(id, Number(facadeId), query);
        this.updateIncidentReport = (id, data) => this.incidentReportDao.updateIncidentReport(Number(id), data);
        this.getIncidentReportById = (id) => this.incidentReportDao.getIncidentReportById(id)
            .then(incidentReport => isNaN(Number(incidentReport.reporter_id)) ?
            // Reporter is a tenant
            this.userDao.getUserBy({ iduser: incidentReport.reporter_id })
                .then(tenant => (Object.assign(Object.assign({}, incidentReport), { reporter_name: tenant.first_name + ' ' + tenant.last_name, reporter_img_url: tenant.img_url })))
            : // Reporter is an admin
                this.adminDao.getAdminBy({ id: Number(incidentReport.reporter_id) })
                    .then(admin => (Object.assign(Object.assign({}, incidentReport), { reporter_name: admin.first_name + ' ' + admin.last_name, reporter_img_url: admin.img_url }))));
    }
};
IncidentReportService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('IncidentReportDao')),
    __param(1, inversify_1.inject('AdminDao')),
    __param(2, inversify_1.inject('UserDao')),
    __metadata("design:paramtypes", [Object, Object, Object])
], IncidentReportService);
exports.IncidentReportService = IncidentReportService;
//# sourceMappingURL=incidentReport.service.js.map