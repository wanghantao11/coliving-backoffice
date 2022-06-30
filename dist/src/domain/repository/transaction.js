"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const httpContext = require("express-http-context");
const entity_1 = require("./../../domain/entity/");
const constants_1 = require("../../infrastructure/constants");
const loggers_1 = require("../../infrastructure/utils/loggers");
let TransactionRepository = class TransactionRepository {
    constructor() {
        this.updateRoomAndOfferStatusAndUserType = (offer, idusers) => typeorm_1.getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager => (transactionalEntityManager.update(entity_1.Room, { id: offer.room_id }, { status: constants_1.ROOM_STATUS.RESERVED }),
            idusers.map(iduser => (transactionalEntityManager.update(entity_1.Offer, { iduser, room_id: offer.room_id }, { status: constants_1.OFFER_STATUS.ACCEPTED }),
                transactionalEntityManager.findOne(entity_1.User, { iduser })
                    .then(user => user.user_type !== constants_1.USER_TYPE.TENANT && transactionalEntityManager.update(entity_1.User, { iduser }, { user_type: constants_1.USER_TYPE.CANDIDATE })))),
            transactionalEntityManager.delete(entity_1.Offer, { room_id: offer.room_id, status: constants_1.OFFER_STATUS.PENDING }),
            transactionalEntityManager.findOne(entity_1.Offer, offer.id)));
        this.createProjectFacadeWithBillingAndTemplates = (projectFacade) => typeorm_1.getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager => transactionalEntityManager.save(projectFacade)
            .then(createdFacade => (entity_1.ProjectFacadeBilling.generateProjectFacadeBilling({ facade_id: createdFacade.id, client_id: createdFacade.client_id })
            .then(projectFacadeBilling => transactionalEntityManager.save(projectFacadeBilling)),
            entity_1.ContractTemplates.generateContractTemplates({ facade_id: createdFacade.id, client_id: createdFacade.client_id })
                .then(roomTemplate => transactionalEntityManager.save(roomTemplate)),
            createdFacade)));
        this.createUserWithPreferencesAndProfiles = (user) => typeorm_1.getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager => transactionalEntityManager.save(user)
            .then(createdUser => entity_1.UserPreferences.generateUserPreferences({ iduser: createdUser.user_key })
            .then(userPreferences => entity_1.UserProfiles.generateUserProfiles({ iduser: createdUser.iduser })
            .then(userProfiles => transactionalEntityManager.save([userPreferences, userProfiles])))
            .then(() => createdUser)));
        this.updateContractsAndRelatedInfoAfterRejection = (contracts) => typeorm_1.getManager(process.env.NODE_ENV).transaction('READ COMMITTED', transactionalEntityManager => Promise.all(contracts.map(({ id, iduser, room_id, facade_id }) => (httpContext.set('iduser', iduser),
            transactionalEntityManager.update(entity_1.Contract, id, { status: constants_1.CONTRACT_STATUS.REJECTED, rejected_at: new Date() }),
            transactionalEntityManager.update(entity_1.User, { iduser }, { user_type: constants_1.USER_TYPE.LIGHT }),
            loggers_1.offerEventLogger.info({ type: 'offer_rejected', data: { offer: { iduser, room_id }, reason: { contract: true } }, facade_id }),
            transactionalEntityManager.delete(entity_1.Offer, { iduser }),
            transactionalEntityManager.findOne(entity_1.User, { iduser })
                .then(user => (transactionalEntityManager.update(entity_1.UserPreferences, { iduser: user.user_key }, { needs_manual_offer: false }),
                !user.is_verified && transactionalEntityManager.delete(entity_1.User, { iduser }))),
            transactionalEntityManager.update(entity_1.Room, { id: room_id }, { status: constants_1.ROOM_STATUS.AVAILABLE })))));
        this.updateContractsAndRelatedInfoAfterSigning = (contracts) => typeorm_1.getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager => Promise.all(contracts.map(({ id, iduser, room_id, user_type }) => (transactionalEntityManager.update(entity_1.Contract, id, { status: constants_1.CONTRACT_STATUS.SIGNED, signed_at: new Date() }),
            transactionalEntityManager.delete(entity_1.Offer, { iduser }),
            // If user is already a tenant, signing a new contract will automatically activate it and terminate the old contract
            user_type === constants_1.USER_TYPE.TENANT && transactionalEntityManager.findOne(entity_1.Contract, { iduser, status: constants_1.CONTRACT_STATUS.ACTIVE })
                .then(contract => (transactionalEntityManager.update(entity_1.Contract, { id: contract.id }, { status: constants_1.CONTRACT_STATUS.TERMINATED, terminated_at: new Date() }),
                transactionalEntityManager.update(entity_1.Room, { id: contract.room_id }, { status: constants_1.ROOM_STATUS.AVAILABLE }))),
            user_type === constants_1.USER_TYPE.TENANT && transactionalEntityManager.update(entity_1.Contract, id, { status: constants_1.CONTRACT_STATUS.ACTIVE, activated_at: new Date() }),
            user_type === constants_1.USER_TYPE.TENANT && transactionalEntityManager.update(entity_1.Room, { id: room_id }, { status: constants_1.ROOM_STATUS.OCCUPIED })))));
        this.updateContractAndRelatedInfoAfterApproveTenant = ({ id, iduser, room_id }) => typeorm_1.getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager => Promise.all([
            transactionalEntityManager.update(entity_1.User, { iduser }, { user_type: constants_1.USER_TYPE.TENANT }),
            transactionalEntityManager.update(entity_1.Contract, id, { status: constants_1.CONTRACT_STATUS.ACTIVE, activated_at: new Date() }),
            transactionalEntityManager.update(entity_1.Room, { id: room_id }, { status: constants_1.ROOM_STATUS.OCCUPIED }),
        ]));
        this.createClientAndRoles = (client) => typeorm_1.getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager => entity_1.Client.generateClient(client).then(client => transactionalEntityManager.createQueryBuilder()
            .insert()
            .into(entity_1.Client)
            .values(Object.assign({}, client))
            .returning('*')
            .execute()
            .then(res => res.raw[0])
            .then(client => Promise.all([
            entity_1.Role.generateRole(Object.assign({ client_id: client.id }, constants_1.SITE_ADMIN)).then(siteAdmin => transactionalEntityManager.save(siteAdmin)),
            entity_1.Role.generateRole(Object.assign({ client_id: client.id }, constants_1.PROJECT_MANAGER)).then(projectManager => transactionalEntityManager.save(projectManager)),
            entity_1.Role.generateRole(Object.assign({ client_id: client.id }, constants_1.COMMUNITY_MANAGER)).then(communityManager => transactionalEntityManager.save(communityManager)),
            entity_1.Role.generateRole(Object.assign({ client_id: client.id }, constants_1.HOST)).then(host => transactionalEntityManager.save(host)),
        ]).then(() => client))));
        this.acceptPreferredRommmateInvitation = ({ inviter_id, invitee_id }) => typeorm_1.getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager => Promise.all([
            transactionalEntityManager.findOne(entity_1.User, { iduser: inviter_id }),
            transactionalEntityManager.findOne(entity_1.User, { iduser: invitee_id }),
        ])
            .then(([{ user_key: inviter_key }, { user_key: invitee_key }]) => Promise.all([
            transactionalEntityManager.update(entity_1.UserPreferredRoommates, { inviter_id, invitee_id }, { status: 'Accepted', invitation_code: null }),
            transactionalEntityManager.update(entity_1.UserPreferences, { iduser: inviter_key }, { has_room_type_preference: true, has_double_room: true, has_single_room: false }),
            transactionalEntityManager.update(entity_1.UserPreferences, { iduser: invitee_key }, { has_room_type_preference: true, has_double_room: true, has_single_room: false }),
            transactionalEntityManager.delete(entity_1.Offer, { iduser: inviter_id, status: constants_1.OFFER_STATUS.PENDING }),
            transactionalEntityManager.delete(entity_1.Offer, { iduser: invitee_id, status: constants_1.OFFER_STATUS.PENDING }),
        ])));
        this.connectPreferredRoommate = ({ inviter_id, invitee_id }, invitee_user_key) => typeorm_1.getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager => transactionalEntityManager.findOne(entity_1.User, { iduser: inviter_id })
            .then(({ user_key: inviter_user_key }) => transactionalEntityManager.findOne(entity_1.UserPreferences, { iduser: inviter_user_key })
            .then(inviterPreference => Promise.all([
            // create roommate
            entity_1.UserPreferredRoommates.generateUserPreferredRoomate({ inviter_id, invitee_id, status: constants_1.PREFERRED_ROOMMATES_STATUS.ACCEPTED })
                .then(preferredRoommate => transactionalEntityManager.save(preferredRoommate)),
            // sync preference
            transactionalEntityManager.update(entity_1.UserPreferences, { iduser: invitee_user_key }, {
                has_room_type_preference: true,
                has_double_room: true,
                has_single_room: false,
                move_in_date_from: inviterPreference.move_in_date_from,
                move_in_date_to: inviterPreference.move_in_date_to,
            }),
            // reject possible pending offer from roommate
            transactionalEntityManager.update(entity_1.Offer, { iduser: invitee_id }, { status: constants_1.OFFER_STATUS.REJECTED }),
        ]))));
    }
};
TransactionRepository = __decorate([
    inversify_1.injectable()
], TransactionRepository);
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.js.map