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
exports.ContractService = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const lodash_1 = require("lodash");
const entity_1 = require("../../domain/entity");
const constants_1 = require("../../infrastructure/constants");
const common_1 = require("../../infrastructure/utils/common");
const contract_1 = require("../../infrastructure/utils/contract");
const email_1 = require("../../infrastructure/utils/email");
const mailchimp_1 = require("../../infrastructure/utils/mailchimp");
const loggers_1 = require("../../infrastructure/utils/loggers");
let ContractService = class ContractService {
    constructor(contractDao, offerDao, roomDao, transactionDao, userDao, userPreferredRoommatesDao) {
        this.contractDao = contractDao;
        this.offerDao = offerDao;
        this.roomDao = roomDao;
        this.transactionDao = transactionDao;
        this.userDao = userDao;
        this.userPreferredRoommatesDao = userPreferredRoommatesDao;
        this.createContract = (roomId, iduser) => {
            let start_date;
            return this.contractDao.getContractBy({ iduser, status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED] })
                .then(contract => contract
                ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${iduser} has pending contract or signed contract is waiting to be approved` })
                : this.userPreferredRoommatesDao.getPairedPreferredRoommate(iduser)
                    .then(roommate => !roommate ? [iduser] : [roommate.inviter_id, roommate.invitee_id])
                    .then(idusers => this.offerDao.getContractDataByRoomIdAndExternalIds(roomId, idusers)
                    .then(contractData => contractData.length === 0 ?
                    Promise.reject({ message: 'NOT_ALLOWED', reason: `Contract data not found for user ${iduser}` }) : contractData)
                    .then(contractData => {
                    if (contractData[0].is_auto_offer_flow) {
                        contractData[0].move_in_date = contractData[0].user_move_in_date;
                    }
                    else {
                        contractData[0].move_in_date = contractData[0].room_move_in_date;
                    }
                    start_date = contractData[0].move_in_date;
                    return contractData;
                })
                    .then(contractData => contract_1.getTemplatesByCollectionId(contractData[0].collection_id)
                    .then(contract_1.parseContractTemplates)
                    .then(templates => contract_1.formatContract(contractData, templates)
                    .then(contract_1.generateContract)
                    .then(({ data: { id } }) => contract_1.publishContract(id))
                    .then(({ data: { parties } }) => contract_1.mapParticipantWithCandidate(contractData.map(({ iduser, first_name, room_id, email, facade_id }) => ({ iduser, first_name, room_id, email, facade_id })), parties))
                    .then(participants => Promise.all(participants.map(participant => contract_1.generateAccessToken(participant.external_id, participant.external_participant_id)
                    .then(({ data: { token: external_token } }) => entity_1.Contract.generateContract(Object.assign(Object.assign({}, participant), { start_date }))
                    .then(this.contractDao.createContract)
                    .then(contract => (email_1.emailAxiosPost('/mail/contract-generated-notification', {
                    email: participant.email,
                    external_id: contract.external_id,
                    external_token,
                    first_name: participant.first_name,
                }),
                    mailchimp_1.updateUserTags(process.env.MAILCHIMP_LIST_ID)(mailchimp_1.formatUser({
                        email: participant.email,
                        contract: { facade_id: contract.facade_id, status: contract.status },
                    })),
                    loggers_1.contractEventLogger.info({
                        type: 'contract_generated',
                        data: { contract },
                        facade_id: contract.facade_id,
                        iduser: contract.iduser,
                    }),
                    (Object.assign(Object.assign({}, contract), { external_token })))))))
                    .then(contracts => (this.userPreferredRoommatesDao.deleteUserPreferredRoommateBy({ iduser }), contracts)))))));
        };
        this.deleteContract = (id) => this.contractDao.deleteContract(id);
        this.updateContract = (data) => contract_1.parseOneflowResponse(data)
            .then(({ externalId, status, participantId }) => {
            // Participant level process
            if (participantId) {
                if (status === constants_1.CONTRACT_STATUS.REJECTED) {
                    return this.contractDao.getContractsBy({ externalId, status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED] })
                        .then(contracts => this.transactionDao.updateContractsAndRelatedInfoAfterRejection(contracts)
                        .then(() => contracts.map(({ user_email, facade_id }) => mailchimp_1.updateUserTags(process.env.MAILCHIMP_LIST_ID)(mailchimp_1.formatUser({ email: user_email, contract: { facade_id, status } }))))
                        .then(() => loggers_1.contractEventLogger.info({
                        type: 'contract_rejected', data: { contracts }, facade_id: lodash_1.get(contracts[0], 'facade_id'),
                    })));
                }
                else {
                    return this.contractDao.updateContractBy({ participantId }, { status });
                }
                // Contract level process
            }
            else {
                return this.contractDao.getContractsBy({ externalId, status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED, constants_1.CONTRACT_STATUS.ACTIVE] })
                    .then(contracts => {
                    if (status === constants_1.CONTRACT_STATUS.REJECTED) {
                        return this.transactionDao.updateContractsAndRelatedInfoAfterRejection(contracts)
                            .then(() => contracts.map(({ user_email, facade_id }) => mailchimp_1.updateUserTags(process.env.MAILCHIMP_LIST_ID)(mailchimp_1.formatUser({ email: user_email, contract: { facade_id, status } }))))
                            .then(() => loggers_1.contractEventLogger.info({
                            type: 'contract_rejected', data: { contracts, reason: 'overdue' }, facade_id: lodash_1.get(contracts[0], 'facade_id'),
                        }));
                    }
                    else if (status === constants_1.CONTRACT_STATUS.SIGNED) {
                        return this.transactionDao.updateContractsAndRelatedInfoAfterSigning(contracts)
                            .then(() => contracts.map(({ user_email, facade_id }) => mailchimp_1.updateUserTags(process.env.MAILCHIMP_LIST_ID)(mailchimp_1.formatUser({ email: user_email, contract: { facade_id, status } }))))
                            .then(() => loggers_1.contractEventLogger.info({ type: 'contract_signed', data: { contracts }, facade_id: lodash_1.get(contracts[0], 'facade_id') }));
                    }
                    else {
                        return Promise.all(contracts.map(({ id }) => this.contractDao.updateContractBy({ id }, { status })));
                    }
                });
            }
        });
        this.updateContractById = (id, data) => this.contractDao.updateContractBy({ id: Number(id) }, data)
            .then(contract => data.status === constants_1.CONTRACT_STATUS.TERMINATED ?
            // Release the room when its contract is terminated
            this.roomDao.updateRoomBy({ id: contract.room_id }, { status: constants_1.ROOM_STATUS.AVAILABLE })
                .then(() => this.userDao.getUserBy({ iduser: contract.iduser }).then(({ first_name, email }) => {
                email_1.emailAxiosPost('/mail/contract-terminated-notification', { email, end_date: common_1.convertDateToISOString(contract.end_date).slice(0, 10), first_name });
                return contract;
            }))
            : contract);
        this.getContractsByRoomId = (id) => this.contractDao.getContractsBy({ roomIds: [id], status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED, constants_1.CONTRACT_STATUS.ACTIVE] });
        this.getContractsByIduser = (iduser) => this.contractDao.getContractBy({ iduser, status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED, constants_1.CONTRACT_STATUS.ACTIVE] })
            .then(contract => !contract ? Promise.reject({ message: 'NO_CONTENT', reason: `No contract is found for user ${iduser}` }) : contract)
            .then(contract => this.contractDao.getContractsBy({
            externalId: contract.external_id, status: [constants_1.CONTRACT_STATUS.PENDING, constants_1.CONTRACT_STATUS.SIGNED, constants_1.CONTRACT_STATUS.ACTIVE],
        }))
            .then(contracts => Promise.all(contracts.map(contract => contract_1.generateAccessToken(contract.external_id, contract.external_participant_id)
            .then(({ data: { token: external_token } }) => (Object.assign(Object.assign({}, contract), { external_token }))))));
        this.getContractPdf = (externalId) => contract_1.getContractPdf(externalId).then(common_1.getDataFromResponse);
    }
};
ContractService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('ContractDao')),
    __param(1, inversify_1.inject('OfferDao')),
    __param(2, inversify_1.inject('RoomDao')),
    __param(3, inversify_1.inject('TransactionDao')),
    __param(4, inversify_1.inject('UserDao')),
    __param(5, inversify_1.inject('UserPreferredRoommatesDao')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ContractService);
exports.ContractService = ContractService;
//# sourceMappingURL=contract.service.js.map