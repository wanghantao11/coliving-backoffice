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
exports.ProjectGalleryService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const entity_1 = require("../../domain/entity");
let ProjectGalleryService = class ProjectGalleryService {
    constructor(projectGalleryDao) {
        this.projectGalleryDao = projectGalleryDao;
        this.createProjectImage = (data) => this.projectGalleryDao.createProjectImage(new entity_1.ProjectGallery(data.source, data.text, data.id));
        this.updateProjectImage = (id, data) => this.projectGalleryDao.updateProjectImage(Number(id), data);
        this.deleteProjectImage = (id) => this.projectGalleryDao.deleteProjectImage(Number(id));
    }
};
ProjectGalleryService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ProjectGalleryDao')),
    __metadata("design:paramtypes", [Object])
], ProjectGalleryService);
exports.ProjectGalleryService = ProjectGalleryService;
//# sourceMappingURL=projectGallery.service.js.map