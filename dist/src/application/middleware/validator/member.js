"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMemberNotesValidator = exports.CreateMemberNotesValidator = exports.GetMemberWishedRoomiesValidator = exports.GetMemberSubscriptionsValidator = exports.GetMemberProfileValidator = exports.GetMemberPreferencesValidator = exports.GetMemberNotesValidator = exports.GetMemberValidator = exports.GetSubscribedMembersValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let GetSubscribedMembersValidator = class GetSubscribedMembersValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { query: req.query, params: req.params };
        const schema = joi_1.object().keys({
            query: joi_1.object().keys({
                email: joi_1.string().optional(),
                name: joi_1.string().optional(),
                has_double_room: joi_1.boolean().required(),
                has_single_room: joi_1.boolean().required(),
                has_private_bathroom: joi_1.boolean().required(),
                has_shared_bathroom: joi_1.boolean().required(),
                has_private_toilet: joi_1.boolean().required(),
                has_shared_toilet: joi_1.boolean().required(),
                include_unspecified_age: joi_1.boolean().required(),
                include_unspecified_move_in_date: joi_1.boolean().required(),
                exclude_users_with_offers: joi_1.boolean().required(),
                exclude_current_tenants: joi_1.boolean().required(),
                is_only_matching_rent: joi_1.boolean().required(),
                is_only_suitable_for_disability: joi_1.boolean().required(),
                is_only_today: joi_1.boolean().required(),
                is_only_test_complete: joi_1.boolean().required(),
                tag_ids: joi_1.array().optional(),
                rent: joi_1.number().required(),
                age_from: joi_1.number().optional(),
                age_to: joi_1.number().optional(),
                subscribe_from: joi_1.date().optional(),
                subscribe_to: joi_1.date().optional(),
                matching_score: joi_1.number().optional(),
                move_in_date_from: joi_1.date().optional(),
                limit: joi_1.number().optional(),
                offset: joi_1.number().optional(),
                sort_order: joi_1.string().valid(['ASC', 'DESC']),
                sort_by: joi_1.string().valid(['subscribed_at', 'age', 'email', 'note', 'move_in_date_to', 'score']),
            }),
            params: joi_1.object().keys({
                facadeId: joi_1.number().required(),
                apartmentId: joi_1.number().required(),
            }),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetSubscribedMembersValidator = __decorate([
    inversify_1.injectable()
], GetSubscribedMembersValidator);
exports.GetSubscribedMembersValidator = GetSubscribedMembersValidator;
let GetMemberValidator = class GetMemberValidator extends inversify_express_utils_1.BaseMiddleware {
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
GetMemberValidator = __decorate([
    inversify_1.injectable()
], GetMemberValidator);
exports.GetMemberValidator = GetMemberValidator;
let GetMemberNotesValidator = class GetMemberNotesValidator extends GetMemberValidator {
};
GetMemberNotesValidator = __decorate([
    inversify_1.injectable()
], GetMemberNotesValidator);
exports.GetMemberNotesValidator = GetMemberNotesValidator;
let GetMemberPreferencesValidator = class GetMemberPreferencesValidator extends GetMemberValidator {
};
GetMemberPreferencesValidator = __decorate([
    inversify_1.injectable()
], GetMemberPreferencesValidator);
exports.GetMemberPreferencesValidator = GetMemberPreferencesValidator;
let GetMemberProfileValidator = class GetMemberProfileValidator extends GetMemberValidator {
};
GetMemberProfileValidator = __decorate([
    inversify_1.injectable()
], GetMemberProfileValidator);
exports.GetMemberProfileValidator = GetMemberProfileValidator;
let GetMemberSubscriptionsValidator = class GetMemberSubscriptionsValidator extends GetMemberValidator {
};
GetMemberSubscriptionsValidator = __decorate([
    inversify_1.injectable()
], GetMemberSubscriptionsValidator);
exports.GetMemberSubscriptionsValidator = GetMemberSubscriptionsValidator;
let GetMemberWishedRoomiesValidator = class GetMemberWishedRoomiesValidator extends GetMemberValidator {
};
GetMemberWishedRoomiesValidator = __decorate([
    inversify_1.injectable()
], GetMemberWishedRoomiesValidator);
exports.GetMemberWishedRoomiesValidator = GetMemberWishedRoomiesValidator;
let CreateMemberNotesValidator = class CreateMemberNotesValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            iduser: joi_1.string().required(),
            description: joi_1.string().required(),
            tag_ids: joi_1.array().items(joi_1.number()).optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateMemberNotesValidator = __decorate([
    inversify_1.injectable()
], CreateMemberNotesValidator);
exports.CreateMemberNotesValidator = CreateMemberNotesValidator;
let UpdateMemberNotesValidator = class UpdateMemberNotesValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { body: req.body, params: req.params };
        const schema = joi_1.object().keys({
            body: joi_1.object().keys({
                description: joi_1.string().required(),
                tag_ids: joi_1.array().items(joi_1.number()).optional(),
            }),
            params: joi_1.object().keys({
                iduser: joi_1.string().required(),
            }),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateMemberNotesValidator = __decorate([
    inversify_1.injectable()
], UpdateMemberNotesValidator);
exports.UpdateMemberNotesValidator = UpdateMemberNotesValidator;
//# sourceMappingURL=member.js.map