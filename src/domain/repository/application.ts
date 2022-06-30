import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { ApplicationDao } from './../../domain/dao'
import {
  AdminMemberNotes, Application, ProjectFacade, User, UserPreferences
} from './../../domain/entity'
import { USER_TYPE } from '../../infrastructure/constants/user'
import { convertDateToISOString } from '../../infrastructure/utils/common'

@injectable()
export class ApplicationRepo implements ApplicationDao {
  private readonly REPO_NAME = 'application'

  public createApplication = (application: Application) =>
    getRepository(Application, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Application)
      .values({ ...application })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteApplication = (facadeId: number, iduser: string) =>
    getRepository(Application, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('iduser = :iduser AND facade_id = :facadeId', { iduser, facadeId })
      .delete()
      .execute()

  public getCountOfApplicationsByDateRange = (startDate: string, endDate: string) =>
    getRepository(Application, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(ProjectFacade, 'project_facade', 'project_facade.id = application.facade_id')
      .leftJoinAndSelect(User, 'user', 'user.iduser = application.iduser')
      .where('application.created_at > :startDate', { startDate })
      .andWhere('application.created_at <= :endDate', { endDate })
      .select([
        'COUNT(*)',
        'COUNT(*) FILTER (WHERE user.is_test_complete) AS count_test_complete',
        'project_facade.name AS facade_name',
        'TO_CHAR(application.created_at::DATE, \'YYYY-MM-DD\') AS date',
        'project_facade.id AS facade_id',
      ])
      .groupBy('project_facade.id, date')
      .getRawMany()

  public getInterestedMembers = (query: any) => {
    const { facade_id, email, name, subscribed_from, subscribed_to, tag_ids,
      offset, limit, sort_by = 'subscribed_at', sort_order = 'DESC' } = query

    const filterQuery = [`user.user_type = '${USER_TYPE.LIGHT}'`]

    if (facade_id) {
      filterQuery.push(`application.facade_id = ${facade_id}`)
    }

    if (email) {
      filterQuery.push(`(user.email ilike '%${email}%')`)
    }

    if (name) {
      filterQuery.push(`(user.first_name ilike '%${name}%' OR user.last_name ilike '%${name}%')`)
    }

    if (subscribed_from) {
      filterQuery.push(`application.created_at >= '${convertDateToISOString(new Date(subscribed_from))}'`)
    }

    if (subscribed_to) {
      filterQuery.push(`application.created_at < '${convertDateToISOString(new Date(subscribed_to))}'`)
    }

    if (tag_ids) {
      filterQuery.push(`adminMemberNotes.tag_ids @> '{${tag_ids.join(',')}}'::int[]`)
    }

    const dbQuery = getRepository(Application, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(User, 'user', 'user.iduser = application.iduser')
      .innerJoin(UserPreferences, 'userPreferences', 'user.user_key = userPreferences.iduser')
      .leftJoin(AdminMemberNotes, 'adminMemberNotes', 'adminMemberNotes.iduser = application.iduser')
      .select([
        'user.iduser as iduser',
        'application.created_at AS subscribed_at',
        'adminMemberNotes.description AS notes',
        '\"user\".first_name',
        '\"user\".last_name',
        '\"user\".img_url',
        '\"user\".birthday',
        '\"user\".user_type',
        '\"userPreferences\".move_in_date_from',
        '\"userPreferences\".move_in_date_to',
      ])
      .where(filterQuery.join(' AND '))
      .orderBy(sort_by, sort_order)

    return Promise.all([
      dbQuery.getRawMany().then(members => members.length),
      dbQuery.offset(offset).limit(limit).getRawMany()])
  }

  public getMemberApplications = (query: Partial<Application>): Promise<Application[]> => {
    const queries = []
    const { iduser, facade_id, client_id } = query

    if (iduser) {
      queries.push(`iduser = '${iduser}'`)
    }
    if (facade_id) {
      queries.push(`facade_id = '${facade_id}'`)
    }
    if (client_id) {
      queries.push(`client_id = '${client_id}'`)
    }

    return getRepository(Application, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where(queries.join(' AND '))
      .getMany()
  }

  public getTotalNumberOfSubscribersByClientId = (clientId: number) =>
    getRepository(Application, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoinAndSelect(User, 'user', 'user.iduser = application.iduser')
      .where('application.client_id = :clientId', { clientId })
      .select([
        'COUNT(DISTINCT application.iduser)',
        'COUNT(DISTINCT application.iduser) FILTER (WHERE user.is_test_complete) AS count_test_complete',
      ])
      .getRawOne()
}
