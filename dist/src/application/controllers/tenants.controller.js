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
const tenant_service_1 = require("./../services/tenant.service");
let TenantsController = class TenantsController extends inversify_express_utils_1.BaseHttpController {
    constructor(tenantService) {
        super();
        this.tenantService = tenantService;
    }
    /**
     * GET /tenants
     *
     * @name getTenants
     * @param req
     * ```
     * req.query.food_preferences: string[]
     * req.query.interest_ids: number[]
     * req.query.age_from: number
     * req.query.age_to: number
     * req.query.prefix: string
     * req.query.offset: number(by default 0)
     * req.query.limit: number(by default 20)
     * ```
     * @example
     * ```
     * /tenants
     *   ?interest_ids[0]=1
     *   &interest_ids[1]=2
     * ```
     * @return tenants object
     */
    getTenants(req, res) {
        return this.tenantService.getTenants(res.locals.userId, res.locals.projectId, req.query)
            .then(tenants => this.json({ tenants }, statuscodes.OK));
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: 'Get the tenants based on query filters',
        parameters: {
            query: {
                food_preferences: { description: 'Food preferences of the tenant', type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.ARRAY },
                interest_ids: { description: 'Interest ids of the tenant', type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.ARRAY },
                age_from: { description: 'Lowest age of the tenant', type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER },
                age_to: { description: 'Highest age of the tenant', type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER },
                prefix: { description: 'Name prefix of the tenant', type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.STRING },
                offset: { description: 'Offset value of the search result', type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER },
                limit: { description: 'Limit value of the search result', type: swagger_express_ts_1.SwaggerDefinitionConstant.Parameter.Type.INTEGER },
            },
        },
        responses: {
            200: {},
            400: { description: 'Failed to get applications count' },
        },
    }),
    inversify_express_utils_1.httpGet('/', auth_1.AuthMiddleware.allowAuthTypes([constants_1.TENANT]), 'isAuthenticated', 'isAuthorized', 'getTenantsValidator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "getTenants", null);
TenantsController = __decorate([
    swagger_express_ts_1.ApiPath({
        name: 'Tenants',
        path: '/tenants',
        security: { basicAuth: [] },
    }),
    inversify_express_utils_1.controller('/tenants'),
    __param(0, inversify_1.inject('TenantService')),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantsController);
exports.default = TenantsController;
//# sourceMappingURL=tenants.controller.js.map