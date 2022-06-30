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
const inversify_1 = require("inversify");
const statuscodes = require("http-status-codes");
const inversify_express_utils_1 = require("inversify-express-utils");
const swagger_express_ts_1 = require("swagger-express-ts");
const projectGallery_service_1 = require("./../services/projectGallery.service");
const auth_1 = require("./../middleware/auth");
const constants_1 = require("../../infrastructure/constants");
let ProjectGalleryController = class ProjectGalleryController extends inversify_express_utils_1.BaseHttpController {
    constructor(projectGalleryService) {
        super();
        this.projectGalleryService = projectGalleryService;
    }
    createProjectGallery(req) {
        return this.projectGalleryService.createProjectImage(req.body)
            .then(projectGallery => this.json({ projectGallery }, statuscodes.OK));
    }
    deleteProjectGallery(req) {
        return this.projectGalleryService.deleteProjectImage(req.params.id)
            .then(() => this.json({}, statuscodes.OK));
    }
    updateProjectGallery(req) {
        return this.projectGalleryService.updateProjectImage(req.params.id, req.body)
            .then(projectGallery => this.json({ projectGallery }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new project gallery image',
        parameters: {
            body: { description: 'New project gallery image', required: true, model: 'ProjectGallery' },
        },
        responses: {
            200: { model: 'ProjectGallery' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized', 'createProjectGalleryValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectGalleryController.prototype, "createProjectGallery", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: 'Delete the the project gallery',
        path: '/{id}',
        parameters: {
            path: {
                id: {
                    description: 'Id of the project image',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to delete the project image' },
        },
    }),
    inversify_express_utils_1.httpDelete('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectGalleryController.prototype, "deleteProjectGallery", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the project image',
        path: '/{id}',
        parameters: {
            body: { description: 'The url of the admin profile image', required: true, model: 'ProjectGallery' },
            path: {
                id: {
                    description: 'Id of project image',
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
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized', 'updateProjectGalleryValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectGalleryController.prototype, "updateProjectGallery", null);
ProjectGalleryController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'ProjectGallery',
        path: '/project-gallery',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/project-gallery'),
    __param(0, inversify_1.inject('ProjectGalleryService')),
    __metadata("design:paramtypes", [projectGallery_service_1.ProjectGalleryService])
], ProjectGalleryController);
exports.default = ProjectGalleryController;
//# sourceMappingURL=projectGallery.controller.js.map