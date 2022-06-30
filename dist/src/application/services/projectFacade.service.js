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
exports.ProjectFacadeService = void 0;
const inversify_1 = require("inversify");
const lodash_1 = require("lodash");
require("reflect-metadata");
const entity_1 = require("./../../domain/entity");
const offer_1 = require("../../infrastructure/utils/offer");
let ProjectFacadeService = class ProjectFacadeService {
    constructor(projectFacadeDao, transaticonDao, offerDao) {
        this.projectFacadeDao = projectFacadeDao;
        this.transaticonDao = transaticonDao;
        this.offerDao = offerDao;
        this.createProjectFacade = (facade) => entity_1.ProjectFacade.generateProjectFacade(facade)
            .then(this.transaticonDao.createProjectFacadeWithBillingAndTemplates);
        this.deleteProjectFacade = (id) => this.projectFacadeDao.deleteProjectFacade(Number(id));
        this.getProjectFacade = (id) => this.projectFacadeDao.getProjectFacade(Number(id));
        this.getAllMyProjectFacades = (clientId, offset, limit = 12) => this.projectFacadeDao.getAllMyProjectFacades(clientId, limit, Number(offset));
        this.updateProjectFacade = (id, data) => this.projectFacadeDao.getProjectFacade(Number(id))
            .then(projectFacade => !projectFacade ? Promise.reject({ message: 'NOT_FOUND', reason: `No project is found for project ${id}` }) : projectFacade)
            .then(({ is_auto_offer_flow }) => lodash_1.isBoolean(data.is_auto_offer_flow)
            && is_auto_offer_flow !== data.is_auto_offer_flow
            && offer_1.processOfferFlowSwitch({ id: Number(id), is_auto_offer_flow: data.is_auto_offer_flow }, this.offerDao))
            .then(() => this.projectFacadeDao.updateProjectFacade(Number(id), data));
    }
};
ProjectFacadeService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ProjectFacadeDao')),
    __param(1, inversify_1.inject('TransactionDao')),
    __param(2, inversify_1.inject('OfferDao')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProjectFacadeService);
exports.ProjectFacadeService = ProjectFacadeService;
//# sourceMappingURL=projectFacade.service.js.map