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
const auth_1 = require("./../middleware/auth");
const project_service_1 = require("./../services/project.service");
const constants_1 = require("../../infrastructure/constants");
let ProjectsController = class ProjectsController extends inversify_express_utils_1.BaseHttpController {
    constructor(projectService) {
        super();
        this.projectService = projectService;
    }
    getProjectsByFacadeIds(ids) {
        return this.projectService.getProjectsByFacadeIds(ids)
            .then(projects => this.json({ projects }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get projects based on given query filters',
        parameters: {
            query: {
                ids: {
                    description: 'Project facade ids',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.ARRAY,
                },
            },
        },
        responses: {
            200: { model: 'Project' },
            400: { description: 'Failed to get the projects' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE, constants_1.COMMUNITY]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL, constants_1.ACCOMMODATION_READ]), 'isAuthenticated', 'isAuthorized', 'getProjectsValidator'),
    __param(0, inversify_express_utils_1.queryParam('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getProjectsByFacadeIds", null);
ProjectsController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Projects',
        path: '/projects',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/projects'),
    __param(0, inversify_1.inject('ProjectService')),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectsController);
exports.default = ProjectsController;
//# sourceMappingURL=projects.controller.js.map