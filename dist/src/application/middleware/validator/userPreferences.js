"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPreferencesValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let UpdateUserPreferencesValidator = class UpdateUserPreferencesValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            has_single_room: joi_1.boolean().optional(),
            has_double_room: joi_1.boolean().optional(),
            has_private_bathroom: joi_1.boolean().optional(),
            has_private_toilet: joi_1.boolean().optional(),
            has_room_type_preference: joi_1.boolean().optional(),
            is_suitable_for_disability: joi_1.boolean().optional(),
            locations: joi_1.array().items(joi_1.string()).allow(null, []),
            move_in_date_from: joi_1.date().allow(null),
            move_in_date_to: joi_1.date().allow(null),
            period_of_stay: joi_1.string().optional(),
            rent_from: joi_1.number().allow(null),
            rent_to: joi_1.number().allow(null),
            roomies: joi_1.array().items(joi_1.number()).allow(null, []),
            needs_contact_back: joi_1.boolean().optional(),
            needs_manual_offer: joi_1.boolean().optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateUserPreferencesValidator = __decorate([
    inversify_1.injectable()
], UpdateUserPreferencesValidator);
exports.UpdateUserPreferencesValidator = UpdateUserPreferencesValidator;
//# sourceMappingURL=userPreferences.js.map