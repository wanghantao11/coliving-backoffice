import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { UserProfilesDao, UserDao } from './../../domain/dao'
import { UserProfiles } from './../../domain/entity'
import { formatUser, updateUser } from '../../infrastructure/utils/mailchimp'

@injectable()
export class UserProfilesService {
  constructor(
    @inject('UserProfilesDao') private userProfilesDao: UserProfilesDao,
    @inject('UserDao') private userDao: UserDao
  ) {}

  public createUserProfile = (data: Partial<UserProfiles>) =>
    this.userProfilesDao.createUserProfile(data)

  public getUserProfile = (iduser: string) =>
    this.userProfilesDao.getUserProfile(iduser)
      .then(userProfiles => !userProfiles
        ? this.userProfilesDao.createUserProfile({ iduser, interest_ids: [] })
        : userProfiles)

  public updateUserProfile = (iduser: string, data: Partial<UserProfiles>) =>
    this.userProfilesDao.updateUserProfile(iduser, data)
      .then(userProfile => this.userDao.getUserBy({ iduser })
        .then(({ email }) => data.interest_ids ?
          Promise.resolve(formatUser({ email, interest_ids: userProfile.interest_ids }))
            .then(updateUser(process.env.MAILCHIMP_LIST_ID)) : null)
        .then(() => userProfile)
      )
}
