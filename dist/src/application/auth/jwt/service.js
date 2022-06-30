"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.signInGuest = exports.signShareRoomInvitation = exports.signWithEmail = exports.signInTenant = exports.signInCommunity = exports.signInBackOffice = void 0;
const authentication_1 = require("./authentication");
const AuthenticationService = new authentication_1.Authentication();
exports.signInBackOffice = (id, clientId, facadeIds, chatToken, authType) => AuthenticationService.sign({ id, clientId, facadeIds, chatToken, authType });
exports.signInCommunity = (id, authType, expiresIn = '6h') => AuthenticationService.sign({ id, authType }, expiresIn);
exports.signInTenant = (id, projectId, apartmentId, chatToken, authType) => AuthenticationService.sign({ id, projectId, apartmentId, chatToken, authType }, '30d');
exports.signWithEmail = email => AuthenticationService.sign({ email });
exports.signShareRoomInvitation = (inviter, invitee_id) => {
    const { first_name, img_url, iduser: inviter_id } = inviter;
    return AuthenticationService.sign({ first_name, img_url, invitee_id, inviter_id }, '6d');
};
exports.signInGuest = authType => AuthenticationService.sign({ authType });
exports.verify = token => AuthenticationService.verify(token);
//# sourceMappingURL=service.js.map