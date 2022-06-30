import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import * as uuid from 'uuid/v4'

import { UserPreferencesDao, UserPreferredRoommatesDao, UserDao, TransactionDao, OfferDao } from './../../domain/dao'
import { UserPreferences, User, UserPreferredRoommates, Offer } from './../../domain/entity/'
import { emailAxiosPost, sendCallbackAutoReplyEmail } from './../../infrastructure/utils/email'
import { signShareRoomInvitation } from './../auth/jwt/service'
import { isUserCandidateOrTenant } from '../../infrastructure/utils/user'
import { formatEmail } from '../../infrastructure/utils/common'
import { OFFER_STATUS, USER_TYPE } from '../../infrastructure/constants'

@injectable()
export class UserPreferencesService {
  constructor(
    @inject('UserDao') private userDao: UserDao,
    @inject('UserPreferencesDao') private userPreferencesDao: UserPreferencesDao,
    @inject('UserPreferredRoommatesDao') private userPreferredRoommatesDao: UserPreferredRoommatesDao,
    @inject('TransactionDao') private transactionDao: TransactionDao,
    @inject('OfferDao') private offerDao: OfferDao
  ) {}

  public createUserPreferences = (preferences: Partial<UserPreferences>) =>
    this.userPreferencesDao.createUserPreferences(preferences)

  public getUserPreferences = (iduser: string) =>
    this.userDao.getUserBy({ iduser })
      .then(({ user_key }) => this.userPreferencesDao.getUserPreferences(user_key)
        .then(userPreferences => !userPreferences
          ? this.userPreferencesDao.createUserPreferences({ iduser: user_key, locations: [] })
          : userPreferences))

  public updateUserPreferences = (iduser: string, data: Partial<UserPreferences>) =>
    this.userDao.getUserBy({ iduser })
      .then(({ user_key }) => this.userPreferencesDao.updateUserPreferences(user_key, data))
      .then(updatedPreference => (
        data.needs_contact_back && this.userDao.getUserBy({ iduser })
          .then(({ email, first_name }) => sendCallbackAutoReplyEmail({ email, first_name })),
        updatedPreference
      ))

  public sendInvitation = (inviter: Partial<User>, email: string) =>
    this.userDao.getUserBy({ iduser: inviter.iduser })
      .then(inviter => inviter.email === formatEmail(email) ? Promise.reject({ message: 'NOT_ALLOWED', reason: 'Roommate can not be self' }) : inviter)
      .then(inviter => isUserCandidateOrTenant(inviter)
        ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${inviter.iduser} has accepted offer or signed contract` }) : null)
      .then(() => this.userDao.getUserBy({ email }))
      .then(invitee => !invitee ? Promise.reject({ message: 'NOT_FOUND', reason: 'User email does not exist' }) : invitee)
      .then(invitee => !invitee.is_test_complete
        ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${invitee.iduser} has not completed test` }) : invitee)
      .then(invitee => isUserCandidateOrTenant(invitee)
        ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${invitee.iduser} has accepted offer or signed contract` }) : invitee)
      .then(invitee => signShareRoomInvitation(inviter, invitee.iduser)
        .then(invitation_code =>
          emailAxiosPost('/mail/preferred-roommate-invitation', {
            inviter: {
              img_url: inviter.img_url,
              first_name: inviter.first_name,
            },
            invitee: {
              email: invitee.email,
              first_name: invitee.first_name,
            },
            link: `${process.env.COMMUNITY_FRONTEND}/preferred-roommate/${invitation_code}`,
          }).then(() => this.userPreferredRoommatesDao.createUserPreferredRoommate(
            { inviter_id: inviter.iduser, invitee_id: invitee.iduser, invitation_code }
          ))
        )
      )

  public replyInvitation = (data: Partial<UserPreferredRoommates>) =>
    this.userDao.getUserBy({ iduser: data.inviter_id })
      .then(inviter => isUserCandidateOrTenant(inviter)
        ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${inviter.iduser} has accepted offer or signed contract` }) : null)
      .then(() => this.userDao.getUserBy({ iduser: data.invitee_id })
        .then(invitee => isUserCandidateOrTenant(invitee)
          ? Promise.reject({ message: 'NOT_ALLOWED', reason: `User ${invitee.iduser} has accepted offer or signed contract` }) : null))
      .then(() => this.transactionDao.acceptPreferredRommmateInvitation(data)
      )

  public deletePreferredRoommate = (id: number) =>
    this.userPreferredRoommatesDao.deleteUserPreferredRoommate(id)

  public getPreferredRoommate = (iduser: string) =>
    this.userPreferredRoommatesDao.getUserPreferredRoommates(iduser)
      .then(preferredRoommate =>
        !preferredRoommate ? Promise.reject({ message: 'NOT_FOUND', reason: `No roommate is found by iduser ${iduser}` }) : preferredRoommate)

  public connectPreferredRoommate = (inviter_id: string, { email, first_name, last_name, client_id }: Partial<User>) =>
    // check if user exists
    this.userDao.getUserBy({ email, is_verified: null })
      .then(user => !user ?
      // if user not exist, create a shadow user
        User.generateUser({ client_id, email, first_name, last_name, tos_version_accepted: 0, iduser: uuid(), is_verified: false })
          .then(this.transactionDao.createUserWithPreferencesAndProfiles)
        : user)
    // check if self
      .then(user => user.iduser === inviter_id ? Promise.reject({ message: 'NOT_ALLOWED', reason: 'Roommate can not be self' }) : user)
    // check user type
    // TODO should be user.user_type === USER_TYPE.CANDIDATE since if the user is already a tenant,
    // we should allow him to get connected, leaving the rest of the checks to host then
      .then(user => user.user_type !== USER_TYPE.LIGHT ? Promise.reject({ message: 'NOT_ALLOWED', reason: 'Roommate has already pending contract' }) : user)
      .then(({ iduser: invitee_id, user_key: invitee_user_key }) =>
      // pair 2 users and sync preference
        this.transactionDao.connectPreferredRoommate({ inviter_id, invitee_id }, invitee_user_key)
        // create the same offer for invitee
          .then(() => this.offerDao.getOfferBy({ iduser: inviter_id, status: OFFER_STATUS.PENDING }))
          .then(offer =>
            offer && Offer.generateOffer({
              iduser: invitee_id,
              room_id: offer.room_id,
              facade_id: offer.facade_id,
              is_preferences_matched: offer.is_preferences_matched,
            })
              .then(this.offerDao.createOffer))
      )
}
