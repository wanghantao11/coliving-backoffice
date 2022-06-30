"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectFacadeDocumentRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const projectFacadeDocument_1 = require("../entity/projectFacadeDocument");
let ProjectFacadeDocumentRepository = class ProjectFacadeDocumentRepository {
    constructor() {
        this.REPO_NAME = 'project_facade_document';
        this.getProjectFacadeDocumentsByFacadeId = (facadeId) => typeorm_1.getRepository(projectFacadeDocument_1.ProjectFacadeDocument, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('facade_id = :facadeId', { facadeId })
            .getMany();
    }
};
ProjectFacadeDocumentRepository = __decorate([
    inversify_1.injectable()
], ProjectFacadeDocumentRepository);
exports.ProjectFacadeDocumentRepository = ProjectFacadeDocumentRepository;
//# sourceMappingURL=projectFacadeDocument.js.map