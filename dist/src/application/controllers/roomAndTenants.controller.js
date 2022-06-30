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
const constants_1 = require("./../../infrastructure/constants");
const auth_1 = require("./../middleware/auth");
const room_service_1 = require("../services/room.service");
let RoomAndTenantsController = class RoomAndTenantsController extends inversify_express_utils_1.BaseHttpController {
    constructor(roomService) {
        super();
        this.roomService = roomService;
    }
    getRoomsWithTenants(req) {
        return this.roomService.getRoomsWithTenants(Number(req.params.facadeId), req.query)
            .then(roomAndTenants => this.json({ roomAndTenants }, statuscodes.OK));
    }
    getRoomsWithTerminatedContracts(req) {
        return this.roomService.getRoomsWithTerminatedContracts(Number(req.params.facadeId))
            .then(roomAndContracts => this.json({ roomAndContracts }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{facadeId}',
        description: 'Get all rooms and tenants who lived in these rooms for the given project facade',
        parameters: {
            path: {
                facadeId: {
                    description: 'Project facade id',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
            query: {
                name: {
                    description: 'Room name',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                room_number: {
                    description: 'Room number',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                prefix: {
                    description: 'Tenant name',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                people_per_room: {
                    description: 'How many people can accomodate in the room',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                status: {
                    description: 'Room status',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                label_ids: {
                    description: 'Room label ids',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.ARRAY,
                },
                offset: {
                    description: 'Offset value of the search result',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                limit: {
                    description: 'Limit value of the search result',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                sort_order: {
                    description: 'Sort order of the search result',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                sort_by: {
                    description: 'Sort by field of the search result',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get the rooms and tenants' },
        },
    }),
    inversify_express_utils_1.httpGet('/:facadeId', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ]), 'isAuthenticated', 'isAuthorized', 'getRoomAndTenantsValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomAndTenantsController.prototype, "getRoomsWithTenants", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{facadeId}/contracts',
        description: 'Get all rooms and contracts where each room has terminated but move-out date is in future',
        parameters: {
            path: {
                facadeId: {
                    description: 'Project facade id',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get the rooms and tenants' },
        },
    }),
    inversify_express_utils_1.httpGet('/:facadeId/contracts', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomAndTenantsController.prototype, "getRoomsWithTerminatedContracts", null);
RoomAndTenantsController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'RoomAndTenant',
        path: '/roomAndTenants',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/roomAndTenants'),
    __param(0, inversify_1.inject('RoomService')),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomAndTenantsController);
exports.default = RoomAndTenantsController;
//# sourceMappingURL=roomAndTenants.controller.js.map