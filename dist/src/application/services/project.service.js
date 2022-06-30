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
exports.ProjectService = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const entity_1 = require("./../../domain/entity");
const firebase_1 = require("./../../infrastructure/utils/firebase");
const accomodation_1 = require("./../firebase/accomodation");
const project_1 = require("../../infrastructure/utils/project");
let ProjectService = class ProjectService {
    constructor(projectDao, projectFacadeDao, projectGalleryDao) {
        this.projectDao = projectDao;
        this.projectFacadeDao = projectFacadeDao;
        this.projectGalleryDao = projectGalleryDao;
        this.createProject = data => {
            const { gallery = [] } = data;
            return this.projectDao.createProject(data).then(project => Promise.all(gallery && gallery.length > 0 ? gallery.map(({ source, text }) => this.projectGalleryDao.createProjectImage(new entity_1.ProjectGallery(source, text, project.id))) : []).then(createdGallery => (Object.assign(Object.assign({}, project), { gallery: createdGallery }))));
        };
        this.deleteProject = (id) => this.projectDao.deleteProject(Number(id));
        this.updateProject = (id, data) => this.projectDao.getProject(Number(id))
            .then(project => !project ? Promise.reject({ message: 'NOT_FOUND', reason: `No project is found for project ${id}` }) : null)
            .then(() => this.projectDao.updateProject(Number(id), data))
            .then(project => this.projectGalleryDao.getProjectImagesByProjectId(project.id)
            .then(updatedGallery => (Object.assign(Object.assign({}, project), { gallery: updatedGallery }))));
        this.getProjectByFacadeId = (id) => this.projectDao.getProjectByFacadeId(id)
            .then(project => !project ? Promise.reject({ message: 'NOT_FOUND', reason: `No project is found for project facade ${id}` }) :
            Promise.all([
                this.projectGalleryDao.getProjectImagesByProjectId(project.id),
                this.projectFacadeDao.getProjectFacade(project.facade_id)
            ])
                .then(([gallery, { is_auto_offer_flow }]) => (Object.assign(Object.assign({}, project), { gallery, is_auto_offer_flow }))));
        this.getProjectsByFacadeIds = (ids) => this.projectDao.getProjectsByFacadeIds(ids);
        this.getAllPublishedProjects = (offset, limit) => this.projectDao.getAllPublishedProjects(limit, Number(offset)).then(projects => Promise.all(projects && projects.length > 0 ? projects.map(project => Promise.all([
            this.projectGalleryDao.getProjectImagesByProjectId(project.id),
            this.projectFacadeDao.getProjectFacade(project.facade_id)
        ])
            .then(([gallery, { is_auto_offer_flow }]) => (Object.assign(Object.assign({}, project), { gallery, is_auto_offer_flow })))) : []));
        this.publishProject = (id) => this.projectDao.getProject(id)
            .then(project => !project ? Promise.reject({ message: 'NOT_FOUND', reason: `No project is found for project ${id}` }) :
            project.is_published ? Promise.reject({ message: 'CONFLICT', reason: `Project ${id} is already published` }) :
                project_1.isPublishable(project).then(() => this.projectDao.updateProject(project.id, {
                    is_published: true,
                    published_at: new Date(),
                }).then(project => this.projectGalleryDao.getProjectImagesByProjectId(project.id)
                    .then(gallery => (Object.assign(Object.assign({}, project), { gallery }))))));
        this.deleteProjectImage = (galleryId) => this.projectGalleryDao.deleteProjectImage(galleryId)
            .then(deletedImage => firebase_1.parseImagePath(deletedImage.source))
            .then(accomodation_1.deleteImage);
        this.getProjectImagesByProjectId = (id) => this.projectGalleryDao.getProjectImagesByProjectId(id);
    }
};
ProjectService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ProjectDao')),
    __param(1, inversify_1.inject('ProjectFacadeDao')),
    __param(2, inversify_1.inject('ProjectGalleryDao')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProjectService);
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map