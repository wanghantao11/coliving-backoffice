import { inject, injectable } from 'inversify'
import 'reflect-metadata'

import {
  AdminMemberNotesDao,
  ApplicationDao,
  ContractDao,
  InterestsDao,
  MemberTagsDao,
  ProjectFacadeDao,
  TransactionDao,
  UserDao,
  UserPreferencesDao,
  UserProfilesDao,
  UserScoreDao
} from './../../domain/dao'

import { AdminMemberNotes } from './../../domain/entity'
import { excludeKeysFromObject } from '../../infrastructure/utils/common'
import { CONTRACT_STATUS } from '../../infrastructure/constants'

@injectable()
export class MemberService {
  constructor(
    @inject('ProjectFacadeDao') private projectFacadeDao: ProjectFacadeDao,
    @inject('AdminMemberNotesDao') private adminMemberNotesDao: AdminMemberNotesDao,
    @inject('ApplicationDao') private applicationDao: ApplicationDao,
    @inject('InterestsDao') private interestsDao: InterestsDao,
    @inject('MemberTagsDao') private memberTagsDao: MemberTagsDao,
    @inject('UserDao') private userDao: UserDao,
    @inject('UserPreferencesDao') private userPreferencesDao: UserPreferencesDao,
    @inject('UserProfilesDao') private userProfilesDao: UserProfilesDao,
    @inject('UserScoreDao') private userScoreDao: UserScoreDao,
    @inject('ContractDao') private contractDao: ContractDao,
    @inject('TransactionDao') private transactionDao: TransactionDao
  ) {}

  public getMember = (iduser: string) =>
    this.userDao.getUserBy({ iduser })
      .then(user => !user ? Promise.reject({ message: 'NOT_FOUND', reason: `No user found for iduser ${iduser}` }) : user)
      .then(excludeKeysFromObject('password', 'user_key'))
      .then(user => user.is_test_complete
        ? this.userScoreDao.getUserScoreByExternalId(iduser)
          .then(userScore => ({ ...user, test_completed_at: userScore.created_at }))
        : user)

  public getMemberNotes = (iduser: string) =>
    this.adminMemberNotesDao.getAdminMemberNotes(iduser)
      .then(notes => !notes || !notes.tag_ids || notes.tag_ids.length === 0 ?
        notes : this.memberTagsDao.getMemberTags(notes.tag_ids)
          .then(tags => {
            notes.tags = tags
            return notes
          })
      )

  public getMemberPreferences = (iduser: string) =>
    this.userDao.getUserBy({ iduser })
      .then(({ user_key }) => this.userPreferencesDao.getUserPreferences(user_key))

  public getMemberProfile = (iduser: string) =>
    this.userProfilesDao.getUserProfile(iduser)
      .then(profile => !profile || !profile.interest_ids || profile.interest_ids.length === 0 ? profile :
        this.interestsDao.getInterestsByIds(profile.interest_ids)
          .then(interests => {
            profile.interests = interests
            return profile
          })
      )

  public getMemberSubscriptions = (iduser: string) =>
    this.applicationDao.getMemberApplications({ iduser }).then(applications =>
      applications.length === 0 ? [] :
        Promise.resolve(applications.map(application => application.facade_id))
          .then(facadeIds => this.projectFacadeDao.getProjectFacades(facadeIds))
          .then(projects =>
            projects.map(({ id, name }) => ({
              name,
              subscribed_at: applications.filter(
                application => application.facade_id === id
              )[0].created_at,
            }))
          ))

  public getMemberWishedRoomies = (iduser: string) =>
    this.userDao.getUserBy({ iduser })
      .then(({ user_key }) => this.userPreferencesDao.getUserPreferences(user_key)
        .then(userPreference => !userPreference ? [] : userPreference.roomies)
        .then(ids => (!ids || ids.length === 0 ? [] : this.userDao.getUsersBy({ userKeys: ids })))
      )

  public createMemberNotes = (data: AdminMemberNotes) =>
    this.adminMemberNotesDao.createAdminMemberNotes(data)

  public updateMemberNotes = (iduser: string, data: Partial<AdminMemberNotes>) =>
    this.adminMemberNotesDao.updateAdminMemberNotes(iduser, data)

  public async approveMemberToTenant(iduser: string) {
    try {
      const contract = await this.contractDao.getContractBy({ iduser, status: [CONTRACT_STATUS.SIGNED] })

      if (!contract) {
        return Promise.reject({ message: 'NOT_FOUND', reason: `No signed contracts found for ${iduser}` })
      }

      await this.transactionDao.updateContractAndRelatedInfoAfterApproveTenant(contract)

      return this.getMember(iduser)
    } catch (e) {
      return Promise.reject({ message: 'INTERNAL_SERVER_ERROR', reason: 'Approve tenant failed', detail: e.message })
    }
  }
}
