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
const statuscodes = require("http-status-codes");
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const swagger_express_ts_1 = require("swagger-express-ts");
const project_1 = require("./../../domain/entity/project");
const accomodation_1 = require("./../firebase/accomodation");
const auth_1 = require("./../middleware/auth");
const project_service_1 = require("./../services/project.service");
const constants_1 = require("../../infrastructure/constants");
let ProjectController = class ProjectController extends inversify_express_utils_1.BaseHttpController {
    constructor(projectService) {
        super();
        this.projectService = projectService;
    }
    createProject(req, res) {
        return project_1.Project.generateProject(Object.assign({ client_id: res.locals.clientId }, req.body))
            .then(this.projectService.createProject)
            .then(project => this.json({ project }, statuscodes.OK));
    }
    updateProject(req) {
        return this.projectService.updateProject(req.params.id, req.body)
            .then(project => this.json({ project }, statuscodes.OK));
    }
    getAllPublishedProjects(req) {
        return this.projectService.getAllPublishedProjects(req.query.offset, req.query.limit)
            .then(projects => this.json({ projects }, statuscodes.OK));
    }
    getProjectByFacadeId(id) {
        return this.projectService.getProjectByFacadeId(id)
            .then(project => this.json({ project }, statuscodes.OK));
    }
    uploadProjectImage(req) {
        return accomodation_1.uploadImage(req.params.id, req.body.img)
            .then(imageUrlObj => this.json(imageUrlObj, statuscodes.OK));
    }
    publishProject(id) {
        return this.projectService.publishProject(id)
            .then(project => this.json({ project }, statuscodes.OK));
    }
    deleteProject(req) {
        return this.projectService.deleteProject(req.params.id)
            .then(() => this.json({}, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new project',
        parameters: {
            body: { description: 'New project', required: true, model: 'Project' },
        },
        responses: {
            200: { model: 'Project' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized', 'createProjectValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "createProject", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the project',
        path: '/{id}',
        parameters: {
            body: { description: 'Project fields to update', model: 'Project' },
            path: {
                id: {
                    description: 'Id of project',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized', 'updateProjectValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "updateProject", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/published',
        description: 'Get all published projects',
        parameters: {
            query: {
                offset: {
                    description: 'Offset value of the search result',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                limit: {
                    description: 'Limit value of the search result',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'Project' },
            400: { description: 'Failed to get the projects' },
        },
    }),
    inversify_express_utils_1.httpGet('/published', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT, constants_1.GUEST]), 'isAuthenticated', 'isAuthorized', 'getPublishedProjectsValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getAllPublishedProjects", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}',
        description: 'Get the project by the project facade id',
        parameters: {
            path: {
                id: {
                    description: 'Id of project facade',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'Project' },
            400: { description: 'Failed to get the project' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL, constants_1.ACCOMMODATION_READ]), 'isAuthenticated', 'isAuthorized', 'getProjectByFacadeIdValidator'),
    __param(0, inversify_express_utils_1.requestParam('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getProjectByFacadeId", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Upload the project image',
        path: '/{id}/gallery',
        parameters: {
            body: { name: 'img', description: 'Url of the image to upload', required: true },
            path: {
                id: {
                    description: 'Id of project',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/:id/gallery', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized', 'uploadProjectImageValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "uploadProjectImage", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Publish the project to community',
        path: '/{id}/publish',
        parameters: {
            path: {
                id: {
                    description: 'Id of project',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/:id/publish', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized', 'publishedProjectValidator'),
    __param(0, inversify_express_utils_1.requestParam('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "publishProject", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        path: '/{id}',
        description: 'Delete the project',
        parameters: {
            query: {
                id: {
                    description: 'Id of project',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to delete the project' },
        },
    }),
    inversify_express_utils_1.httpDelete('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized', 'deleteProjectValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "deleteProject", null);
ProjectController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Project',
        path: '/project',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/project'),
    __param(0, inversify_1.inject('ProjectService')),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
exports.default = ProjectController;
//# sourceMappingURL=project.controller.js.map