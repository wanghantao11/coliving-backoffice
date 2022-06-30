"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContractByIdValidator = exports.GetContractPdfValidator = exports.GetContractsByIduserValidator = exports.DeleteContractValidator = exports.CreateContractValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
const constants_1 = require("../../../infrastructure/constants");
let CreateContractValidator = class CreateContractValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            roomId: joi_1.number(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateContractValidator = __decorate([
    inversify_1.injectable()
], CreateContractValidator);
exports.CreateContractValidator = CreateContractValidator;
let DeleteContractValidator = class DeleteContractValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            id: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
DeleteContractValidator = __decorate([
    inversify_1.injectable()
], DeleteContractValidator);
exports.DeleteContractValidator = DeleteContractValidator;
let GetContractsByIduserValidator = class GetContractsByIduserValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            iduser: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetContractsByIduserValidator = __decorate([
    inversify_1.injectable()
], GetContractsByIduserValidator);
exports.GetContractsByIduserValidator = GetContractsByIduserValidator;
let GetContractPdfValidator = class GetContractPdfValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            externalId: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetContractPdfValidator = __decorate([
    inversify_1.injectable()
], GetContractPdfValidator);
exports.GetContractPdfValidator = GetContractPdfValidator;
let UpdateContractByIdValidator = class UpdateContractByIdValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { body: req.body, params: req.params };
        const schema = joi_1.object().keys({
            body: joi_1.object().keys({
                end_date: joi_1.date().optional(),
                start_date: joi_1.date().optional(),
                status: joi_1.string().optional().valid(constants_1.CONTRACT_STATUS.ACTIVE, constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.TERMINATED),
                terminated_at: joi_1.date().optional(),
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
UpdateContractByIdValidator = __decorate([
    inversify_1.injectable()
], UpdateContractByIdValidator);
exports.UpdateContractByIdValidator = UpdateContractByIdValidator;
//# sourceMappingURL=contract.js.map