import { injectable } from 'inversify'
import { isBoolean } from 'lodash'
import { getRepository } from 'typeorm'

import { OfferDao } from './../../domain/dao'
import {
  Address, AdminMemberNotes, Apartment, ContractTemplates,
  Offer, ProjectFacade, ProjectFacadeBilling, Project,
  Room, User, UserPreferences
} from './../../domain/entity'
import { OFFER_STATUS } from './../../infrastructure/constants'
import { convertDateToISOString } from './../../infrastructure/utils/common'
import { IContractData, IOfferFilter } from './../../interfaces'

@injectable()
export class OfferRepository implements OfferDao {
  private readonly REPO_NAME = 'offer'

  public createOffer = (offer: Partial<Offer>): Promise<Offer> =>
    getRepository(Offer, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Offer)
      .values({ ...offer })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public createOffersForPair = (
    iduser: string,
    preferred_roommate_iduser: string,
    room_id: number,
    facade_id: number,
    is_preferences_matched: boolean
  ): Promise<Offer> =>
    getRepository(Offer, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Offer)
      .values([{ iduser, room_id, facade_id, is_preferences_matched },
        { iduser: preferred_roommate_iduser, room_id, facade_id, is_preferences_matched }])
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public getOfferBy = (filter: IOfferFilter): Promise<Offer> => {
    const { id, iduser, status } = filter
    const queries = []
    if (id) {
      queries.push(`offer.id = '${id}'`)
    }
    if (iduser) {
      queries.push(`offer.iduser = '${iduser}'`)
    }
    if (status) {
      queries.push(`offer.status = '${status}'`)
    }

    return getRepository(Offer, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where(queries.join(' AND '))
      .getOne()
  }

  public getOffersBy = (filter: IOfferFilter): Promise<Offer[]> => {
    const { iduser, is_sent_by_admin, roomId, status } = filter
    const queries = []

    if (iduser) {
      queries.push(`offer.iduser = '${iduser}'`)
    }
    if (is_sent_by_admin) {
      queries.push(`offer.is_sent_by_admin = ${is_sent_by_admin}`)
    }
    if (roomId) {
      queries.push(`offer.room_id = '${roomId}'`)
    }
    if (status) {
      queries.push(`offer.status = '${status}'`)
    }

    return getRepository(Offer, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where(queries.join(' AND '))
      .getMany()
  }

  public getOffersCountBy = (filter: IOfferFilter): Promise<number> => {
    const { iduser, roomId, status } = filter
    const queries = []

    if (iduser) {
      queries.push(`offer.iduser = '${iduser}'`)
    }
    if (roomId) {
      queries.push(`offer.room_id = '${roomId}'`)
    }
    if (status) {
      queries.push(`offer.status = '${status}'`)
    }

    return getRepository(Offer, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where(queries.join(' AND '))
      .getCount()
  }

  public getPendingOfferMembers = (query: any) => {
    const { facade_id, email, name, sent_from, sent_to, tag_ids,
      offset, limit, sort_by = 'sent_at', sort_order = 'DESC' } = query

    const filterQuery = [`offer.status = '${OFFER_STATUS.PENDING}'`]
    if (facade_id) {
      filterQuery.push(`offer.facade_id = ${facade_id}`)
    }

    if (email) {
      filterQuery.push(`(user.email ilike '%${email}%')`)
    }

    if (name) {
      filterQuery.push(`(user.first_name ilike '%${name}%' OR user.last_name ilike '%${name}%')`)
    }

    if (sent_from) {
      filterQuery.push(`offer.created_at >= '${convertDateToISOString(new Date(sent_from))}'`)
    }

    if (sent_to) {
      filterQuery.push(`offer.created_at < '${convertDateToISOString(new Date(sent_to))}'`)
    }

    if (tag_ids) {
      filterQuery.push(`adminMemberNotes.tag_ids @> '{${tag_ids.join(',')}}'::int[]`)
    }

    const dbQuery = getRepository(Offer, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(User, 'user', 'user.iduser = offer.iduser')
      .innerJoin(UserPreferences, 'userPreferences', 'user.user_key = userPreferences.iduser')
      .leftJoin(AdminMemberNotes, 'adminMemberNotes', 'adminMemberNotes.iduser = offer.iduser')
      .leftJoin(Room, 'room', 'room.id = offer.room_id')
      .leftJoin(Apartment, 'apartment', 'apartment.id = room.apartment_id')
      .select([
        'offer.iduser AS iduser',
        'offer.created_at AS sent_at',
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

  public updateOfferBy = (filter: IOfferFilter, data: Partial<Offer>) => {
    const { id, iduser, roomId } = filter
    const queries = []
    if (id) {
      queries.push(`offer.id = '${id}'`)
    }
    if (iduser) {
      queries.push(`offer.iduser = '${iduser}'`)
    }
    if (roomId) {
      queries.push(`offer.room_id = '${roomId}'`)
    }

    return getRepository(Offer, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where(queries.join(' AND '))
      .returning('*')
      .execute()
      .then(res => res.raw[0])
  }

  public getContractDataByRoomIdAndExternalIds = (id: number, idusers: string[]): Promise<IContractData[]> =>
    getRepository(Offer, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(User, 'user', 'user.iduser = offer.iduser')
      .innerJoin(UserPreferences, 'user_preferences', 'user_preferences.iduser = user.user_key')
      .innerJoin(Room, 'room', 'room.id = offer.room_id')
      .innerJoin(Project, 'project', 'project.facade_id = room.facade_id')
      .innerJoin(ProjectFacade, 'project_facade', 'project_facade.id = room.facade_id')
      .innerJoin(ProjectFacadeBilling, 'project_facade_billing', 'project_facade_billing.facade_id = room.facade_id')
      .innerJoin(ContractTemplates, 'contract_templates', 'contract_templates.facade_id = room.facade_id')
      .innerJoin(Address, 'address', 'address.id = room.address_id')
      .where('offer.room_id = :id AND offer.iduser IN (:...idusers)', { id, idusers })
      .select([
        // user
        'user.iduser as iduser',
        'first_name',
        'last_name',
        'email',
        'phone',
        // userPreferences
        'user_preferences.move_in_date_from as user_move_in_date',
        // project
        'project.city as post_area',
        // projectFacade
        'project_facade.name as project_name',
        'project_facade.id as facade_id',
        'is_auto_offer_flow',
        'landlord_name',
        'landlord_email',
        'landlord_org_no',
        'landlord_street',
        'landlord_zip',
        'landlord_post_area',
        'property_unit_designation',
        'coliving_hub',
        // projectFacadeBilling
        'bankgiro_no',
        'deposit',
        'deposit_refund_weeks',
        'rent_yearly_increase_rate',
        'rent_yearly_increase_date',
        'rent_day_of_month',
        'service_fee_day_of_month',
        // contractTemplates
        'extra_fields',
        // room
        'room.id',
        'number',
        'people_per_room',
        'size',
        'shared_area_size',
        'floor_no',
        'address.street as street',
        'address.zip as zip',
        'rent',
        'room.move_in_date as room_move_in_date',
        'room.service_fee as service_fee',
        // collection
        'collection_id'])
      .getRawMany()

  public deleteOffersBy = (filter: IOfferFilter) => {
    const queries = []
    const { iduser, facade_id, status, is_sent_by_admin } = filter
    if (iduser) {
      queries.push(`offer.iduser = '${iduser}'`)
    }
    if (facade_id) {
      queries.push(`offer.facade_id = '${facade_id}'`)
    }
    if (status) {
      queries.push(`offer.status = '${status}'`)
    }
    if (isBoolean(is_sent_by_admin)) {
      queries.push(`offer.is_sent_by_admin = ${is_sent_by_admin}`)
    }

    return getRepository(Offer, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where(queries.join(' AND '))
      .execute()
  }
}
