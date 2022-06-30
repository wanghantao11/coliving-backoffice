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
exports.ApplicationService = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const entity_1 = require("./../../domain/entity/");
const mailchimp_1 = require("../../infrastructure/utils/mailchimp");
const constants_1 = require("../../infrastructure/constants");
let ApplicationService = class ApplicationService {
    constructor(applicationDao, userDao, projectFacadeDao) {
        this.applicationDao = applicationDao;
        this.userDao = userDao;
        this.projectFacadeDao = projectFacadeDao;
        this.applyForProject = (iduser, facadeId) => this.applicationDao.getMemberApplications({ iduser, facade_id: facadeId })
            .then(applications => applications.length !== 0 ?
            applications[0]
            : this.projectFacadeDao.getProjectFacade(facadeId)
                .then(project => !project ? Promise.reject({ message: 'NOT_FOUND', reason: `No project can be found by facade ${facadeId}` }) : project)
                .then(({ client_id, id: facade_id }) => this.applicationDao.createApplication(new entity_1.Application(iduser, facade_id, client_id))
                .then(application => this.userDao.getUserBy({ iduser })
                .then(({ email }) => mailchimp_1.formatUser({ subscribed_project_ids: [facadeId], email }))
                .then(mailchimp_1.updateUserTags(process.env.MAILCHIMP_LIST_ID))
                .then(() => application))));
        this.getMemberApplications = (iduser) => this.applicationDao.getMemberApplications({ iduser });
        this.getTotalCountAndTodayCountOfApplications = (facadeId) => this.applicationDao.getMemberApplications({ facade_id: facadeId })
            .then(applications => {
            const total = applications.length;
            const currentDate = new Date();
            const today = applications.filter(application => new Date(application.created_at).getTime() > currentDate.setHours(0, 0, 0, 0)).length;
            return { total, today };
        });
        this.unapplyForProject = (userId, facadeId) => this.applicationDao.deleteApplication(Number(facadeId), userId)
            .then(application => this.userDao.getUserBy({ userId })
            .then(({ email }) => mailchimp_1.formatUser({ subscribed_project_ids: [Number(facadeId)], email, status: constants_1.TAG_STATUS.INACTIVE }))
            .then(mailchimp_1.updateUserTags(process.env.MAILCHIMP_LIST_ID))
            .then(() => application));
    }
};
ApplicationService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ApplicationDao')),
    __param(1, inversify_1.inject('UserDao')),
    __param(2, inversify_1.inject('ProjectFacadeDao')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ApplicationService);
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=application.service.js.map