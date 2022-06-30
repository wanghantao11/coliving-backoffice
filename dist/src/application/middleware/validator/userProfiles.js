"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfileValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
let UpdateUserProfileValidator = class UpdateUserProfileValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            interest_ids: joi_1.array().items(joi_1.number()),
            display_name: joi_1.string().optional(),
            hometown: joi_1.string().optional(),
            occupation: joi_1.string().optional(),
            schools: joi_1.array().items(joi_1.string()),
            food_preference: joi_1.string().optional(),
            gluten_intolerent: joi_1.boolean().optional(),
            wheat_intolerent: joi_1.boolean().optional(),
            lactose_intolerent: joi_1.boolean().optional(),
            allergic_to_milk: joi_1.boolean().optional(),
            allergic_to_egg: joi_1.boolean().optional(),
            allergic_to_shellfish: joi_1.boolean().optional(),
            allergic_to_fish: joi_1.boolean().optional(),
            allergic_to_nuts: joi_1.boolean().optional(),
            fun_facts: joi_1.object().optional(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
UpdateUserProfileValidator = __decorate([
    inversify_1.injectable()
], UpdateUserProfileValidator);
exports.UpdateUserProfileValidator = UpdateUserProfileValidator;
//# sourceMappingURL=userProfiles.js.map