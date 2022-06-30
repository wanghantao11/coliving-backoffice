import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { CONTRACT_STATUS, USER_TYPE } from './../../infrastructure/constants'
import { convertDateToISOString, convertStringToBoolean } from './../../infrastructure/utils/common'
import { convertAgeToBirthday } from './../../infrastructure/utils/user'
import { TenantDao } from './../dao/tenant.dao'
import { Contract, User, UserProfiles } from './../entity'

@injectable()
export class TenantRepository implements TenantDao {
  private readonly REPO_NAME = 'user'

  public getTenants = (iduser: string, facade_id: number, query: any) => {
    const { food_preferences, interest_ids, age_from, age_to, include_unspecified_age, prefix, offset, limit } = query

    let filterQuery = `user.iduser != '${iduser}' AND user.user_type = '${USER_TYPE.TENANT}' AND contract.facade_id = ${facade_id} AND contract.status = '${CONTRACT_STATUS.ACTIVE}'`

    if (food_preferences) {
      filterQuery = filterQuery + ` AND userProfiles.food_preference = ANY ('{${food_preferences.join(',')}}')`
    }
    if (interest_ids) {
      filterQuery = filterQuery + ` AND userProfiles.interest_ids && '{${interest_ids.join(',')}}'::int[]`
    }

    const maxAgeDate = convertAgeToBirthday(age_from)
    const minAgeDate = convertAgeToBirthday(age_to)
    if (convertStringToBoolean(include_unspecified_age)) {
      filterQuery = filterQuery +
        ` AND (user.birthday <= '${convertDateToISOString(maxAgeDate)}'
        AND user.birthday > '${convertDateToISOString(minAgeDate)}'
        OR user.birthday IS NULL)`
    } else {
      filterQuery = filterQuery +
        ` AND user.birthday <= '${convertDateToISOString(maxAgeDate)}'
        AND user.birthday > '${convertDateToISOString(minAgeDate)}'`
    }
    if (prefix) {
      filterQuery = filterQuery + ` AND (user.first_name ilike '%${prefix}%' OR user.last_name ilike '%${prefix}%')`
    }

    return getRepository(User, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(Contract, 'contract', 'user.iduser = contract.iduser')
      .leftJoin(UserProfiles, 'userProfiles', 'user.iduser = userProfiles.iduser')
      .where(filterQuery)
      .select([
        'first_name',
        'user.iduser as iduser',
        'last_name',
        'img_url',
      ])
      .offset(offset)
      .limit(limit)
      .getRawMany()
  }

  public getTenantDetailById = (iduser: string) =>
    getRepository(User, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoin(UserProfiles, 'userProfiles', 'user.iduser = userProfiles.iduser')
      .where('user.iduser = :iduser and user.user_type = :type', { iduser, type: USER_TYPE.TENANT })
      .select([
        'first_name',
        'last_name',
        'user.iduser AS iduser',
        'email',
        'birthday',
        'img_url',
        'registration_time',
        'phone',
        'gender',
        'user_type',
        '\"userProfiles\".display_name',
        '\"userProfiles\".interest_ids',
        '\"userProfiles\".hometown',
        '\"userProfiles\".occupation',
        '\"userProfiles\".schools',
        '\"userProfiles\".food_preference',
        '\"userProfiles\".gluten_intolerent',
        '\"userProfiles\".wheat_intolerent',
        '\"userProfiles\".lactose_intolerent',
        '\"userProfiles\".allergic_to_milk',
        '\"userProfiles\".allergic_to_egg',
        '\"userProfiles\".allergic_to_shellfish',
        '\"userProfiles\".allergic_to_fish',
        '\"userProfiles\".allergic_to_nuts',
        '\"userProfiles\".fun_facts',
      ])
      .getRawOne()
}
