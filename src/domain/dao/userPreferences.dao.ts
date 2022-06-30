import { UserPreferences } from './../entity/userPreferences'

export interface UserPreferencesDao {
  createUserPreferences(data: Partial<UserPreferences>)
  getUserPreferences(id: number): Promise<UserPreferences>
  updateUserPreferences(id: number, data: Partial<UserPreferences>): Promise<UserPreferences>
}
