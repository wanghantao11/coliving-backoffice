import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { UserProfilesDao } from '../dao/userProfiles.dao'
import { UserProfiles } from '../entity/userProfiles'

@injectable()
export class UserProfilesRepository implements UserProfilesDao {
  private readonly REPO_NAME = 'user_profiles'

  public getUserProfile = (iduser: string) =>
    getRepository(UserProfiles, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('iduser = :iduser', { iduser })
      .getOne()

  public createUserProfile = (data: Partial<UserProfiles>) =>
    getRepository(UserProfiles, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(UserProfiles)
      .values({ ...data })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public updateUserProfile = (iduser: string, data: Partial<UserProfiles>) =>
    getRepository(UserProfiles, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('iduser = :iduser', { iduser })
      .returning('*')
      .execute()
      .then(res => res.raw[0])
}
