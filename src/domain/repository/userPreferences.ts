import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { UserPreferencesDao } from './../../domain/dao/userPreferences.dao'
import { UserPreferences } from './../../domain/entity/userPreferences'

@injectable()
export class UserPreferencesRepository implements UserPreferencesDao {
  private readonly REPO_NAME = 'user_preferences'

  public createUserPreferences = (data: Partial<UserPreferences>) =>
    getRepository(UserPreferences, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(UserPreferences)
      .values({ ...data })
      .returning([
        'locations',
        'is_suitable_for_disability',
        'has_private_bathroom',
        'has_private_toilet',
        'has_double_room',
        'has_single_room',
        'has_room_type_preference',
        'rent_from',
        'rent_to',
        'roomies',
        'move_in_date_from',
        'move_in_date_to',
        'period_of_stay',
      ])
      .execute()
      .then(res => res.raw[0])

  public getUserPreferences = (id: number) =>
    getRepository(UserPreferences, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .select([
        'user_preferences.locations',
        'user_preferences.is_suitable_for_disability',
        'user_preferences.has_private_bathroom',
        'user_preferences.has_private_toilet',
        'user_preferences.has_double_room',
        'user_preferences.has_single_room',
        'user_preferences.has_room_type_preference',
        'user_preferences.rent_from',
        'user_preferences.rent_to',
        'user_preferences.roomies',
        'user_preferences.move_in_date_from',
        'user_preferences.move_in_date_to',
        'user_preferences.period_of_stay',
        'user_preferences.needs_contact_back',
        'user_preferences.needs_manual_offer',
      ])
      .where('iduser = :id', { id })
      .getOne()

  public updateUserPreferences = (id: number, data: Partial<UserPreferences>): Promise<UserPreferences> =>
    getRepository(UserPreferences, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('iduser = :id', { id })
      .returning([
        'locations',
        'is_suitable_for_disability',
        'has_private_bathroom',
        'has_private_toilet',
        'has_double_room',
        'has_single_room',
        'has_room_type_preference',
        'rent_from',
        'rent_to',
        'roomies',
        'move_in_date_from',
        'move_in_date_to',
        'period_of_stay',
        'needs_contact_back',
        'needs_manual_offer',
      ])
      .execute()
      .then(res => res.raw[0])
}
