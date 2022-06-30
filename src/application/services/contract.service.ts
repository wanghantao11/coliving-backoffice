import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { get } from 'lodash'

import { ContractDao, OfferDao, RoomDao, TransactionDao,
  UserDao, UserPreferredRoommatesDao } from '../../domain/dao'
import { Contract } from '../../domain/entity'
import { IOneflowResponse } from '../../interfaces/contract'
import { CONTRACT_STATUS, ROOM_STATUS } from '../../infrastructure/constants'
import { convertDateToISOString, getDataFromResponse } from '../../infrastructure/utils/common'
import {
  formatContract,
  generateContract,
  publishContract,
  mapParticipantWithCandidate,
  generateAccessToken,
  parseOneflowResponse,
  getTemplatesByCollectionId,
  parseContractTemplates,
  getContractPdf
} from '../../infrastructure/utils/contract'
import { emailAxiosPost } from '../../infrastructure/utils/email'
import { updateUserTags, formatUser } from '../../infrastructure/utils/mailchimp'
import { contractEventLogger } from '../../infrastructure/utils/loggers'

@injectable()
export class ContractService {
  constructor(
    @inject('ContractDao') private contractDao: ContractDao,
    @inject('OfferDao') private offerDao: OfferDao,
    @inject('RoomDao') private roomDao: RoomDao,
    @inject('TransactionDao') private transactionDao: TransactionDao,
    @inject('UserDao') private userDao: UserDao,
    @inject('UserPreferredRoommatesDao') private userPreferredRoommatesDao: UserPreferredRoommatesDao
  ) {}

