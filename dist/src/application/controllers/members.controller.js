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
const members_service_1 = require("./../services/members.service");
let MembersController = class MembersController extends inversify_express_utils_1.BaseHttpController {
    constructor(membersService) {
        super();
        this.membersService = membersService;
    }
    getInterestedMembers(req) {
        return this.membersService.getInterestedMembers(req.query)
            .then(([total, members]) => this.json({ total, members }, statuscodes.OK));
    }
    getPendingOfferMembers(req) {
        return this.membersService.getPendingOfferMembers(req.query)
            .then(([total, members]) => this.json({ total, members }, statuscodes.OK));
    }
    getContractMembers(req) {
        return this.membersService.getContractMembers(req.query)
            .then(([total, members]) => this.json({ total, members }, statuscodes.OK));
    }
    /**
     * GET /members/:facadeId/:apartmentId/subscribed
     *
     * @name getSubscribedMembers
     * @param req
     * ```
     * req.params.facadeId,
     * req.params.apartmentId,
     * req.query.email,
     * req.query.name,
     * req.query.has_double_room,
     * req.query.has_single_room,
     * req.query.has_shared_bathroom,
     * req.query.has_private_bathroom,
     * req.query.has_shared_toilet,
     * req.query.has_private_toilet,
     * req.query.tag_ids,
     * req.query.age_from,
     * req.query.age_to,
     * req.query.include_unspecified_age
     * req.query.subscribe_from,
     * req.query.subscribe_to,
     * req.query.move_in_date_from,
     * req.query.include_unspecified_move_in_date,
     * req.query.exclude_users_with_offers,
     * req.query.exclude_current_tenants,
     * req.query.is_only_today,
     * req.query.is_only_test_complete,
     * req.query.is_only_matching_rent,
     * req.query.is_only_suitable_for_disability,
     * req.query.offset (default 0),
     * req.query.limit (default 10),
     * req.query.sort_order (DESC or ASC)
     * req.query.sort_by (subscribed_at, birthday, email, note, move_in_date_to, score)
     * ```
     * @return members
     */
    getSubscribedMembers(req) {
        const { facadeId, apartmentId } = req.params;
        return this.membersService.getSubscribedMembers(Number(facadeId), Number(apartmentId), req.query)
            .then(([total, members]) => this.json({ total, members }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/interested',
        description: 'Get all subscribed members based on the query filters',
        parameters: {
            query: {
                facade_id: {
                    description: 'Project facade id members belong to',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                email: {
                    description: 'Member email address',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                name: {
                    description: 'Member name',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                subscribed_from: {
                    description: 'Member earliest subscription date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                subscribed_to: {
                    description: 'Member latest subscription date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                tag_ids: {
                    description: 'Member tag ids',
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
            200: { model: 'User' },
            400: { description: 'Failed to get the members' },
        },
    }),
    inversify_express_utils_1.httpGet('/interested', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getInterestedMembersValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "getInterestedMembers", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/pending-offer',
        description: 'Get all subscribed members based on the query filters',
        parameters: {
            query: {
                facade_id: {
                    description: 'Project facade id members belong to',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                email: {
                    description: 'Member email address',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                name: {
                    description: 'Member name',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                sent_from: {
                    description: 'Member with the offer that has the earliest sent date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                sent_to: {
                    description: 'Member with the offer that has the latest sent date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                tag_ids: {
                    description: 'Member tag ids',
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
            200: { model: 'User' },
            400: { description: 'Failed to get the members' },
        },
    }),
    inversify_express_utils_1.httpGet('/pending-offer', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getPendingOfferMembersValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "getPendingOfferMembers", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/contract',
        description: 'Get all subscribed members based on the query filters',
        parameters: {
            query: {
                facade_id: {
                    description: 'Project facade id members belong to',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                email: {
                    description: 'Member email address',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                name: {
                    description: 'Member name',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                sent_from: {
                    description: 'Member with the contract that has the earliest sent date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                sent_to: {
                    description: 'Member with the contract that has the latest sent date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                signed_from: {
                    description: 'Member with the contract that has the earliest signed date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                signed_to: {
                    description: 'Member with the contract that has the latest signed date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                status: {
                    description: 'status of the contract',
                },
                tag_ids: {
                    description: 'Member tag ids',
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
            200: { model: 'User' },
            400: { description: 'Failed to get the members' },
        },
    }),
    inversify_express_utils_1.httpGet('/contract', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getContractMembersValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "getContractMembers", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/{facadeId}/{apartmentId}/subscribed',
        description: 'Get all subscribed members by the given apartment',
        parameters: {
            path: {
                facadeId: {
                    description: 'Id of project facade',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                apartmentId: {
                    description: 'Id of apartment',
                    required: true,
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
            query: {
                email: {
                    description: 'Member email address',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                name: {
                    description: 'Member name',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                has_double_room: {
                    description: 'If the member prefers a double room',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
                },
                has_single_room: {
                    description: 'If the member prefers a single room',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
                },
                has_shared_bathroom: {
                    description: 'If the member prefers a shared bathroom',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
                },
                has_private_bathroom: {
                    description: 'If the member prefers a private bathroom',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
                },
                has_shared_toilet: {
                    description: 'If the member prefers a shared toilet',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
                },
                has_private_toilet: {
                    description: 'If the member prefers a private toilet',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
                },
                age_from: {
                    description: 'Member lowest age',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                age_to: {
                    description: 'Member highest age',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                matching_score: {
                    description: 'Member lowest matching score',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER,
                },
                subscribed_from: {
                    description: 'Member earliest subscription date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                subscribed_to: {
                    description: 'Member latest subscription date',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                is_only_test_complete: {
                    description: 'If member completes the roomie test',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
                },
                tag_ids: {
                    description: 'Member tag ids',
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
            200: { model: 'User' },
            400: { description: 'Failed to get the members' },
        },
    }),
    inversify_express_utils_1.httpGet('/:facadeId/:apartmentId/subscribed', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([
        constants_1.FULL, constants_1.APPLICATION_FULL, constants_1.APPLICATION_READ, constants_1.CONTRACT_FULL, constants_1.CONTRACT_READ
    ]), 'isAuthenticated', 'isAuthorized', 'getSubscribedMembersValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "getSubscribedMembers", null);
MembersController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Members',
        path: '/members',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/members'),
    __param(0, inversify_1.inject('MembersService')),
    __metadata("design:paramtypes", [members_service_1.MembersService])
], MembersController);
exports.default = MembersController;
//# sourceMappingURL=members.controller.js.map