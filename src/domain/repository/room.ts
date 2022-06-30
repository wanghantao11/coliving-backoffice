import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { RoomDao } from './../../domain/dao/room.dao'
import { Room, Apartment, Contract, Offer, User, UserScore, ProjectFacade } from './../../domain/entity'
import { ROOM_STATUS, CONTRACT_STATUS } from './../../infrastructure/constants'
import { convertDateToISOString } from './../../infrastructure/utils/common'
import { IRoomFilter } from './../../interfaces'

@injectable()
export class RoomRepository implements RoomDao {
  private readonly REPO_NAME = 'room'

  public createRoom = (room: Room): Promise<Room> =>
    getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Room)
      .values({ ...room })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteRoom = (id: number) =>
    getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id', { id })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public getRoomBy = (filter: IRoomFilter): Promise<Room> => {
    const { id } = filter
    const queries = []
    if (id) {
      queries.push(`room.id = '${id}'`)
    }
    return getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoin(Apartment, 'apartment', 'room.apartment_id = apartment.id')
      .select([
        '\"room\".id',
        'address_id',
        'apartment.id AS apartment_id',
        'apartment.name AS apartment_name',
        'apartment_plan_uri',
        '\"room\".created_at',
        '\"room\".facade_id',
        'has_private_bathroom',
        'has_private_kitchen',
        'has_private_toilet',
        'floor_no',
        'is_suitable_for_disability',
        'label_ids',
        'move_in_date',
        '\"room\".name',
        'notes',
        'number',
        'people_per_room',
        'rent',
        'service_fee',
        'shared_area_size',
        'size',
        'status',
        '\"room\".updated_at',
      ])
      .where(queries.join(' AND '))
      .getRawOne()
  }

  public getRoomsBy = (filter: IRoomFilter): Promise<Room[]> => {
    const { ids = [], facadeId, apartmentIds = [], status } = filter
    const queries = []
    if (ids.length !== 0) {
      queries.push(`room.id = ANY('{${ids.join(',')}}')`)
    }
    if (facadeId) {
      queries.push(`room.facade_id = '${facadeId}'`)
    }
    if (apartmentIds.length !== 0) {
      queries.push(`room.apartment_id = ANY('{${apartmentIds.join(',')}}')`)
    }
    if (status) {
      queries.push(`room.status = '${status}'`)
    }
    return getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where(queries.join(' AND '))
      .getMany()
  }

  public updateRoomBy = (filter: IRoomFilter, data: Partial<Room>): Promise<Room> => {
    const { id } = filter
    const queries = []
    if (id) {
      queries.push(`room.id = '${id}'`)
    }
    return getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where(queries.join(' AND '))
      .returning('*')
      .execute()
      .then(res => res.raw[0])
  }

  public getRoomsWithTenantsBy = (query: any) => {
    const {
      facadeId,
      status,
      label_ids,
      people_per_room,
      name,
      room_number,
      prefix,
    } = query
    // tenant implies that contract has to be active
    const queries = [`contract.status = '${CONTRACT_STATUS.ACTIVE}'`]
    if (facadeId) {
      queries.push(`contract.facade_id = ${facadeId}`)
    }
    if (status) {
      queries.push(`room.status = '${status}'`)
    }
    if (label_ids) {
      queries.push(`label_ids @> '{${label_ids.join(',')}}'::int[]`)
    }
    if (people_per_room) {
      queries.push(`people_per_room = ${people_per_room}`)
    }
    if (name) {
      queries.push(`room.name = '${name.trim()}'`)
    }
    if (room_number) {
      queries.push(`number = '${room_number}'`)
    }
    if (prefix) {
      queries.push(`(first_name ilike '%${prefix}%' OR last_name ilike '%${prefix}%')`)
    }
    return getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoin(Contract, 'contract', 'room.id = contract.room_id')
      .leftJoin(User, 'user', 'user.iduser = contract.iduser')
      .select([
        'json_agg("user") FILTER (WHERE "user".iduser = contract.iduser) AS users',
        'room.id',
      ])
      .groupBy('room.id')
      .where(queries.join(' AND '))
      .getRawMany()
  }

  public getUserScoresForTenantsAndCandidatesByRoomIds = (ids: number[]): Promise<any> => {
    const selectedFields = [
      'user.iduser as iduser',
      'apartment_id',
      'room.id',
      'agreeableness',
      'conscientiousness',
      'emotional_stability',
      'extroversion',
      'openness',
      'activity',
      'conformity',
      'engagement',
      'hedonism',
      'humanism',
      'performance',
      'power',
      'safety',
      'tradition']

    const candidatesPromise = getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoinAndSelect(Offer, 'offer', 'room.id = offer.room_id AND offer.status= \'Accepted\'')
      .innerJoinAndSelect(User, 'user', 'offer.iduser = user.iduser AND user.user_type = \'Candidate\' AND user.is_test_complete = TRUE')
      .innerJoinAndSelect(UserScore, 'user_score', 'user.iduser = user_score.iduser')
      .where(`room.id = ANY('{${ids.join(',')}}'::int[])`)
      .select(selectedFields)
      .getRawMany()

    const tenantsPromise = getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(Contract, 'contract', 'room.id = contract.room_id AND contract.status= \'Active\'')
      .innerJoin(User, 'user', 'contract.iduser = user.iduser AND user.user_type = \'Tenant\' AND user.is_test_complete = TRUE')
      .innerJoin(UserScore, 'user_score', 'user.iduser = user_score.iduser')
      .where(`room.id = ANY('{${ids.join(',')}}'::int[])`)
      .select(selectedFields)
      .getRawMany()

    const potentialTenantsPromise = getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(Contract, 'contract', 'room.id = contract.room_id AND contract.status= \'Signed\'')
      .innerJoin(User, 'user', 'contract.iduser = user.iduser AND user.user_type = \'Candidate\' AND user.is_test_complete = TRUE')
      .innerJoin(UserScore, 'user_score', 'user.iduser = user_score.iduser')
      .where(`room.id = ANY('{${ids.join(',')}}'::int[])`)
      .select(selectedFields)
      .getRawMany()

    return Promise.all([candidatesPromise, tenantsPromise, potentialTenantsPromise])
      .then(([candidates, tenants, potentialTenants]) => ([...candidates, ...tenants, ...potentialTenants]))
  }

  public getRoomStatisticsByClientId = (clientId: number) =>
    getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(ProjectFacade, 'project_facade', `project_facade.client_id = '${clientId}'`)
      .where('room.facade_id = project_facade.id')
      .select([
        'facade_id',
        'COUNT(*) AS number_of_total_rooms',
        `COUNT(*) FILTER (WHERE room.status = '${ROOM_STATUS.AVAILABLE}') AS number_of_available_rooms`,
      ])
      .groupBy('facade_id')
      .getRawMany()

  public getRoomsWithTerminatedContractsByFacadeId = (facadeId: number) =>
    getRepository(Room, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoin(Contract, 'contract', 'contract.room_id = room.id')
      .select([
        'json_agg(contract) FILTER (WHERE contract.room_id = room.id) AS contracts',
        'room.id',
      ])
      .groupBy('room.id')
      .where(`contract.facade_id = ${facadeId} AND contract.status = '${CONTRACT_STATUS.TERMINATED}' AND contract.end_date >= '${convertDateToISOString(new Date()).split('T')[0]}'`)
      .getRawMany()
}
