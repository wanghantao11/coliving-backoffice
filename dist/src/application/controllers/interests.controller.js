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
const interests_service_1 = require("./../services/interests.service");
let InterestsController = class InterestsController extends inversify_express_utils_1.BaseHttpController {
    constructor(interestsService) {
        super();
        this.interestsService = interestsService;
    }
    getInterests() {
        return this.interestsService.getInterests()
            .then(interests => this.json({ interests }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get all interests',
        responses: {
            200: { model: 'Interests' },
            400: { description: 'Failed to get the interests' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY, constants_1.TENANT]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InterestsController.prototype, "getInterests", null);
InterestsController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Interests',
        path: '/interests',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/interests'),
    __param(0, inversify_1.inject('InterestsService')),
    __metadata("design:paramtypes", [interests_service_1.InterestsService])
], InterestsController);
exports.default = InterestsController;
//# sourceMappingURL=interests.controller.js.map