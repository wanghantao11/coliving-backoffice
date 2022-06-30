import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { UserDao } from './../../domain/dao'
import { formatEmail, convertStringToBoolean, convertDateToISOString, excludeKeysFromObject } from '../../infrastructure/utils/common'
import { UserPreferences, UserProfiles, AdminMemberNotes, Offer, UserPreferredRoommates, User, Application, Contract } from '../entity'
import { convertAgeToBirthday } from './../../infrastructure/utils/user'
import { MAX_USER_LIMIT } from '../../infrastructure/constants'
import { IUserFilter, IUser} from '../../interfaces'

@injectable()
export class UserRepository implements UserDao {
  private readonly REPO_NAME = 'user'

  public deleteUserByExternalId = (iduser: string) =>
    getRepository(User, process.env.NODE_ENV).createQueryBuilder('user')
      .delete()
      .from(User)
      .where('iduser = :iduser', { iduser })
      .returning(['email'])
      .execute()
      .then(res => res.raw[0])

  public createUser = (user: User) =>
    Promise.resolve(Object.assign(user, { email: formatEmail(user.email) }))
      .then(user => getRepository(User, process.env.NODE_ENV)
        .createQueryBuilder(this.REPO_NAME)
        .insert()
        .into(User)
        .values(user)
        .returning('*')
        .execute()
        .then(res => res.raw[0]))

