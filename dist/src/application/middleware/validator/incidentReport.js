"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIncidentReportByTenantValidator = exports.DeleteIncidentPhotoValidator = exports.GetIncidentReportsForTenantValidator = exports.GetIncidentReportsForAdminValidator = exports.GetIncidentReportForTenantValidator = exports.GetIncidentReportForAdminValidator = exports.GetIncidentReportValidator = exports.UpdateIncidentReportByAdminValidator = exports.CreateIncidentReportByTenantValidator = exports.CreateIncidentReportValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let CreateIncidentReportValidator = class CreateIncidentReportValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().required(),
            category: joi_1.string().required(),
            description: joi_1.string().required(),
            estimated_done_date: joi_1.date().allow(null),
            is_private: joi_1.boolean().required(),
            location: joi_1.string().allow(null),
            owner_comment: joi_1.string().allow(null),
            owner_id: joi_1.number().required(),
            photos: joi_1.array().items(joi_1.string()).allow(null, []),
            priority: joi_1.string().required(),
            reporter_id: joi_1.number().required(),
            status: joi_1.string().allow('', null),
            subcategory: joi_1.string().required(),
            title: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateIncidentReportValidator = __decorate([
    inversify_1.injectable()
], CreateIncidentReportValidator);
exports.CreateIncidentReportValidator = CreateIncidentReportValidator;
let CreateIncidentReportByTenantValidator = class CreateIncidentReportByTenantValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            category: joi_1.string().required(),
            description: joi_1.string().required(),
            is_private: joi_1.boolean().allow(null),
            location: joi_1.string().allow(null),
            photos: joi_1.array().items(joi_1.string()).allow(null, []),
            subcategory: joi_1.string().required(),
            title: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateIncidentReportByTenantValidator = __decorate([
    inversify_1.injectable()
], CreateIncidentReportByTenantValidator);
exports.CreateIncidentReportByTenantValidator = CreateIncidentReportByTenantValidator;
let UpdateIncidentReportByAdminValidator = class UpdateIncidentReportByAdminValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            category: joi_1.string().optional(),
            closed_at: joi_1.date().optional(),
            decline_reason: joi_1.string().optional().allow(''),
            description: joi_1.string().optional(),
            estimated_done_date: joi_1.date().optional().allow(null),
            is_private: joi_1.boolean().optional(),
            location: joi_1.string().optional(),
            owner_comment: joi_1.string().optional(),
            owner_id: joi_1.number().optional(),
            photos: joi_1.array().items(joi_1.string()).allow(null, []),
            priority: joi_1.string().optional(),
            status: joi_1.string().optional(),
            subcategory: joi_1.string().optional(),
            title: joi_1.string().optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateIncidentReportByAdminValidator = __decorate([
    inversify_1.injectable()
], UpdateIncidentReportByAdminValidator);
exports.UpdateIncidentReportByAdminValidator = UpdateIncidentReportByAdminValidator;
class GetIncidentReportValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            id: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
}
exports.GetIncidentReportValidator = GetIncidentReportValidator;
let GetIncidentReportForAdminValidator = class GetIncidentReportForAdminValidator extends GetIncidentReportValidator {
};
GetIncidentReportForAdminValidator = __decorate([
    inversify_1.injectable()
], GetIncidentReportForAdminValidator);
exports.GetIncidentReportForAdminValidator = GetIncidentReportForAdminValidator;
let GetIncidentReportForTenantValidator = class GetIncidentReportForTenantValidator extends GetIncidentReportValidator {
};
GetIncidentReportForTenantValidator = __decorate([
    inversify_1.injectable()
], GetIncidentReportForTenantValidator);
exports.GetIncidentReportForTenantValidator = GetIncidentReportForTenantValidator;
let GetIncidentReportsForAdminValidator = class GetIncidentReportsForAdminValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            status: joi_1.array().items(joi_1.string()).optional(),
            offset: joi_1.number().default(0),
            limit: joi_1.number().default(10),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetIncidentReportsForAdminValidator = __decorate([
    inversify_1.injectable()
], GetIncidentReportsForAdminValidator);
exports.GetIncidentReportsForAdminValidator = GetIncidentReportsForAdminValidator;
let GetIncidentReportsForTenantValidator = class GetIncidentReportsForTenantValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            status: joi_1.array().items(joi_1.string()).optional(),
            offset: joi_1.number().default(0),
            limit: joi_1.number().default(10),
            closed_at: joi_1.date().optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetIncidentReportsForTenantValidator = __decorate([
    inversify_1.injectable()
], GetIncidentReportsForTenantValidator);
exports.GetIncidentReportsForTenantValidator = GetIncidentReportsForTenantValidator;
let DeleteIncidentPhotoValidator = class DeleteIncidentPhotoValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            img: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
DeleteIncidentPhotoValidator = __decorate([
    inversify_1.injectable()
], DeleteIncidentPhotoValidator);
exports.DeleteIncidentPhotoValidator = DeleteIncidentPhotoValidator;
let UpdateIncidentReportByTenantValidator = class UpdateIncidentReportByTenantValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            feedback: joi_1.string().optional(),
            satisfaction_level: joi_1.string().optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateIncidentReportByTenantValidator = __decorate([
    inversify_1.injectable()
], UpdateIncidentReportByTenantValidator);
exports.UpdateIncidentReportByTenantValidator = UpdateIncidentReportByTenantValidator;
//# sourceMappingURL=incidentReport.js.map