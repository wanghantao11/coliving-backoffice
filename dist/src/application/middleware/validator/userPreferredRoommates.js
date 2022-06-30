"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectPreferredRoommateValidator = exports.DeletePreferredRoommateValidator = exports.ReplyInvitationValidator = exports.SendInvitationValidator = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const joi_1 = require("joi");
const service_1 = require("./../../auth/jwt/service");
let SendInvitationValidator = class SendInvitationValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            email: joi_1.string().email().required(),
            img_url: joi_1.string().required(),
            first_name: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : next());
    }
};
SendInvitationValidator = __decorate([
    inversify_1.injectable()
], SendInvitationValidator);
exports.SendInvitationValidator = SendInvitationValidator;
let ReplyInvitationValidator = class ReplyInvitationValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            inviter_id: joi_1.string().required(),
            invitee_id: joi_1.string().required(),
            status: joi_1.string().valid('Pending', 'Accepted', 'Rejected').required(),
            invitation_code: joi_1.string().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : service_1.verify(req.body.invitation_code)
                .then(() => next())
                .catch(next));
    }
};
ReplyInvitationValidator = __decorate([
    inversify_1.injectable()
], ReplyInvitationValidator);
exports.ReplyInvitationValidator = ReplyInvitationValidator;
let DeletePreferredRoommateValidator = class DeletePreferredRoommateValidator extends inversify_express_utils_1.BaseMiddleware {
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
DeletePreferredRoommateValidator = __decorate([
    inversify_1.injectable()
], DeletePreferredRoommateValidator);
exports.DeletePreferredRoommateValidator = DeletePreferredRoommateValidator;
let ConnectPreferredRoommateValidator = class ConnectPreferredRoommateValidator extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        const data = req.body;
        const schema = joi_1.object().keys({
            email: joi_1.string().email().required(),
            first_name: joi_1.string().required(),
            last_name: joi_1.string().required(),
            client_id: joi_1.number().required(),
        });
        joi_1.validate(data, schema, err => err
            ? Promise.reject({ message: 'NOT_VALIDATED', reason: 'Invalid request data', detail: err.details }).catch(next)
            : service_1.verify(req.body.invitation_code)
                .then(() => next())
                .catch(next));
    }
};
ConnectPreferredRoommateValidator = __decorate([
    inversify_1.injectable()
], ConnectPreferredRoommateValidator);
exports.ConnectPreferredRoommateValidator = ConnectPreferredRoommateValidator;
//# sourceMappingURL=userPreferredRoommates.js.map