  public getUserBy = (filter: IUserFilter): Promise<IUser> => {
    const { email, iduser, is_verified = true } = filter
    const queries = []
    const initBuilder = getRepository(User, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .select([
        '\"user\".first_name',
        '\"user\".last_name',
        '\"user\".email',
        '\"user\".birthday',
        '\"user\".img_url',
        '\"user\".description',
        '\"user\".iduser',
        '\"user\".user_type',
        '\"user\".registration_time',
        '\"user\".phone',
        '\"user\".is_test_complete',
        '\"user\".gender',
        '\"user\".language',
        '\"user\".password',
        '\"user\".user_key',
        '\"user\".verification_code',
        '\"user\".is_verified',
        '\"user\".stripe_customer_id',
        '\"user\".stripe_has_saved_card',
      ])
      .addSelect('EXTRACT(YEAR from AGE(CURRENT_TIMESTAMP, (user.birthday)::timestamp)) AS age')

    if (email) {
      queries.push(`user.email = '${email}'`)
    }
    if (iduser) {
      queries.push(`user.iduser = '${iduser}'`)
    }
    if (is_verified) {
      queries.push(`user.is_verified = ${is_verified}`)
    }
    return initBuilder
      .where(queries.join(' AND '))
      .getRawOne()
  }

  public updateUserBy = (filter: IUserFilter, data: Partial<User>) => {
    const { iduser, email, is_verified = true } = filter
    const queries = []
    if (iduser) {
      queries.push(`iduser = '${iduser}'`)
    }
    if (email) {
      queries.push(`email = '${email}'`)
    }
    if (is_verified) {
      queries.push(`is_verified = ${is_verified}`)
    }
    return getRepository(User, process.env.NODE_ENV)
      .createQueryBuilder('user')
      .update()
      .set({ ...excludeKeysFromObject('age')(data) })
      .where(queries.join(' AND '))
      .returning([
        'first_name',
        'last_name',
        'email',
        'birthday',
        '"img_url"',
        'description',
        'phone',
        'is_test_complete',
        'gender',
        'language',
      ])
      .execute()
      .then(res => res.raw[0])
  }

  public getUsersCountBy = (filter: IUserFilter = {}): Promise<number> => {
    const queries = []
    const { ageSpan, registrationTimeSpan, locations, exclude = [], idusers = [], userKeys = [], is_verified = true } = filter
    const initBuilder = getRepository(User, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoinAndSelect('user.preferences', 'preferences')
      .select([
        'user.first_name',
        'user.last_name',
        'user.email',
        'user.birthday',
        'user.img_url',
        'user.description',
        'user.iduser',
        'user.user_type',
        'user.registration_time',
        'user.gender',
        'user.language',
      ])
    if (exclude.length !== 0) {
      queries.push(`user.iduser != ANY('{${exclude.join(',')}}')`)
    }
    if (registrationTimeSpan) {
      queries.push(`registration_time > '${registrationTimeSpan.startDate}' AND registration_time <= '${registrationTimeSpan.endDate}'`)
    }
    if (ageSpan) {
      queries.push(`birthday > '${convertDateToISOString(ageSpan.minBirthday)}' AND birthday <= '${convertDateToISOString(ageSpan.maxBirthday)}'`)
    }
    if (locations) {
      queries.push(`preferences.locations && '{${locations.join(',')}}'::character varying[]`)
    }
    if (idusers.length !== 0) {
      queries.push(`user.iduser = ANY('{${idusers.join(',')}}')`)
    }
    if (userKeys.length !== 0) {
      queries.push(`user.iduser = ANY('{${userKeys.join(',')}}')`)
    }
    if (is_verified) {
      queries.push(`user.is_verified = ${is_verified}`)
    }
    if (!queries) {
      return initBuilder.getCount()
    } else {
      return initBuilder
        .where(queries.join(' AND '))
        .getCount()
    }
  }

  public getUsersBy = (filter?: IUserFilter): Promise<User[]> => {
    const queries = []
    const { ageSpan, registrationTimeSpan, locations, offset = 0, limit = 10, exclude = [],
      idusers = [], userKeys = [], user_type, is_verified = true } = filter
    const initBuilder = getRepository(User, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoinAndSelect('user.preferences', 'preferences')
      .select([
        'user.user_key',
        'user.first_name',
        'user.last_name',
        'user.email',
        'user.birthday',
        'user.img_url',
        'user.description',
        'user.iduser',
        'user.user_type',
        'user.registration_time',
        'user.gender',
        'user.language',
      ])
      .addSelect('LENGTH(user.img_url)', 'lenImg')
      .orderBy({ '"lenImg"': 'DESC', 'registration_time': 'DESC' })
      .offset(offset)
      .limit(Math.min(limit, MAX_USER_LIMIT))

    if (exclude.length !== 0) {
      queries.push(`user.iduser != ANY('{${exclude.join(',')}}')`)
    }
    if (registrationTimeSpan) {
      queries.push(`registration_time > '${registrationTimeSpan.startDate}' AND registration_time <= '${registrationTimeSpan.endDate}'`)
    }
    if (ageSpan) {
      queries.push(`birthday > '${convertDateToISOString(ageSpan.minBirthday)}' AND birthday <= '${convertDateToISOString(ageSpan.maxBirthday)}'`)
    }
    if (locations) {
      queries.push(`preferences.locations && '{${locations.join(',')}}'::character varying[]`)
    }
    if (idusers.length !== 0) {
      queries.push(`user.iduser = ANY('{${idusers.join(',')}}')`)
    }
    if (userKeys.length !== 0) {
      queries.push(`user.user_key = ANY('{${userKeys.join(',')}}')`)
    }
    if (user_type) {
      queries.push(`user.user_type = '${user_type}'`)
    }
    if (is_verified) {
      queries.push(`user.is_verified = ${is_verified}`)
    }
    if (!queries) {
      return initBuilder.getMany()
    } else {
      return initBuilder
        .where(queries.join(' AND '))
        .getMany()
    }
  }

  public getSubscribedMembers = (facadeId: number, filter: any) => {
    const {
      email,
      name,
      has_single_room,
      has_double_room,
      has_private_bathroom,
      has_shared_bathroom,
      has_private_toilet,
      has_shared_toilet,
      include_unspecified_age,
      include_unspecified_move_in_date,
      exclude_users_with_offers,
      exclude_current_tenants,
      is_only_matching_rent,
      is_only_suitable_for_disability,
      is_only_today,
      is_only_test_complete,
      rent,
      tag_ids,
      age_from = 18,
      age_to = 100,
      subscribe_from,
      subscribe_to,
      move_in_date_from,
      offset = 0,
      limit = 10,
      sort_by = 'subscribed_at',
      sort_order = 'DESC',
    } = filter

    const selectedFields = [
      'user.iduser as iduser',
      '\"user\".user_type',
      '\"user\".first_name',
      '\"user\".last_name',
      '\"user\".email',
      '\"user\".phone',
      '\"user\".img_url',
      '\"user\".is_test_complete',
      '\"userPreferences\".has_single_room',
      '\"userPreferences\".has_double_room',
      '\"userPreferences\".has_private_bathroom',
      '\"userPreferences\".has_private_toilet',
      '\"userPreferences\".rent_to',
      '\"userPreferences\".is_suitable_for_disability',
      '\"userPreferences\".move_in_date_from',
      '\"userPreferences\".move_in_date_to',
      'application.created_at as subscribed_at',
      '\"adminMemberNotes\".description as note',
      '\"adminMemberNotes\".tag_ids as tag_ids',
    ]

    const preferredRoommatesFields = [
      '\"user\".iduser',
      '\"user\".user_type',
      '\"user\".first_name',
      '\"user\".last_name',
      '\"user\".email',
      '\"user\".phone',
      '\"user\".birthday',
      '\"user\".img_url',
      '\"userPreferredRoommates\".inviter_id',
      '\"userPreferredRoommates\".invitee_id',
      '\"userPreferences\".has_single_room',
      '\"userPreferences\".has_double_room',
      '\"userPreferences\".has_private_bathroom',
      '\"userPreferences\".has_private_toilet',
      '\"userPreferences\".is_suitable_for_disability',
    ].join(',')

    const groupByFields = [
      'user.iduser',
      '\"user\".user_type',
      '\"user\".first_name',
      '\"user\".last_name',
      '\"user\".email',
      '\"user\".phone',
      '\"user\".birthday',
      '\"user\".img_url',
      '\"userPreferences\".has_single_room',
      '\"userPreferences\".has_double_room',
      '\"userPreferences\".has_private_bathroom',
      '\"userPreferences\".has_private_toilet',
      '\"userPreferences\".rent_to',
      '\"userPreferences\".is_suitable_for_disability',
      '\"userPreferences\".move_in_date_from',
      '\"userPreferences\".move_in_date_to',
      '\"user\".is_test_complete',
      'application.created_at',
      '\"adminMemberNotes\".description',
      '\"adminMemberNotes\".tag_ids'].join(',')

    let filterQuery = `application.facade_id = ${facadeId} AND user.is_verified = TRUE `
    if (convertStringToBoolean(is_only_today)) {
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)
      filterQuery = filterQuery + `AND application.created_at > '${convertDateToISOString(currentDate)}' `
    }
    if (has_single_room !== has_double_room) {
      if (convertStringToBoolean(has_single_room)) {
        filterQuery = filterQuery + 'AND userPreferences.has_single_room = TRUE '
      }
      if (convertStringToBoolean(has_double_room)) {
        filterQuery = filterQuery + 'AND userPreferences.has_double_room = TRUE '
      }
    }

    if (has_private_bathroom !== has_shared_bathroom) {
      if (convertStringToBoolean(has_private_bathroom)) {
        filterQuery = filterQuery + 'AND userPreferences.has_private_bathroom = TRUE '
      }
      if (convertStringToBoolean(has_shared_bathroom)) {
        filterQuery = filterQuery + 'AND userPreferences.has_private_bathroom = FALSE '
      }
    }

    if (has_private_toilet !== has_shared_toilet) {
      if (convertStringToBoolean(has_private_toilet)) {
        filterQuery = filterQuery + 'AND userPreferences.has_private_toilet = TRUE '
      }
      if (convertStringToBoolean(has_shared_toilet)) {
        filterQuery = filterQuery + 'AND userPreferences.has_private_toilet = FALSE '
      }
    }

    if (convertStringToBoolean(is_only_matching_rent)) {
      filterQuery = filterQuery + `AND userPreferences.rent_to >= '${rent}' `
    }

    if (convertStringToBoolean(is_only_suitable_for_disability)) {
      filterQuery = filterQuery + 'AND userPreferences.is_suitable_for_disability = TRUE '
    }

    if (tag_ids) {
      filterQuery = filterQuery + `AND adminMemberNotes.tag_ids @> '{${tag_ids.join(',')}}'::int[]`
    }
    if (convertStringToBoolean(is_only_test_complete)) {
      filterQuery = filterQuery + 'AND user.is_test_complete = TRUE '
    }

    const maxAgeDate = convertAgeToBirthday(age_from)
    const minAgeDate = convertAgeToBirthday(age_to)

    if (convertStringToBoolean(exclude_current_tenants)) {
      filterQuery = filterQuery + 'AND user.user_type != \'Tenant\' '
    }

    if (convertStringToBoolean(exclude_users_with_offers)) {
      filterQuery = filterQuery + 'AND user.user_type != \'Candidate\' '
    }

    if (convertStringToBoolean(include_unspecified_age)) {
      filterQuery = filterQuery +
        `AND (user.birthday <= '${convertDateToISOString(maxAgeDate)}'
         AND user.birthday > '${convertDateToISOString(minAgeDate)}'
         OR user.birthday IS NULL) `
    } else {
      filterQuery = filterQuery +
        ` AND user.birthday <= '${convertDateToISOString(maxAgeDate)}'
         AND user.birthday > '${convertDateToISOString(minAgeDate)}' `
    }

    if (convertStringToBoolean(include_unspecified_move_in_date)) {
      if (move_in_date_from) {
        filterQuery = filterQuery +
          `AND ((move_in_date_to >= '${move_in_date_from}')
           OR (move_in_date_from IS NULL AND move_in_date_to IS NULL)) `
      }
    } else {
      if (move_in_date_from) {
        filterQuery = filterQuery + `AND move_in_date_to >= '${move_in_date_from}' `
      } else {
        filterQuery = filterQuery + 'AND move_in_date_from IS NOT NULL AND move_in_date_to IS NOT NULL '
      }
    }

    if (subscribe_from) {
      filterQuery = filterQuery + `AND application.created_at >= '${convertDateToISOString(new Date(subscribe_from))}' `
    }

    if (subscribe_to) {
      filterQuery = filterQuery + `AND application.created_at < '${convertDateToISOString(new Date(subscribe_to))}' `
    }

    if (email) {
      filterQuery = filterQuery + `AND (user.email ilike '%${email}%') `
    }

    if (name) {
      filterQuery = filterQuery + `AND (user.first_name ilike '%${name}%' OR user.last_name ilike '%${name}%') `
    }

    let dbQuery = getRepository(Application, process.env.NODE_ENV)
      .createQueryBuilder('application')
      .innerJoin(User, 'user', 'user.iduser = application.iduser')
      .innerJoin(UserProfiles, 'userProfiles', 'userProfiles.iduser = application.iduser')
      .innerJoin(UserPreferences, 'userPreferences', 'user.user_key = userPreferences.iduser')
      .leftJoin(Offer, 'offer', 'offer.iduser = application.iduser')
      .leftJoin(Contract, 'contract', 'contract.iduser = application.iduser')
      .leftJoinAndSelect(subquery => subquery
        .from(User, 'user')
        .innerJoin(UserPreferredRoommates, 'userPreferredRoommates', 'userPreferredRoommates.inviter_id = user.iduser OR userPreferredRoommates.invitee_id = user.iduser')
        .innerJoin(UserPreferences, 'userPreferences', 'userPreferences.iduser = user.user_key')
        .select(preferredRoommatesFields),
      'user_preferred_roommates', '(user_preferred_roommates.inviter_id = user.iduser OR user_preferred_roommates.invitee_id = user.iduser) AND user_preferred_roommates.iduser != user.iduser')
      .leftJoin(AdminMemberNotes, 'adminMemberNotes', 'adminMemberNotes.iduser = user.iduser')
      .select(selectedFields)
      .addSelect('json_agg(offer) FILTER (WHERE offer.iduser IS NOT NULL) AS offers')
      .addSelect('json_agg(contract) FILTER (WHERE contract.iduser IS NOT NULL) AS contracts')
      .addSelect('json_agg(user_preferred_roommates) FILTER (WHERE user_preferred_roommates.iduser IS NOT NULL) AS user_preferred_roommates')
      .addSelect('EXTRACT(YEAR from AGE(CURRENT_TIMESTAMP, (user.birthday)::timestamp)) AS age')
      .where(filterQuery)
      .groupBy(groupByFields)

    if (convertStringToBoolean(exclude_users_with_offers)) {
      dbQuery = dbQuery.having('count(offer) FILTER (WHERE offer.iduser IS NOT NULL AND offer.status = \'Pending\') < 3')
    }

    if (sort_by === 'score') {
      // skip sort, offset and limit at this stage, sort will happen after score computation in service level
      return Promise.all([dbQuery.getRawMany().then(users => users.length), dbQuery.getRawMany()])
    } else {
      dbQuery = dbQuery.orderBy(sort_by, sort_order)
      return Promise.all([
        dbQuery.getRawMany().then(users => users.length),
        dbQuery.skip(offset).take(limit).getRawMany()])
    }
  }

  public getTotalNumberOfUsersByClientId = () =>
    getRepository(User, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('user.is_verified = TRUE')
    // .where('client_id = :clientId', { clientId }) //TODO Add client_id to user table
      .select([
        'COUNT(*)',
        'COUNT(*) FILTER (WHERE user.is_test_complete) AS count_test_complete',
      ])
      .getRawOne()

  public getCountOfUsersByDateRange = (startDate: string, endDate: string) =>
    getRepository(User, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('registration_time > :startDate', { startDate })
      .andWhere('registration_time <= :endDate', { endDate })
      .select([
        'COUNT(*)',
        'TO_CHAR(registration_time::DATE, \'YYYY-MM-DD\') AS date',
      ])
      .groupBy('date')
      .getRawMany()
}
