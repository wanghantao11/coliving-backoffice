"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomValidator = exports.ParameterRoomIdValidator = exports.GetRoomAndTenantsValidator = exports.DeleteRoomsValidator = exports.CreateRoomValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
const constants_1 = require("../../../infrastructure/constants");
let CreateRoomValidator = class CreateRoomValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            facade_id: joi_1.number().required(),
            address_id: joi_1.number().required(),
            apartment_id: joi_1.number().optional(),
            floor_no: joi_1.string().optional(),
            has_private_bathroom: joi_1.boolean().optional(),
            has_private_kitchen: joi_1.boolean().optional(),
            has_private_toilet: joi_1.boolean().optional(),
            is_suitable_for_disability: joi_1.boolean().optional(),
            label_ids: joi_1.array().optional(),
            name: joi_1.string().optional(),
            notes: joi_1.string().optional(),
            number: joi_1.string().required(),
            people_per_room: joi_1.number().required(),
            rent: joi_1.number().required(),
            service_fee: joi_1.number().required(),
            shared_area_size: joi_1.number().required(),
            size: joi_1.number().required(),
            status: joi_1.string().valid(constants_1.ROOM_STATUS.AVAILABLE, constants_1.ROOM_STATUS.OCCUPIED, constants_1.ROOM_STATUS.OUT_OF_SERVICE, constants_1.ROOM_STATUS.RESERVED),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
CreateRoomValidator = __decorate([
    inversify_1.injectable()
], CreateRoomValidator);
exports.CreateRoomValidator = CreateRoomValidator;
let DeleteRoomsValidator = class DeleteRoomsValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            ids: joi_1.array().min(1),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
DeleteRoomsValidator = __decorate([
    inversify_1.injectable()
], DeleteRoomsValidator);
exports.DeleteRoomsValidator = DeleteRoomsValidator;
let GetRoomAndTenantsValidator = class GetRoomAndTenantsValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { query: req.query, params: req.params };
        const schema = joi_1.object().keys({
            query: joi_1.object().keys({
                status: joi_1.string().valid('Available', 'Reserved', 'Occupied', 'Out of service').optional(),
                label_ids: joi_1.array().optional(),
                people_per_room: joi_1.number().optional(),
                room_number: joi_1.number().optional(),
                prefix: joi_1.string().optional(),
                name: joi_1.string().optional(),
                limit: joi_1.number().optional(),
                offset: joi_1.number().optional(),
            }),
            params: joi_1.object().keys({
                facadeId: joi_1.number().required(),
            }),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
GetRoomAndTenantsValidator = __decorate([
    inversify_1.injectable()
], GetRoomAndTenantsValidator);
exports.GetRoomAndTenantsValidator = GetRoomAndTenantsValidator;
let ParameterRoomIdValidator = class ParameterRoomIdValidator extends inversify_express_utils_1.BaseMiddleware {
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
ParameterRoomIdValidator = __decorate([
    inversify_1.injectable()
], ParameterRoomIdValidator);
exports.ParameterRoomIdValidator = ParameterRoomIdValidator;
let UpdateRoomValidator = class UpdateRoomValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = { body: req.body, params: req.params };
        const schema = joi_1.object().keys({
            body: joi_1.object().keys({
                name: joi_1.string().optional().allow(null, ''),
                rent: joi_1.number().optional(),
                size: joi_1.number().optional(),
                service_fee: joi_1.number().optional(),
                shared_area_size: joi_1.number().optional(),
                people_per_room: joi_1.number().optional(),
                move_in_date: joi_1.date().optional().allow(null, ''),
                number: joi_1.string().optional(),
                floor_no: joi_1.string().optional().allow(null, ''),
                address_id: joi_1.number().optional(),
                apartment_id: joi_1.number().optional().allow(null, ''),
                has_private_bathroom: joi_1.boolean().optional(),
                has_private_kitchen: joi_1.boolean().optional(),
                has_private_toilet: joi_1.boolean().optional(),
                is_suitable_for_disability: joi_1.boolean().optional(),
                label_ids: joi_1.array().optional(),
                notes: joi_1.string().optional().allow(null, ''),
                status: joi_1.string().optional().valid(constants_1.ROOM_STATUS.AVAILABLE, constants_1.ROOM_STATUS.OCCUPIED, constants_1.ROOM_STATUS.OUT_OF_SERVICE, constants_1.ROOM_STATUS.RESERVED),
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
UpdateRoomValidator = __decorate([
    inversify_1.injectable()
], UpdateRoomValidator);
exports.UpdateRoomValidator = UpdateRoomValidator;
//# sourceMappingURL=room.js.map