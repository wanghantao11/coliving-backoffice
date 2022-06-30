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
exports.SendOffersToSelectedMembersValidator = exports.GetOffersForAdminValidator = exports.RequestManualValidator = exports.RequestOfferValidator = exports.RejectOfferValidator = exports.AcceptOfferValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
const contract_1 = require("../../../infrastructure/utils/contract");
let AcceptOfferValidator = class AcceptOfferValidator extends inversify_express_utils_1.BaseMiddleware {
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
AcceptOfferValidator = __decorate([
    inversify_1.injectable()
], AcceptOfferValidator);
exports.AcceptOfferValidator = AcceptOfferValidator;
let RejectOfferValidator = class RejectOfferValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { body: req.body, params: req.params };
        const schema = joi_1.object().keys({
            body: joi_1.object().keys({
                rejection_reason: joi_1.object().keys({
                    move_in_date: joi_1.boolean().optional(),
                    exit_search: joi_1.boolean().optional(),
                    price: joi_1.boolean().optional(),
                    room_type: joi_1.boolean().optional(),
                    other: joi_1.boolean().optional(),
                }),
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
RejectOfferValidator = __decorate([
    inversify_1.injectable()
], RejectOfferValidator);
exports.RejectOfferValidator = RejectOfferValidator;
let RequestOfferValidator = class RequestOfferValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().required(),
            is_suitable_for_disability: joi_1.boolean().required(),
            has_room_type_preference: joi_1.boolean().required(),
            has_single_room: joi_1.boolean().required(),
            has_double_room: joi_1.boolean().required(),
            has_private_bathroom: joi_1.boolean().required(),
            has_private_toilet: joi_1.boolean().required(),
            rent_to: joi_1.number().optional(),
            preferred_roommate_iduser: joi_1.string().optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
RequestOfferValidator = __decorate([
    inversify_1.injectable()
], RequestOfferValidator);
exports.RequestOfferValidator = RequestOfferValidator;
let RequestManualValidator = class RequestManualValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().required(),
            project_name: joi_1.string().allow('', null),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
RequestManualValidator = __decorate([
    inversify_1.injectable()
], RequestManualValidator);
exports.RequestManualValidator = RequestManualValidator;
let GetOffersForAdminValidator = class GetOffersForAdminValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.params;
        const schema = joi_1.object().keys({
            iduser: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetOffersForAdminValidator = __decorate([
    inversify_1.injectable()
], GetOffersForAdminValidator);
exports.GetOffersForAdminValidator = GetOffersForAdminValidator;
let SendOffersToSelectedMembersValidator = class SendOffersToSelectedMembersValidator extends inversify_express_utils_1.BaseMiddleware {
    constructor(projectFacadeDao) {
        super();
        this.projectFacadeDao = projectFacadeDao;
    }
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            room_id: joi_1.number().required(),
            facade_id: joi_1.number().required(),
            facade_name: joi_1.string().required(),
            offer_info_list: joi_1.array().items(joi_1.object().keys({ iduser: joi_1.string(), is_preferences_matched: joi_1.boolean(), matching_score: joi_1.number().allow(null) })).required(),
            move_in_date: joi_1.date().optional(),
        });
        return this.projectFacadeDao.getProjectDataForContract(req.body.room_id)
            .then(contractData => !contractData ? Promise.reject({ message: 'NOT_ALLOWED', reason: `No contract data is found for room ${req.body.room_id}` }) : contractData)
            .then(contract_1.checkIsContractDataReady)
            .then(isContractDataReady => !isContractDataReady ? Promise.reject({ message: 'NOT_ALLOWED', reason: `Contract data is not ready for room ${req.body.room_id}` }) : null)
            .then(() => joi_1.validate(data, schema, err => err ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next()));
    }
};
SendOffersToSelectedMembersValidator = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ProjectFacadeDao')),
    __metadata("design:paramtypes", [Object])
], SendOffersToSelectedMembersValidator);
exports.SendOffersToSelectedMembersValidator = SendOffersToSelectedMembersValidator;
//# sourceMappingURL=offer.js.map