  public createContract = (roomId: number, iduser: string) => {
    let start_date
    return this.contractDao.getContractBy({ iduser, status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED] })
      .then(contract => contract
        ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${iduser} has pending contract or signed contract is waiting to be approved` })
        : this.userPreferredRoommatesDao.getPairedPreferredRoommate(iduser)
          .then(roommate => !roommate ? [iduser] : [roommate.inviter_id, roommate.invitee_id])
          .then(idusers => this.offerDao.getContractDataByRoomIdAndExternalIds(roomId, idusers)
            .then(contractData => contractData.length === 0 ?
              Promise.reject({ message: 'NOT_ALLOWED', reason: `Contract data not found for user ${iduser}` }) : contractData)
            .then(contractData => {
              if (contractData[0].is_auto_offer_flow) {
                contractData[0].move_in_date = contractData[0].user_move_in_date
              } else {
                contractData[0].move_in_date = contractData[0].room_move_in_date
              }
              start_date = contractData[0].move_in_date
              return contractData
            })
            .then(contractData => getTemplatesByCollectionId(contractData[0].collection_id)
              .then(parseContractTemplates)
              .then(templates => formatContract(contractData, templates)
                .then(generateContract)
                .then(({ data: { id } }) => publishContract(id))
                .then(({ data: { parties } }) => mapParticipantWithCandidate(
                  contractData.map(({ iduser, first_name, room_id, email, facade_id }) => ({ iduser, first_name, room_id, email, facade_id })),
                  parties
                ))
                .then(participants =>
                  Promise.all(participants.map(participant =>
                    generateAccessToken(participant.external_id, participant.external_participant_id)
                      .then(({ data: { token: external_token } }) => Contract.generateContract({ ...participant, start_date })
                        .then(this.contractDao.createContract)
                        .then(contract => (
                          emailAxiosPost('/mail/contract-generated-notification',
                            {
                              email: participant.email,
                              external_id: contract.external_id,
                              external_token,
                              first_name: participant.first_name,
                            }),
                          updateUserTags(process.env.MAILCHIMP_LIST_ID)(
                            formatUser({
                              email: participant.email,
                              contract: { facade_id: contract.facade_id, status: contract.status },
                            })
                          ),
                          contractEventLogger.info({
                            type: 'contract_generated',
                            data: { contract },
                            facade_id: contract.facade_id,
                            iduser: contract.iduser,
                          }),
                          ({ ...contract, external_token })))
                      )
                  ))
                    .then(contracts => (this.userPreferredRoommatesDao.deleteUserPreferredRoommateBy({ iduser }), contracts)))))))
  }

  public deleteContract = (id: number) => this.contractDao.deleteContract(id)

  public updateContract = (data: IOneflowResponse) =>
    parseOneflowResponse(data)
      .then(({ externalId, status, participantId }) => {
        // Participant level process
        if (participantId) {
          if (status === CONTRACT_STATUS.REJECTED) {
            return this.contractDao.getContractsBy({ externalId, status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED] })
              .then(contracts => this.transactionDao.updateContractsAndRelatedInfoAfterRejection(contracts)
                .then(() => contracts.map(({ user_email, facade_id }) =>
                  updateUserTags(process.env.MAILCHIMP_LIST_ID)(formatUser({ email: user_email, contract: { facade_id, status } }))))
                .then(() => contractEventLogger.info({
                  type: 'contract_rejected', data: { contracts }, facade_id: get(contracts[0], 'facade_id'),
                })))
          } else {
            return this.contractDao.updateContractBy({ participantId }, { status })
          }
          // Contract level process
        } else {
          return this.contractDao.getContractsBy({ externalId, status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE] })
            .then(contracts => {
              if (status === CONTRACT_STATUS.REJECTED) {
                return this.transactionDao.updateContractsAndRelatedInfoAfterRejection(contracts)
                  .then(() => contracts.map(({ user_email, facade_id }) =>
                    updateUserTags(process.env.MAILCHIMP_LIST_ID)(formatUser({ email: user_email, contract: { facade_id, status } }))))
                  .then(() => contractEventLogger.info({
                    type: 'contract_rejected', data: { contracts, reason: 'overdue' }, facade_id: get(contracts[0], 'facade_id'),
                  }))
              } else if (status === CONTRACT_STATUS.SIGNED) {
                return this.transactionDao.updateContractsAndRelatedInfoAfterSigning(contracts)
                  .then(() => contracts.map(({ user_email, facade_id }) =>
                    updateUserTags(process.env.MAILCHIMP_LIST_ID)(formatUser({ email: user_email, contract: { facade_id, status } }))))
                  .then(() => contractEventLogger.info({ type: 'contract_signed', data: { contracts }, facade_id: get(contracts[0], 'facade_id') }))
              } else {
                return Promise.all(contracts.map(({ id }) => this.contractDao.updateContractBy({ id }, { status })))
              }
            })
        }
      })

  public updateContractById = (id: string, data: Partial<Contract>) =>
    this.contractDao.updateContractBy({ id: Number(id) }, data)
      .then(contract => data.status === CONTRACT_STATUS.TERMINATED ?
        // Release the room when its contract is terminated
        this.roomDao.updateRoomBy({ id: contract.room_id }, { status: ROOM_STATUS.AVAILABLE })
          .then(() => this.userDao.getUserBy({ iduser: contract.iduser }).then(({ first_name, email }) => {
            emailAxiosPost('/mail/contract-terminated-notification', { email, end_date: convertDateToISOString(contract.end_date).slice(0, 10), first_name })
            return contract
          }))
        : contract)

  public getContractsByRoomId = (id: number) =>
    this.contractDao.getContractsBy({ roomIds: [id], status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE] })

  public getContractsByIduser = (iduser: string) =>
    this.contractDao.getContractBy({ iduser, status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE] })
      .then(contract => !contract ? Promise.reject({ message: 'NO_CONTENT', reason: `No contract is found for user ${iduser}` }) : contract)
      .then(contract => this.contractDao.getContractsBy({
        externalId: contract.external_id, status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE],
      }))
      .then(contracts => Promise.all(contracts.map(contract =>
        generateAccessToken(contract.external_id, contract.external_participant_id)
          .then(({ data: { token: external_token } }) => ({ ...contract, external_token })))))

  public getContractPdf = (externalId: string) => getContractPdf(externalId).then(getDataFromResponse)
}
