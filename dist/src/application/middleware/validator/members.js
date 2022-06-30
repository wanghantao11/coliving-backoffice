"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetContractMembersValidator = exports.GetPendingOfferMembersValidator = exports.GetInterestedMembersValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let GetInterestedMembersValidator = class GetInterestedMembersValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().required(),
            email: joi_1.string().optional(),
            name: joi_1.string().optional(),
            subscribed_from: joi_1.date().optional(),
            subscribed_to: joi_1.date().optional(),
            tag_ids: joi_1.array().optional(),
            limit: joi_1.number().optional(),
            offset: joi_1.number().optional(),
            sort_order: joi_1.string().valid(['ASC', 'DESC']),
            sort_by: joi_1.string().valid(['subscribed_at', 'email', 'birthday', 'first_name', 'move_in_date_from']),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetInterestedMembersValidator = __decorate([
    inversify_1.injectable()
], GetInterestedMembersValidator);
exports.GetInterestedMembersValidator = GetInterestedMembersValidator;
let GetPendingOfferMembersValidator = class GetPendingOfferMembersValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().required(),
            email: joi_1.string().optional(),
            name: joi_1.string().optional(),
            sent_from: joi_1.date().optional(),
            sent_to: joi_1.date().optional(),
            tag_ids: joi_1.array().optional(),
            limit: joi_1.number().optional(),
            offset: joi_1.number().optional(),
            sort_order: joi_1.string().valid(['ASC', 'DESC']),
            sort_by: joi_1.string().valid(['sent_at', 'first_name', 'apartment_name', 'room_name', 'move_in_date_from']),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetPendingOfferMembersValidator = __decorate([
    inversify_1.injectable()
], GetPendingOfferMembersValidator);
exports.GetPendingOfferMembersValidator = GetPendingOfferMembersValidator;
let GetContractMembersValidator = class GetContractMembersValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.query;
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().required(),
            email: joi_1.string().optional(),
            name: joi_1.string().optional(),
            sent_from: joi_1.date().optional(),
            sent_to: joi_1.date().optional(),
            signed_from: joi_1.date().optional(),
            signed_to: joi_1.date().optional(),
            status: joi_1.string().optional(),
            tag_ids: joi_1.array().optional(),
            limit: joi_1.number().optional(),
            offset: joi_1.number().optional(),
            sort_order: joi_1.string().valid(['ASC', 'DESC']),
            sort_by: joi_1.string().valid(['signed_at', 'first_name', 'apartment_name', 'room_name', 'move_in_date_from']),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetContractMembersValidator = __decorate([
    inversify_1.injectable()
], GetContractMembersValidator);
exports.GetContractMembersValidator = GetContractMembersValidator;
//# sourceMappingURL=members.js.map