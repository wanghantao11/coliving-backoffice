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
const constants_1 = require("../../infrastructure/constants");
const statistics_service_1 = require("../services/statistics.service");
const auth_1 = require("../middleware/auth");
let StatisticsController = class StatisticsController extends inversify_express_utils_1.BaseHttpController {
    constructor(statisticsService) {
        super();
        this.statisticsService = statisticsService;
    }
    getApplicationsStatsByDateRange(req) {
        return this.statisticsService.getApplicationsStatsByDateRange(req.query)
            .then(statistics => this.json(statistics, statuscodes.OK));
    }
    getRegistrationsStatsByDateRange(req) {
        return this.statisticsService.getRegistrationsStatsByDateRange(req.query)
            .then(statistics => this.json(statistics, statuscodes.OK));
    }
    getGeneralStats(req, res) {
        const { clientId } = res.locals;
        return this.statisticsService.getGeneralStats(clientId)
            .then(genenralStats => this.json(genenralStats, statuscodes.OK));
    }
    getMembersStatsByDateRange(req) {
        return this.statisticsService.getMembersStatsByDateRange(req.query)
            .then(statistics => this.json(statistics, statuscodes.OK));
    }
    getOffersStatsByDateRange(req) {
        return this.statisticsService.getOffersStatsByDateRange(req.query)
            .then(offersStats => this.json(offersStats, statuscodes.OK));
    }
    getContractsStatsByDateRange(req) {
        return this.statisticsService.getContractsStatsByDateRange(req.query)
            .then(contractsStats => this.json(contractsStats, statuscodes.OK));
    }
    getSalesProgressStatsByDateRange(req) {
        return this.statisticsService.getSalesProgressStats(req.query);
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/applications',
        description: 'Get the application statistics',
        parameters: {
            query: {
                start_date: {
                    description: 'Start date of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                end_date: {
                    description: 'End date of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get the application statistics' },
        },
    }),
    inversify_express_utils_1.httpGet('/applications', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL]), 'isAuthenticated', 'isAuthorized', 'getApplicationsStatsByDateRangeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getApplicationsStatsByDateRange", null);
__decorate([
    inversify_express_utils_1.httpGet('/registrations', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL]), 'isAuthenticated', 'isAuthorized', 'getRegistrationsStatsByDateRangeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getRegistrationsStatsByDateRange", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/general',
        description: 'Get the general statistics',
        responses: {
            200: {},
            400: { description: 'Failed to get the general statistics' },
        },
    }),
    inversify_express_utils_1.httpGet('/general', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL]), 'isAuthenticated', 'isAuthorized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getGeneralStats", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/members',
        description: 'Get the member statistics',
        parameters: {
            query: {
                start_date: {
                    description: 'Start date of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                end_date: {
                    description: 'End date of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get the member statistics' },
        },
    }),
    inversify_express_utils_1.httpGet('/members', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL]), 'isAuthenticated', 'isAuthorized', 'getStatsByDateRangeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getMembersStatsByDateRange", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/offer-events',
        description: 'Get the offer events statistics',
        parameters: {
            query: {
                start_date: {
                    description: 'Start date of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                end_date: {
                    description: 'End date of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get the offer envents statistics' },
        },
    }),
    inversify_express_utils_1.httpGet('/offer-events', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL]), 'isAuthenticated', 'isAuthorized', 'getStatsByDateRangeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getOffersStatsByDateRange", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/contract-events',
        description: 'Get the contract events statistics',
        parameters: {
            query: {
                start_date: {
                    description: 'Start date of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                end_date: {
                    description: 'End date of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get the contract events statistics' },
        },
    }),
    inversify_express_utils_1.httpGet('/contract-events', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL]), 'isAuthenticated', 'isAuthorized', 'getStatsByDateRangeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getContractsStatsByDateRange", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        path: '/sales-progress',
        description: 'Get the sales progress grouped by date statistics',
        parameters: {
            query: {
                start_date: {
                    description: 'Start date of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                end_date: {
                    description: 'End date of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING,
                },
                facade_id: {
                    description: 'Facade id of the search',
                    type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.NUMBER,
                },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get the sales progress statistics' },
        },
    }),
    inversify_express_utils_1.httpGet('/sales-progress', auth_1.AuthMiddleware.allowAuthTypes([constants_1.BACKOFFICE]), auth_1.AuthMiddleware.needPermisson([constants_1.FULL]), 'isAuthenticated', 'isAuthorized', 'getStatsByDateRangeValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "getSalesProgressStatsByDateRange", null);
StatisticsController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Statistics',
        path: '/statistics',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/statistics'),
    __param(0, inversify_1.inject('StatisticsService')),
    __metadata("design:paramtypes", [statistics_service_1.StatisticsService])
], StatisticsController);
exports.default = StatisticsController;
//# sourceMappingURL=statistics.controller.js.map