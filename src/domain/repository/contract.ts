import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { ContractDao } from './../../domain/dao'
import {
  AdminMemberNotes, Apartment, Contract, ProjectFacade,
  Room, User, UserPreferences
} from './../../domain/entity'
import { CONTRACT_STATUS } from './../../infrastructure/constants/contract'
import { convertDateToISOString } from './../../infrastructure/utils/common'
import { IContractFilter, ITenancyFilter } from './../../interfaces'

@injectable()
export class ContractRepository implements ContractDao {
  private readonly REPO_NAME = 'contract'

  public createContract = (data: Contract) =>
    getRepository(Contract, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Contract)
      .values(data)
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteContract = (id: number) =>
    getRepository(Contract, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id', { id })
      .execute()

  public getContractBy = (filter: IContractFilter): Promise<Contract> => {
    const { participantId, externalId, iduser, status = [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE] } = filter
    const queries = []
    if (iduser) {
      queries.push(`contract.iduser = '${iduser}'`)
    }
    if (participantId) {
      queries.push(`contract.external_participant_id = '${participantId}'`)
    }
    if (externalId) {
      queries.push(`contract.external_id = '${externalId}'`)
    }
    if (status.length !== 0) {
      queries.push(`contract.status = ANY('{${status.join(',')}}')`)
    }
    return getRepository(Contract, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(User, 'user', 'user.iduser = contract.iduser')
      .select([
        '\"contract\".id',
        '\"contract\".iduser',
        '\"contract\".facade_id',
        '\"contract\".room_id',
        '\"contract\".external_id',
        '\"contract\".external_participant_id',
        '\"contract\".status',
        '\"user\".email as user_email',
        '\"user\".first_name as user_first_name',
        '\"user\".last_name as user_last_name',
      ])
      .where(queries.join(' AND '))
      .getRawOne()
  }

  public getContractsBy = (filter: IContractFilter) => {
    const { roomIds = [], participantId, externalId, iduser, status = [] } = filter
    const queries = []
    if (iduser) {
      queries.push(`contract.iduser = '${iduser}'`)
    }
    if (roomIds.length !== 0) {
      queries.push(`contract.room_id = ANY('{${roomIds.join(',')}}')`)
    }
    if (participantId) {
      queries.push(`contract.external_participant_id = '${participantId}'`)
    }
    if (externalId) {
      queries.push(`contract.external_id = '${externalId}'`)
    }
    if (status.length !== 0) {
      queries.push(`contract.status = ANY('{${status.join(',')}}')`)
    }

    return getRepository(Contract, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(User, 'user', 'user.iduser = contract.iduser')
      .select([
        '\"contract\".id',
        '\"contract\".iduser',
        '\"contract\".end_date',
        '\"contract\".facade_id',
        '\"contract\".room_id',
        '\"contract\".external_id',
        '\"contract\".external_participant_id',
        '\"contract\".start_date',
        '\"contract\".status',
        '\"user\".email as user_email',
        '\"user\".first_name as user_first_name',
        '\"user\".last_name as user_last_name',
        '\"user\".user_type',
      ])
      .where(queries.join(' AND '))
      .getRawMany()
  }

  public getContractMembers = (query: any) => {
    const { facade_id, email, name, sent_from, sent_to, signed_from, signed_to, tag_ids, status,
      offset, limit, sort_by = 'sent_at', sort_order = 'DESC' } = query

    const filterQuery = [`contract.status = '${status}'`]
    if (facade_id) {
      filterQuery.push(`contract.facade_id = ${facade_id}`)
    }

    if (email) {
      filterQuery.push(`(user.email ilike '%${email}%')`)
    }

    if (name) {
      filterQuery.push(`(user.first_name ilike '%${name}%' OR user.last_name ilike '%${name}%')`)
    }

    if (sent_from) {
      filterQuery.push(`contract.created_at >= '${convertDateToISOString(new Date(sent_from))}'`)
    }

    if (sent_to) {
      filterQuery.push(`contract.created_at < '${convertDateToISOString(new Date(sent_to))}'`)
    }

    if (signed_from) {
      filterQuery.push(`contract.signed_at >= '${convertDateToISOString(new Date(signed_from))}'`)
    }

    if (signed_to) {
      filterQuery.push(`contract.signed_at < '${convertDateToISOString(new Date(signed_to))}'`)
    }

    if (tag_ids) {
      filterQuery.push(`adminMemberNotes.tag_ids @> '{${tag_ids.join(',')}}'::int[]`)
    }

    const dbQuery = getRepository(Contract, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(User, 'user', 'user.iduser = contract.iduser')
      .innerJoin(UserPreferences, 'userPreferences', 'user.user_key = userPreferences.iduser')
      .leftJoin(AdminMemberNotes, 'adminMemberNotes', 'adminMemberNotes.iduser = contract.iduser')
      .leftJoin(Room, 'room', 'room.id = contract.room_id')
      .leftJoin(Apartment, 'apartment', 'apartment.id = room.apartment_id')
      .select([
        'contract.iduser AS iduser',
        'contract.created_at AS sent_at',
        'contract.signed_at AS signed_at',
        'room.name AS room_name',
        'apartment.name AS apartment_name',
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

  public getPendingContractsByClientId = (clientId: number) =>
    getRepository(Contract, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(ProjectFacade, 'project_facade', `project_facade.client_id = '${clientId}'`)
      .where(`status = '${CONTRACT_STATUS.PENDING}' AND facade_id = project_facade.id`)
      .select([
        'facade_id',
        'COUNT(*) AS number_of_pending_contracts',
      ])
      .groupBy('facade_id')
      .getRawMany()

  public updateContractBy = (filter: IContractFilter, data: Partial<Contract>) => {
    const { id, participantId } = filter
    const queries = []
    if (id) {
      queries.push(`contract.id = '${id}'`)
    }
    if (participantId) {
      queries.push(`contract.external_participant_id = '${participantId}'`)
    }
    return getRepository(Contract, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where(queries.join(' AND '))
      .returning('*')
      .execute()
      .then(res => res.raw[0])
  }

  public getTenancyBy = (filter: ITenancyFilter) => {
    const { room_id, status = [CONTRACT_STATUS.ACTIVE, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.TERMINATED] } = filter
    const queries = []
    if (room_id) {
      queries.push(`contract.room_id = ${room_id}`)
    }
    if (status.length !== 0) {
      queries.push(`contract.status = ANY('{${status.join(',')}}')`)
    }

    return getRepository(Contract, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(User, 'user', 'user.iduser = contract.iduser')
      .leftJoin(AdminMemberNotes, 'adminMemberNotes', 'adminMemberNotes.iduser = contract.iduser')
      .select([
        '\"adminMemberNotes\".description',
        '\"contract\".id as contract_id',
        '\"contract\".iduser',
        '\"contract\".room_id',
        '\"contract\".start_date',
        '\"contract\".end_date',
        '\"contract\".status',
        '\"user\".email',
        '\"user\".first_name',
        '\"user\".last_name',
        '\"user\".phone',
        '\"user\".img_url',
        '\"user\".user_type',
      ])
      .where(queries.join(' AND '))
      .orderBy('start_date', 'ASC')
      .getRawMany()
  }
}
