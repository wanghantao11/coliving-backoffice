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
const offer_service_1 = require("./../services/offer.service");
const application_service_1 = require("../services/application.service");
const auth_1 = require("./../middleware/auth");
const constants_1 = require("../../infrastructure/constants");
let OfferController = class OfferController extends inversify_express_utils_1.BaseHttpController {
    constructor(offerService, applicationService) {
        super();
        this.offerService = offerService;
        this.applicationService = applicationService;
    }
    /* ---------------------- Endpoints for community and app ---------------------- */
    acceptOffer(req) {
        return this.offerService.acceptOffer(Number(req.params.id))
            .then(offer => this.json({ offer }, statuscodes.OK));
    }
    rejectOffer(req) {
        return this.offerService.rejectOffer(Number(req.params.id), req.body.rejection_reason)
            .then(() => this.json({}, statuscodes.OK));
    }
    getOffersByExternalId(req, res) {
        return this.offerService.getOffersByExternalId(res.locals.userId)
            .then(offers => this.json({ offers }, statuscodes.OK));
    }
    requestOffer(req, res) {
        return this.applicationService.applyForProject(res.locals.userId, req.body.facade_id)
            .then(() => this.offerService.requestOffer(Object.assign({ iduser: res.locals.userId }, req.body)))
            .then(() => this.json({}, statuscodes.OK));
    }
    requestManualOffer(req, res) {
        return this.applicationService.applyForProject(res.locals.userId, req.body.facade_id)
            .then(() => this.offerService.requestManualOffer(res.locals.userId, req.body.project_name))
            .then(() => this.json({}, statuscodes.OK));
    }
    /* ---------------------- Endpoints for back office ---------------------- */
    getOffersByUserId(req) {
        const { iduser } = req.params;
        return this.offerService.getOffersByExternalId(iduser)
            .then(offers => this.json({ offers }, statuscodes.OK));
    }
    sendOffersToSelectedMembers(req, res) {
        const { room_id, facade_id, facade_name, offer_info_list, move_in_date } = req.body;
        return this.offerService.sendOffersToSelectedMembers(room_id, facade_id, facade_name, offer_info_list, move_in_date, res.locals.userId)
            .then(() => this.json({}, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        path: '/{id}/accept',
        description: 'Member accepts the given offer',
        parameters: {
            path: {
                id: {
                    description: 'Id of offer',
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
    inversify_express_utils_1.httpPut('/:id/accept', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized', 'acceptOfferValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "acceptOffer", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        path: '/{id}/reject',
        description: 'Member rejects the given offer',
        parameters: {
            path: {
                id: {
                    description: 'Id of offer',
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
    inversify_express_utils_1.httpPut('/:id/reject', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized', 'rejectOfferValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "rejectOffer", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get all offers for the member',
        responses: {
            200: {},
            400: { description: 'Failed to get the member offers' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "getOffersByExternalId", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: 'Member requests for a new offer',
        parameters: {
            body: {
                properties: {
                    facade_id: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER, required: true },
                    is_suitable_for_disability: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
                    has_room_type_preference: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
                    has_single_room: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
                    has_double_room: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
                    has_private_bathroom: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
                    has_private_toilet: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN },
                    rent_to: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER },
                    preferred_roommate_iduser: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING },
                },
                required: true,
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to send' },
        },
    }),
    inversify_express_utils_1.httpPost('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized', 'requestOfferValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "requestOffer", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/request-manual',
        description: 'Member requests an offer to be manually sent by admin',
        parameters: {
            body: {
                properties: {
                    facade_id: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER, required: true },
                    project_name: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING },
                },
                required: true,
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to send' },
        },
    }),
    inversify_express_utils_1.httpPost('/request-manual', auth_1.AuthMiddleware.allowAuthTypes([constants_1.COMMUNITY]), 'isAuthenticated', 'isAuthorized', 'requestManualValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "requestManualOffer", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{iduser}',
        description: 'Get member offers by admin',
        parameters: {
            path: {
                iduser: {
                    description: 'Id of member',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get the member offers' },
        },
    }),
    inversify_express_utils_1.httpGet('/:iduser', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.USER_FULL, constants_1.USER_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getOffersForAdminValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "getOffersByUserId", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        path: '/send',
        description: 'Send offers to selected members',
        parameters: {
            body: {
                properties: {
                    facade_id: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER, required: true },
                    room_id: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER, required: true },
                    facade_name: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING },
                    offer_info_list: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.ARRAY, required: true },
                    move_in_date: { type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
                },
                required: true,
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to create' },
        },
    }),
    inversify_express_utils_1.httpPost('/send', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.USER_FULL, constants_1.USER_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'sendOffersToSelectedMembersValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OfferController.prototype, "sendOffersToSelectedMembers", null);
OfferController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Offer',
        path: '/offer',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/offer'),
    __param(0, inversify_1.inject('OfferService')),
    __param(1, inversify_1.inject('ApplicationService')),
    __metadata("design:paramtypes", [offer_service_1.OfferService,
        application_service_1.ApplicationService])
], OfferController);
exports.default = OfferController;
//# sourceMappingURL=offer.controller.js.map