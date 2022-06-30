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
const room_service_1 = require("./../services/room.service");
let RoomsController = class RoomsController extends inversify_express_utils_1.BaseHttpController {
    constructor(roomService) {
        super();
        this.roomService = roomService;
    }
    getRooms(req) {
        return this.roomService.getRooms(req.query.ids)
            .then(rooms => this.json({ rooms }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get the rooms',
        parameters: {
            query: {
                ids: {
                    description: 'Id of the rooms',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.ARRAY,
                },
            },
        },
        responses: {
            200: { model: 'Room' },
            400: { description: 'Failed to get the room' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE, constants_1.COMMUNITY]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL, constants_1.ROOM_FULL, constants_1.ROOM_READ]), 'isAuthenticated', 'isAuthorized', 'getRoomsValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "getRooms", null);
RoomsController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Rooms',
        path: '/rooms',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/rooms'),
    __param(0, inversify_1.inject('RoomService')),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomsController);
exports.default = RoomsController;
//# sourceMappingURL=rooms.controller.js.map