import { UserProfiles } from '../../domain/entity'

export interface UserProfilesDao {
  getUserProfile(iduser: string)
  createUserProfile(data: Partial<UserProfiles>)
  updateUserProfile(iduser: string, data: Partial<UserProfiles>)
}
