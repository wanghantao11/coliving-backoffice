import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import * as httpContext from 'express-http-context'

import {
  AdminDao,
  OfferDao,
  ProjectDao,
  RoomDao,
  UserPreferencesDao,
  UserDao,
  UserProfilesDao,
  UserScoreDao,
  TransactionDao,
  UserPreferredRoommatesDao,
  ContractDao
} from './../../domain/dao'
import { Offer } from '../../domain/entity'
import { ROOM_STATUS, OFFER_STATUS } from '../../infrastructure/constants/room'
import { OfferQueue } from '../../infrastructure/persistence/queue/offer.queue'
import { convertDateToISOString } from '../../infrastructure/utils/common'
import { emailAxiosPost } from '../../infrastructure/utils/email'
import { offerEventLogger } from '../../infrastructure/utils/loggers'
import {
  filterRoomsByPreferences,
  pickRoomsByScore,
  pickNonIdenticalRooms,
  excludeRejectedOffersFromRooms,
  checkIsRoomListEmpty,
  checkIfUserHasNonRejectedOffers,
  checkIfUserHasAcceptedOffer,
  getJointPreferences,
  pickRoomsByPriority,
  checkIfAllApartmentsEmpty,
  pickTopRankedRooms,
  excludeOrphanRooms,
  processOfferRejection
} from '../../infrastructure/utils/offer'
import { handleNoOfferException } from '../../infrastructure/utils/error'
import queueConfigs from '../../../config/queue-config'
import { IOfferRequest, ISearchOfferLog, IManualOfferInfo } from './../../interfaces'
import { isCandidate } from '../../infrastructure/utils/user'
import { signInCommunity } from '../auth/jwt/service'
import { COMMUNITY, CONTRACT_STATUS } from '../../infrastructure/constants'
import { contractEventLogger } from '../../infrastructure/utils/loggers'

@injectable()
export class OfferService {
  constructor(
    @inject('OfferDao') private offerDao: OfferDao,
    @inject('AdminDao') private adminDao: AdminDao,
    @inject('ProjectDao') private projectDao: ProjectDao,
    @inject('RoomDao') private roomDao: RoomDao,
    @inject('TransactionDao') private transactionDao: TransactionDao,
    @inject('UserPreferencesDao') private userPreferencesDao: UserPreferencesDao,
    @inject('UserDao') private userDao: UserDao,
    @inject('UserProfilesDao') private userProfilesDao: UserProfilesDao,
    @inject('UserScoreDao') private userScoreDao: UserScoreDao,
    @inject('UserPreferredRoommatesDao') private userPreferredRoommatesDao: UserPreferredRoommatesDao,
    @inject('ContractDao') private contractDao: ContractDao
  ) {}

  public createOffer = (offer: Offer): Promise<Offer> => this.offerDao.createOffer(offer)

