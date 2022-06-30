import { injectable } from 'inversify'
import { getManager } from 'typeorm'
import * as httpContext from 'express-http-context'

import {
  Contract,
  Room,
  Offer,
  ProjectFacade,
  ProjectFacadeBilling,
  User,
  UserPreferences,
  UserProfiles,
  ContractTemplates,
  Client,
  Role,
  UserPreferredRoommates
} from './../../domain/entity/'
import { TransactionDao } from './../../domain/dao'
import { USER_TYPE, CONTRACT_STATUS, OFFER_STATUS, ROOM_STATUS, SITE_ADMIN, PROJECT_MANAGER,
  COMMUNITY_MANAGER, HOST, PREFERRED_ROOMMATES_STATUS } from '../../infrastructure/constants'
import { offerEventLogger } from '../../infrastructure/utils/loggers'

@injectable()
export class TransactionRepository implements TransactionDao {
  public updateRoomAndOfferStatusAndUserType = (offer: Offer, idusers: string[]): Promise<Offer> =>
    getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager =>
      (
        transactionalEntityManager.update(Room, { id: offer.room_id }, { status: ROOM_STATUS.RESERVED }),
        idusers.map(iduser => (
          transactionalEntityManager.update(Offer, { iduser, room_id: offer.room_id }, { status: OFFER_STATUS.ACCEPTED }),
          transactionalEntityManager.findOne(User, { iduser })
            .then(user => user.user_type !== USER_TYPE.TENANT && transactionalEntityManager.update(User, { iduser }, { user_type: USER_TYPE.CANDIDATE }))
        )),
        transactionalEntityManager.delete(Offer, { room_id: offer.room_id, status: OFFER_STATUS.PENDING }),
        transactionalEntityManager.findOne(Offer, offer.id)
      )
    )

  public createProjectFacadeWithBillingAndTemplates = (projectFacade: ProjectFacade) =>
    getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager =>
      transactionalEntityManager.save(projectFacade)
        .then(createdFacade =>
          (
            ProjectFacadeBilling.generateProjectFacadeBilling({ facade_id: createdFacade.id, client_id: createdFacade.client_id })
              .then(projectFacadeBilling => transactionalEntityManager.save(projectFacadeBilling)),
            ContractTemplates.generateContractTemplates({ facade_id: createdFacade.id, client_id: createdFacade.client_id })
              .then(roomTemplate => transactionalEntityManager.save(roomTemplate)),
            createdFacade
          )
        )
    )

  public createUserWithPreferencesAndProfiles = (user: User): Promise<User> =>
    getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager =>
      transactionalEntityManager.save(user)
        .then(createdUser =>
          UserPreferences.generateUserPreferences({ iduser: createdUser.user_key })
            .then(userPreferences => UserProfiles.generateUserProfiles({ iduser: createdUser.iduser })
              .then(userProfiles => transactionalEntityManager.save([userPreferences, userProfiles])))
            .then(() => createdUser)
        )
    )

  public updateContractsAndRelatedInfoAfterRejection = (contracts: Contract[]) =>
    getManager(process.env.NODE_ENV).transaction('READ COMMITTED', transactionalEntityManager =>
      Promise.all(contracts.map(({ id, iduser, room_id, facade_id }) => (
        httpContext.set('iduser', iduser),
        transactionalEntityManager.update(Contract, id, { status: CONTRACT_STATUS.REJECTED, rejected_at: new Date() }),
        transactionalEntityManager.update(User, { iduser }, { user_type: USER_TYPE.LIGHT }),
        offerEventLogger.info({ type: 'offer_rejected', data: { offer: { iduser, room_id }, reason: { contract: true } }, facade_id }),
        transactionalEntityManager.delete(Offer, { iduser }),
        transactionalEntityManager.findOne(User, { iduser })
          .then(user => (
            transactionalEntityManager.update(UserPreferences, { iduser: user.user_key }, { needs_manual_offer: false }),
            !user.is_verified && transactionalEntityManager.delete(User, { iduser })
          )),
        transactionalEntityManager.update(Room, { id: room_id }, { status: ROOM_STATUS.AVAILABLE })
      )))
    )

  public updateContractsAndRelatedInfoAfterSigning = (contracts: any) =>
    getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager =>
      Promise.all(contracts.map(({ id, iduser, room_id, user_type }) => (
        transactionalEntityManager.update(Contract, id, { status: CONTRACT_STATUS.SIGNED, signed_at: new Date() }),
        transactionalEntityManager.delete(Offer, { iduser }),

        // If user is already a tenant, signing a new contract will automatically activate it and terminate the old contract
        user_type === USER_TYPE.TENANT && transactionalEntityManager.findOne(Contract, { iduser, status: CONTRACT_STATUS.ACTIVE })
          .then(contract => (
            transactionalEntityManager.update(Contract, { id: contract.id }, { status: CONTRACT_STATUS.TERMINATED, terminated_at: new Date() }),
            transactionalEntityManager.update(Room, { id: contract.room_id }, { status: ROOM_STATUS.AVAILABLE })
          )),
        user_type === USER_TYPE.TENANT && transactionalEntityManager.update(Contract, id, { status: CONTRACT_STATUS.ACTIVE, activated_at: new Date() }),
        user_type === USER_TYPE.TENANT && transactionalEntityManager.update(Room, { id: room_id }, { status: ROOM_STATUS.OCCUPIED })
      )))
    )

  public updateContractAndRelatedInfoAfterApproveTenant = ({ id, iduser, room_id }: Contract) =>
    getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager =>
      Promise.all([
        transactionalEntityManager.update(User, { iduser }, { user_type: USER_TYPE.TENANT }),
        transactionalEntityManager.update(Contract, id, { status: CONTRACT_STATUS.ACTIVE, activated_at: new Date() }),
        transactionalEntityManager.update(Room, { id: room_id }, { status: ROOM_STATUS.OCCUPIED }),
      ])
    )

  public createClientAndRoles = (client: Client) =>
    getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager =>
      Client.generateClient(client).then(client => transactionalEntityManager.createQueryBuilder()
        .insert()
        .into(Client)
        .values({ ...client })
        .returning('*')
        .execute()
        .then(res => res.raw[0])
        .then(client => Promise.all([
          Role.generateRole({ client_id: client.id, ...SITE_ADMIN }).then(siteAdmin => transactionalEntityManager.save(siteAdmin)),
          Role.generateRole({ client_id: client.id, ...PROJECT_MANAGER }).then(projectManager => transactionalEntityManager.save(projectManager)),
          Role.generateRole({ client_id: client.id, ...COMMUNITY_MANAGER }).then(communityManager => transactionalEntityManager.save(communityManager)),
          Role.generateRole({ client_id: client.id, ...HOST }).then(host => transactionalEntityManager.save(host)),
        ]).then(() => client))))

  public acceptPreferredRommmateInvitation = ({ inviter_id, invitee_id }: Partial<UserPreferredRoommates>) =>
    getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager =>
      Promise.all([
        transactionalEntityManager.findOne(User, { iduser: inviter_id }),
        transactionalEntityManager.findOne(User, { iduser: invitee_id }),
      ])
        .then(([{ user_key: inviter_key }, { user_key: invitee_key }]) => Promise.all([
          transactionalEntityManager.update(UserPreferredRoommates, { inviter_id, invitee_id }, { status: 'Accepted', invitation_code: null }),
          transactionalEntityManager.update(UserPreferences, { iduser: inviter_key }, { has_room_type_preference: true, has_double_room: true, has_single_room: false }),
          transactionalEntityManager.update(UserPreferences, { iduser: invitee_key }, { has_room_type_preference: true, has_double_room: true, has_single_room: false }),
          transactionalEntityManager.delete(Offer, { iduser: inviter_id, status: OFFER_STATUS.PENDING }),
          transactionalEntityManager.delete(Offer, { iduser: invitee_id, status: OFFER_STATUS.PENDING }),
        ])))

  public connectPreferredRoommate = ({ inviter_id, invitee_id }: Partial<UserPreferredRoommates>, invitee_user_key: number) =>
    getManager(process.env.NODE_ENV).transaction('SERIALIZABLE', transactionalEntityManager =>
      transactionalEntityManager.findOne(User, { iduser: inviter_id })
        .then(({ user_key: inviter_user_key }) =>
          transactionalEntityManager.findOne(UserPreferences, { iduser: inviter_user_key })
            .then(inviterPreference => Promise.all([
              // create roommate
              UserPreferredRoommates.generateUserPreferredRoomate({ inviter_id, invitee_id, status: PREFERRED_ROOMMATES_STATUS.ACCEPTED })
                .then(preferredRoommate => transactionalEntityManager.save(preferredRoommate)),
              // sync preference
              transactionalEntityManager.update(UserPreferences, { iduser: invitee_user_key },
                {
                  has_room_type_preference: true,
                  has_double_room: true,
                  has_single_room: false,
                  move_in_date_from: inviterPreference.move_in_date_from,
                  move_in_date_to: inviterPreference.move_in_date_to,
                }),
              // reject possible pending offer from roommate
              transactionalEntityManager.update(Offer, { iduser: invitee_id }, { status: OFFER_STATUS.REJECTED }),
            ]))
        ))
}
