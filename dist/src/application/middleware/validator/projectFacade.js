"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterFacadeIdValidator = exports.GetProjectFacadesValidator = exports.UpdateProjectFacadeValidator = exports.CreateProjectFacadeValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let CreateProjectFacadeValidator = class CreateProjectFacadeValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            name: joi_1.string().not().empty().required(),
            address: joi_1.string().allow('', null),
            post_area: joi_1.string().not().empty().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateProjectFacadeValidator = __decorate([
    inversify_1.injectable()
], CreateProjectFacadeValidator);
exports.CreateProjectFacadeValidator = CreateProjectFacadeValidator;
let UpdateProjectFacadeValidator = class UpdateProjectFacadeValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { params: req.params, body: req.body };
        const schema = joi_1.object().keys({
            body: joi_1.object().keys({
                client_id: joi_1.number().optional(),
                name: joi_1.string(),
                address: joi_1.string().allow('', null),
                cover_image_source: joi_1.string().uri().allow('', null),
                cover_image_text: joi_1.string().allow('', null),
                post_area: joi_1.string(),
                published: joi_1.boolean().optional().allow(null),
                published_at: joi_1.date().optional().allow(null),
                landlord_name: joi_1.string().optional(),
                landlord_email: joi_1.string().optional(),
                landlord_org_no: joi_1.string().optional(),
                landlord_street: joi_1.string().optional(),
                landlord_zip: joi_1.string().optional(),
                landlord_post_area: joi_1.string().optional(),
                property_unit_designation: joi_1.string().optional(),
                coliving_hub: joi_1.string().optional(),
                is_auto_offer_flow: joi_1.boolean().optional(),
            }),
            params: joi_1.object().keys({
                id: joi_1.number().required(),
            }),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateProjectFacadeValidator = __decorate([
    inversify_1.injectable()
], UpdateProjectFacadeValidator);
exports.UpdateProjectFacadeValidator = UpdateProjectFacadeValidator;
let GetProjectFacadesValidator = class GetProjectFacadesValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            limit: joi_1.number().optional().default(10),
            offset: joi_1.number().optional().default(0),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetProjectFacadesValidator = __decorate([
    inversify_1.injectable()
], GetProjectFacadesValidator);
exports.GetProjectFacadesValidator = GetProjectFacadesValidator;
let ParameterFacadeIdValidator = class ParameterFacadeIdValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            id: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
ParameterFacadeIdValidator = __decorate([
    inversify_1.injectable()
], ParameterFacadeIdValidator);
exports.ParameterFacadeIdValidator = ParameterFacadeIdValidator;
//# sourceMappingURL=projectFacade.js.map