  public acceptOffer = (id: number): Promise<Offer> => this.offerDao.getOfferBy({ id })
    .then(offer => !offer ? Promise.reject({ message: 'NOT_FOUND', reason: `No offer is found by id ${id}` }) : offer)
    .then(offer => this.offerDao.getOffersBy({ iduser: offer.iduser })
      .then(checkIfUserHasAcceptedOffer)
      .then(hasAcceptedOffer => hasAcceptedOffer ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${offer.iduser} has accepted offer already` }) : offer))
    .then(offer => this.userPreferredRoommatesDao.getPairedPreferredRoommate(offer.iduser)
      .then(roommate => !roommate ? [offer.iduser] : [roommate.inviter_id, roommate.invitee_id])
      .then(idusers => this.roomDao.getRoomBy({ id: offer.room_id })
        .then(room => room.status === ROOM_STATUS.AVAILABLE ?
          this.transactionDao.updateRoomAndOfferStatusAndUserType(offer, idusers) :
          Promise.reject({ message: 'NOT_ALLOWED', reason: 'Room is not available anymore' }))))
    .then(offer => (offerEventLogger.info({
      type: 'offer_accepted',
      data: { offer },
      facade_id: offer.facade_id,
    }), offer))

  public rejectOffer = (id: number, rejection_reason: any): Promise<Offer> =>
    this.offerDao.getOfferBy({ id })
      .then(offer => !offer ? Promise.reject({ message: 'NOT_FOUND', reason: `No offer is found by id ${id}` }) : offer)
      .then(offer => this.userPreferredRoommatesDao.getPairedPreferredRoommate(offer.iduser)
        .then(roommate => !roommate ? [offer.iduser] : [roommate.inviter_id, roommate.invitee_id])
        .then(idusers => this.roomDao.getRoomBy({ id: offer.room_id })
          .then(room => room.status !== ROOM_STATUS.AVAILABLE
            ? Promise.reject({ message: 'NOT_ALLOWED', reason: 'Room is not available anymore' })
            : Promise.all(idusers.map(iduser => (
              processOfferRejection({ rejection_reason, iduser, offer },
                this.offerDao,
                this.userDao,
                this.userPreferencesDao
              ),
              this.userDao.getUserBy({ iduser }).then(user => this.projectDao.getProjectByFacadeId(offer.facade_id).then(project => emailAxiosPost(
                '/mail/offer-rejection',
                {
                  name: `${user.first_name} ${user.last_name}`,
                  sent_at: convertDateToISOString(offer.created_at).slice(0, 10),
                  move_in_date: room.move_in_date || project.move_in_date,
                  room: room.name,
                  project: project.name,
                  reject_reason: JSON.stringify(rejection_reason),
                }
              ))),
              offerEventLogger.info({
                type: 'offer_rejected',
                data: { offer: { room_id: offer.room_id, iduser }, reason: rejection_reason },
                facade_id: offer.facade_id,
              })
            )))
          )))

  public getOffersByExternalId = (iduser: string): Promise<Offer[]> =>
    this.offerDao.getOffersBy({ iduser })
      .then((offers: Offer[]) => offers.length === 0 ? Promise.reject({ message: 'NO_CONTENT', reason: `No offer is found for user ${iduser}` }) : offers)

  public requestOffer = (data: IOfferRequest): Promise<boolean> => {
    OfferQueue.add('requestOffer', data, queueConfigs.job)
    return Promise.resolve(true)
  }

  public searchMatchedOffer = (data: any) => {
    const { iduser, preferred_roommate_iduser, facade_id, ...preferences } = data
    let isPreferencesMatched = true
    let searchOfferLog: ISearchOfferLog = {}
    httpContext.set('iduser', iduser)
    offerEventLogger.info({ type: 'search_started', data: { preferred_roommate_iduser, preferences }, facade_id })
    return this.userDao.getUserBy({ iduser })
      .then(isCandidate)
      .then(isCandidate => isCandidate ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${iduser} is candidate`, data: searchOfferLog }) : null)
      .then(() => this.offerDao.getOffersBy({ iduser }))
      .then((offers: Offer[]) => offers.length !== 0 ? Promise.resolve(checkIfUserHasNonRejectedOffers(offers))
        .then(hasNonRejectedOffers => hasNonRejectedOffers && Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${iduser} has non-rejected Offers`, data: searchOfferLog }))
        : null)
      .then(() => this.roomDao.getRoomsBy({ facadeId: facade_id, status: ROOM_STATUS.AVAILABLE }))
      .then(rooms => checkIsRoomListEmpty(rooms) ?
        Promise.reject({ message: 'NOT_FOUND', reason: 'No available room is found', data: searchOfferLog })
        : (searchOfferLog.total_available = rooms.length, rooms))
      .then(rooms => this.offerDao.getOffersBy({ iduser, status: OFFER_STATUS.REJECTED })
        .then(excludeRejectedOffersFromRooms(rooms)))
      .then(rooms => checkIsRoomListEmpty(rooms) ?
        Promise.reject({ message: 'NOT_FOUND', reason: 'No available room is found after filtering out rejected rooms', data: searchOfferLog })
        : (searchOfferLog.after_rejected_offers = rooms.length, rooms))
      .then(excludeOrphanRooms)
      .then(rooms => checkIsRoomListEmpty(rooms) ?
        Promise.reject({ message: 'NOT_FOUND', reason: 'Available rooms are orphan rooms', data: searchOfferLog })
        : (searchOfferLog.after_orphan_check = rooms.length, rooms))
      .then(rooms => preferred_roommate_iduser
        ? this.userDao.getUserBy({ iduser: preferred_roommate_iduser })
          .then(({ user_key }) => this.userPreferencesDao.getUserPreferences(user_key))
          .then(getJointPreferences(preferences))
          .then(filterRoomsByPreferences(rooms))
        : filterRoomsByPreferences(rooms)(preferences))
      .then(({ rooms, isPreferencesMatched: _isPreferencesMatched, filterLog }) =>
        checkIsRoomListEmpty(rooms) ?
          Promise.reject({ message: 'NOT_FOUND', reason: 'No available room is found after preference filtering', log: { ...searchOfferLog, ...filterLog } })
          : (isPreferencesMatched = _isPreferencesMatched, searchOfferLog = { ...searchOfferLog, ...filterLog }, rooms)
      )
      .then(pickNonIdenticalRooms)
      .then(rooms => this.roomDao.getRoomsBy({ apartmentIds: rooms.map(room => room.apartment_id) })
        .then(allRooms => checkIfAllApartmentsEmpty(allRooms)
          ? pickRoomsByPriority(rooms)(preferences)
          : Promise.all([
            this.userScoreDao.getUserScoreByExternalId(iduser),
            this.roomDao.getUserScoresForTenantsAndCandidatesByRoomIds(allRooms.map(room => room.id)),
          ])
            .then(([userScore, tenantsWithScore]) => pickRoomsByScore(rooms)(userScore, tenantsWithScore))
            .then(rooms => checkIsRoomListEmpty(rooms) ?
              Promise.reject({ message: 'NOT_FOUND', reason: 'No available room is found after picking by score', data: searchOfferLog })
              : (searchOfferLog.after_picking_by_score = rooms.length, rooms))))
      .then(pickTopRankedRooms)
      .then(pickedRooms => pickedRooms.map(room => preferred_roommate_iduser
        ? this.offerDao.createOffersForPair(iduser, preferred_roommate_iduser, room.id, facade_id, isPreferencesMatched)
        : this.offerDao.createOffer({ iduser, room_id: room.id, facade_id, is_preferences_matched: isPreferencesMatched })))
      .then(promises => Promise.all(promises))
      .then(offers => offerEventLogger.info({ type: 'search_ended', data: { offers, search_offer_log: searchOfferLog }, facade_id }))
      .then(() => this.userDao.getUserBy({ iduser }).then(
        user => signInCommunity(user.iduser, COMMUNITY, '365d').then(token => emailAxiosPost(
          '/mail/offer-notification', { email: user.email, link: process.env.COMMUNITY_FRONTEND + `/offers?token=${token}` })))
      )
      .catch(handleNoOfferException(facade_id))
  }

  public sendOffersToSelectedMembers = (
    room_id: number,
    facade_id: number,
    facade_name: string,
    offer_info_list: Partial<IManualOfferInfo[]>,
    move_in_date: Date,
    sender_id: number) => Promise.all(offer_info_list.map(({ iduser, is_preferences_matched, matching_score }) =>
    this.contractDao.getContractsBy({ iduser, status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE] })
      .then(contracts => {
        const hasSignedContract = !!contracts.find(contract => contract.status === CONTRACT_STATUS.SIGNED)
        const hasPendingContract = !!contracts.find(contract => contract.status === CONTRACT_STATUS.PENDING)
        const hasActiveContract = !!contracts.find(contract => contract.status === CONTRACT_STATUS.ACTIVE)
        if (hasActiveContract) {
          return Promise.all(contracts.filter(contract => contract.status === CONTRACT_STATUS.ACTIVE)
            .map(contract => move_in_date && contract.start_date > move_in_date
              ? Promise.reject({ message: 'NOT_ALLOWED', reason: `user ${iduser} already has an onging contract after this move-in date` })
              : null
            ))
            .then(() => move_in_date && this.roomDao.updateRoomBy({ id: room_id }, { move_in_date }))
        } else if (hasSignedContract) {
          return Promise.reject({ message: 'NOT_ALLOWED', reason: `user ${iduser} has signed contract` })
        } else if (hasPendingContract) {
          return Promise.all(contracts.filter(contract => contract.status === CONTRACT_STATUS.PENDING)
            .map(contract => this.transactionDao.updateContractsAndRelatedInfoAfterRejection([contract])
              .then(() => contractEventLogger.info(
                {
                  type: 'contract_rejected',
                  data: { contract, reason: 'admin' },
                  facade_id,
                }))))
        }
      })
      .then(() => this.offerDao.getOffersBy({ iduser, status: OFFER_STATUS.PENDING })
        .then(offers => offers.length !== 0 && Promise.all(offers.map(offer =>
          this.offerDao.updateOfferBy({ id: offer.id }, { status: OFFER_STATUS.REJECTED })
            .then(() => offerEventLogger.info({
              type: 'offer_rejected',
              data: { offer: { room_id: offer.room_id, iduser }, reason: { admin: true } },
              facade_id: offer.facade_id,
            }))))))
      .then(() => this.offerDao.createOffer({ iduser, room_id, facade_id, is_preferences_matched, is_sent_by_admin: true, matching_score })
        .then(offer => (httpContext.set('iduser', iduser), offerEventLogger.info({ type: 'offer_sent', data: { offer }, facade_id })))
        .then(() => this.userDao.getUserBy({ iduser })
          .then(user => {
            emailAxiosPost('/mail/offer-admin-notification', { email: user.email, link: process.env.COMMUNITY_FRONTEND + '/offers' })
            return `${user.first_name} ${user.last_name}`
          })
        ))
  ))
    .then(data => this.adminDao.getAdminBy({ id: sender_id })
      .then(admin => this.roomDao.getRoomBy({ id: room_id })
        .then(room => emailAxiosPost(
          '/mail/offer-admin-summary',
          { email: admin.email, data, facade_name, room_name: room.name, move_in_date: room.move_in_date }
        ))
      )
    )

  public requestManualOffer = (iduser: string, project_name: string) =>
    this.userDao.getUserBy({ iduser })
      .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user found for iduser ${iduser}` }) : user)
      .then(({ email, first_name, last_name, user_key, age }) =>
        this.userPreferencesDao.updateUserPreferences(user_key, { needs_manual_offer: true })
          .then(() => (
            emailAxiosPost(
              '/mail/manual-offer-request-confirmation/user',
              { email, first_name, last_name, project_name }
            ),
            emailAxiosPost(
              '/mail/manual-offer-request-confirmation/admin',
              { age, first_name, last_name, link: `${process.env.BACKOFFICE_FRONTEND}/members/${iduser}` }
            )
          )))
}
