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
const entity_1 = require("./../../domain/entity");
const auth_1 = require("./../middleware/auth");
const projectFacade_service_1 = require("./../services/projectFacade.service");
const address_service_1 = require("./../services/address.service");
const apartment_service_1 = require("./../services/apartment.service");
const label_service_1 = require("./../services/label.service");
const room_service_1 = require("./../services/room.service");
const constants_1 = require("../../infrastructure/constants");
let ProjectFacadeController = class ProjectFacadeController extends inversify_express_utils_1.BaseHttpController {
    constructor(projectFacadeService, addressService, apartmentService, labelService, roomService) {
        super();
        this.projectFacadeService = projectFacadeService;
        this.addressService = addressService;
        this.apartmentService = apartmentService;
        this.labelService = labelService;
        this.roomService = roomService;
    }
    createProjectFacade(req, res) {
        return entity_1.ProjectFacade.generateProjectFacade(Object.assign({ client_id: res.locals.clientId }, req.body))
            .then(this.projectFacadeService.createProjectFacade)
            .then(project => this.json({ project }, statuscodes.OK));
    }
    updateProjectFacade(req, res) {
        return this.projectFacadeService.updateProjectFacade(req.params.id, Object.assign({ client_id: res.locals.clientId }, req.body))
            .then(project => this.json({ project }, statuscodes.OK));
    }
    getAllMyProjectFacades(req, res) {
        return this.projectFacadeService.getAllMyProjectFacades(res.locals.clientId, req.query.offset, req.query.limit)
            .then(projects => this.json({ projects }, statuscodes.OK));
    }
    getProjectFacadeForTenant(req, res) {
        return this.projectFacadeService.getProjectFacade(res.locals.projectId)
            .then(data => this.json({ data }, statuscodes.OK));
    }
    getAddressesByFacadeId(req) {
        return this.addressService.getAddressesByFacadeId(req.params.id)
            .then(addresses => this.json({ addresses }, statuscodes.OK));
    }
    getApartmentsByProjectId(req) {
        return this.apartmentService.getApartmentsByFacadeId(req.params.id)
            .then(apartments => this.json({ apartments }, statuscodes.OK));
    }
    getLabelsByFacadeId(req) {
        return this.labelService.getLabelsByFacadeId(req.params.id)
            .then(labels => this.json({ labels }, statuscodes.OK));
    }
    getRoomsByFacadeId(req) {
        return this.roomService.getRoomsByFacadeId(req.params.id, req.query.today)
            .then(rooms => this.json({ rooms }, statuscodes.OK));
    }
    getProjectFacade(req) {
        return this.projectFacadeService.getProjectFacade(req.params.id)
            .then(data => this.json({ data }, statuscodes.OK));
    }
    deleteProjectFacade(req) {
        return this.projectFacadeService.deleteProjectFacade(req.params.id)
            .then(id => this.json({ id }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new project facade',
        parameters: {
            body: { description: 'New project facade', required: true, model: 'ProjectFacade' },
        },
        responses: {
            200: { model: 'ProjectFacade' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized', 'createProjectFacadeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeController.prototype, "createProjectFacade", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the project facade',
        path: '/{id}',
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
            200: {},
            400: {},
        },
    }),
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized', 'updateProjectFacadeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeController.prototype, "updateProjectFacade", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/my-all',
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
    inversify_express_utils_1.httpGet('/my-all', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL, constants_1.ACCOMMODATION_READ]), 'isAuthenticated', 'isAuthorized', 'getProjectFacadesValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeController.prototype, "getAllMyProjectFacades", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/tenant',
        description: 'Get the project facade for the tenant',
        responses: {
            200: { model: 'ProjectFacade' },
            400: { description: 'Failed to get the project facade' },
        },
    }),
    inversify_express_utils_1.httpGet('/tenant', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeController.prototype, "getProjectFacadeForTenant", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}/addresses',
        description: 'Get all addresses for the project facade',
        parameters: {
            path: {
                id: {
                    description: 'Id of the project facade',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'Address' },
            400: { description: 'Failed to get the addresses' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id/addresses', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ]), 'isAuthenticated', 'isAuthorized', 'parameterFacadeIdValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeController.prototype, "getAddressesByFacadeId", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}/apartments',
        description: 'Get all apartments for the project facade',
        parameters: {
            path: {
                id: {
                    description: 'Id of the project facade',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'Apartment' },
            400: { description: 'Failed to get the apartments' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id/apartments', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE, constants_1.COMMUNITY]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ]), 'isAuthenticated', 'isAuthorized', 'parameterFacadeIdValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeController.prototype, "getApartmentsByProjectId", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}/labels',
        description: 'Get all labels for the project facade',
        parameters: {
            path: {
                id: {
                    description: 'Id of the project facade',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'Label' },
            400: { description: 'Failed to get the labels' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id/labels', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ]), 'isAuthenticated', 'isAuthorized', 'parameterFacadeIdValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeController.prototype, "getLabelsByFacadeId", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}/rooms',
        description: 'Get all addresses for the project facade',
        parameters: {
            path: {
                id: {
                    description: 'Id of the project facade',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
            query: {
                today: {
                    description: 'Current date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: { model: 'Room' },
            400: { description: 'Failed to get the rooms' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id/rooms', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ]), 'isAuthenticated', 'isAuthorized', 'parameterFacadeIdValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeController.prototype, "getRoomsByFacadeId", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}',
        description: 'Get the project facade by the admin',
        parameters: {
            path: {
                id: {
                    description: 'Id of the project facade',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'ProjectFacade' },
            400: { description: 'Failed to get the project facade' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL, constants_1.ACCOMMODATION_READ]), 'isAuthenticated', 'isAuthorized', 'parameterFacadeIdValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeController.prototype, "getProjectFacade", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        path: '/{id}',
        description: 'Delete the project facade',
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
            200: {},
            400: { description: 'Failed to delete the project facade' },
        },
    }),
    inversify_express_utils_1.httpDelete('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ACCOMMODATION_FULL]), 'isAuthenticated', 'isAuthorized', 'parameterFacadeIdValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectFacadeController.prototype, "deleteProjectFacade", null);
ProjectFacadeController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'ProjectFacade',
        path: '/project-facade',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/project-facade'),
    __param(0, inversify_1.inject('ProjectFacadeService')),
    __param(1, inversify_1.inject('AddressService')),
    __param(2, inversify_1.inject('ApartmentService')),
    __param(3, inversify_1.inject('LabelService')),
    __param(4, inversify_1.inject('RoomService')),
    __metadata("design:paramtypes", [projectFacade_service_1.ProjectFacadeService,
        address_service_1.AddressService,
        apartment_service_1.ApartmentService,
        label_service_1.LabelService,
        room_service_1.RoomService])
], ProjectFacadeController);
exports.default = ProjectFacadeController;
//# sourceMappingURL=projectFacade.controller.js.map