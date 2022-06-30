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
const room_1 = require("./../../domain/entity/room");
const constants_1 = require("./../../infrastructure/constants");
const auth_1 = require("./../middleware/auth");
const room_service_1 = require("./../services/room.service");
let RoomController = class RoomController extends inversify_express_utils_1.BaseHttpController {
    constructor(roomService) {
        super();
        this.roomService = roomService;
    }
    createRoom(req) {
        return room_1.Room.generateRoom(req.body)
            .then(this.roomService.createRoom)
            .then(room => this.json({ room }, statuscodes.OK));
    }
    updateRoom(req) {
        return this.roomService.updateRoom(req.params.id, req.body)
            .then(room => this.json({ room }, statuscodes.OK));
    }
    deleteRoom(req) {
        return this.roomService.deleteRoom(req.params.id)
            .then(() => this.json({}, statuscodes.OK));
    }
    deleteRooms(req) {
        return this.roomService.deleteRooms(req.body.ids)
            .then(() => this.json({}, statuscodes.OK));
    }
    getLabelsByRoomId(req) {
        return this.roomService.getLabelsByRoomId(req.params.id)
            .then(labels => this.json({ labels }, statuscodes.OK));
    }
    getPendingOffersSentByAdminByRoomId(req) {
        return this.roomService.getPendingOffersSentByAdminByRoomId(req.params.id)
            .then(offers => this.json({ offers }, statuscodes.OK));
    }
    getRoom(req) {
        return this.roomService.getRoom(req.params.id)
            .then(room => this.json({ room }, statuscodes.OK));
    }
    getTenancy(req) {
        return this.roomService.getTenancyBy(Object.assign({ room_id: req.params.id }, req.query))
            .then(tenancies => this.json({ tenancies }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Create a new room',
        parameters: {
            body: { description: 'New room', required: true, model: 'Room' },
        },
        responses: {
            200: { model: 'Room' },
            400: { description: 'Failed to create' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'createRoomValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "createRoom", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: 'Update the room',
        path: '/{id}',
        parameters: {
            body: { description: 'Room fields to update', required: true, model: 'Room' },
            path: {
                id: {
                    description: 'Id of room',
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
    inversify_express_utils_1.httpPut('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'updateRoomValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "updateRoom", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        path: '/{id}',
        description: 'Delete the room',
        parameters: {
            query: {
                id: {
                    description: 'Id of room',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to delete the room' },
        },
    }),
    inversify_express_utils_1.httpDelete('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "deleteRoom", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: 'Delete the rooms by the room ids',
        parameters: {},
        responses: {
            200: {},
            400: { description: 'Failed to delete the rooms' },
        },
    }),
    inversify_express_utils_1.httpDelete('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL]), 'isAuthenticated', 'isAuthorized', 'deleteRoomsValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "deleteRooms", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}/labels',
        description: 'Get all labels for the room',
        parameters: {
            path: {
                id: {
                    description: 'Id of the room',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'Label' },
            400: { description: 'Failed to get the lables for the room' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id/labels', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "getLabelsByRoomId", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}/pending-offers',
        description: 'Get all pending offers sent by admin for the room',
        parameters: {
            path: {
                id: {
                    description: 'Id of the room',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'Offer' },
            400: { description: 'Failed to get the pending offers for the room' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id/pending-offers', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "getPendingOffersSentByAdminByRoomId", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{id}',
        description: 'Get the room',
        parameters: {
            path: {
                id: {
                    description: 'Id of the room',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
            },
        },
        responses: {
            200: { model: 'Room' },
            400: { description: 'Failed to get the room' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "getRoom", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get tenancy by room id',
        parameters: {
            path: {
                id: {
                    description: 'Id of the room',
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
            200: { model: 'Tenancy' },
            400: { description: 'Tenancy not found' },
            422: { description: 'Invalid input data' },
        },
    }),
    inversify_express_utils_1.httpGet('/:id/tenancy', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "getTenancy", null);
RoomController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Room',
        path: '/room',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/room'),
    __param(0, inversify_1.inject('RoomService')),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
exports.default = RoomController;
//# sourceMappingURL=room.controller.js.map