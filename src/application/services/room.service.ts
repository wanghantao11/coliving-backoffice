import { inject, injectable } from 'inversify'
import 'reflect-metadata'

import { ITenancyFilter } from '../../interfaces'
import { AdminMemberNotesDao, ContractDao, LabelDao, OfferDao,
  RoomDao, UserDao, UserPreferencesDao, UserScoreDao } from './../../domain/dao'
import { Room } from './../../domain/entity/room'
import { CONTRACT_STATUS, OFFER_STATUS, ROOM_STATUS } from './../../infrastructure/constants'
import { excludeKeysFromObject } from './../../infrastructure/utils/common'

@injectable()
export class RoomService {
  constructor(
    @inject('AdminMemberNotesDao') private adminMemberNotesDao: AdminMemberNotesDao,
    @inject('LabelDao') private labelDao: LabelDao,
    @inject('RoomDao') private roomDao: RoomDao,
    @inject('ContractDao') private contractDao: ContractDao,
    @inject('OfferDao') private offerDao: OfferDao,
    @inject('UserDao') private userDao: UserDao,
    @inject('UserPreferencesDao') private userPreferencesDao: UserPreferencesDao,
    @inject('UserScoreDao') private userScoreDao: UserScoreDao
  ) {}

  public createRoom = (room: Room) => this.roomDao.createRoom(room)

  public deleteRoom = (id: string) =>
    this.roomDao.getRoomBy({ id: Number(id) })
      .then(room => room && ![ROOM_STATUS.RESERVED, ROOM_STATUS.OCCUPIED].includes(room.status)
        ? this.roomDao.deleteRoom(Number(id))
        : Promise.reject({ message: 'NOT_ALLOWED', reason: `Room ${id} is either reserved or occupied` }))

  public deleteRooms = (ids: number[]) => Promise.all([ids.forEach(id => this.roomDao.deleteRoom(id))])

  public getLabelsByRoomId = (id: string) =>
    this.roomDao.getRoomBy({ id: Number(id) }).then(room => this.labelDao.getLabels(room.label_ids))

  public getPendingOffersSentByAdminByRoomId = (id: string) =>
    this.offerDao.getOffersBy({ is_sent_by_admin: true, roomId: Number(id), status: OFFER_STATUS.PENDING })
      .then(offers => Promise.all(
        offers && offers.length > 0 ? offers.map(({ iduser, created_at, matching_score }) =>
          Promise.all([
            this.userDao.getUserBy({ iduser }),
            this.adminMemberNotesDao.getAdminMemberNotes(iduser)])
            .then(([user, notes]) => this.userPreferencesDao.getUserPreferences(user.user_key)
              .then(({ move_in_date_from, move_in_date_to }) =>
                ({
                  iduser,
                  sent_at: created_at,
                  birthday: user.birthday,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  phone: user.phone,
                  img_url: user.img_url,
                  matching_score,
                  move_in_date_from,
                  move_in_date_to,
                  notes: notes ? notes.description : '',
                })))
        ) : []
      ))

  public getRoom = (id: string) => this.roomDao.getRoomBy({ id: Number(id) })

  public getRooms = (ids: number[]) => this.roomDao.getRoomsBy({ ids })

  public getRoomsByFacadeId = async (id: string, today?: Date) => {
    const rooms = await this.roomDao.getRoomsBy({ facadeId: Number(id) })

    if (!today) { // If date not passed then don't get tenancy for room
      return rooms
    }

    return Promise.all(rooms.map(async room => {
      const tenancy = await this.getTenancyBy({ room_id: room.id, today })

      return {
        ...room,
        has_future_tenants: tenancy.future.length > 0, // If room has future tenants then it's not available
      }
    }))
  }

  public getRoomsWithTenants = (facadeId: number, query: any) =>
    this.roomDao.getRoomsWithTenantsBy({ ...query, facadeId })
      .then(roomsWithTenants =>
        roomsWithTenants.reduce((result, { room_id, users }) =>
          (result[room_id] = users.map(excludeKeysFromObject('password', 'user_key')), result), {}))

  public getRoomsWithTerminatedContracts = (facadeId: number) =>
    this.roomDao.getRoomsWithTerminatedContractsByFacadeId(facadeId).then(roomsAndContracts =>
      roomsAndContracts.reduce((result, { room_id, contracts }) =>
        (result[room_id] = contracts[0], result), {}))

  public getTenancyBy = async (filter: ITenancyFilter) => {
    const today = new Date(filter.today)
    const tenancies = await this.contractDao.getTenancyBy(filter)

    const filteredTenancies = (tenancies || []).filter(tenancy =>
      [CONTRACT_STATUS.ACTIVE, CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED].includes(tenancy.status) ||
      (tenancy.status === CONTRACT_STATUS.TERMINATED && tenancy.end_date > today))

    const tenants = { current: [], future: [] }

    await Promise.all(filteredTenancies.map(async tenant => {
      try {
        tenant.contracts = await this.contractDao.getContractsBy({
          iduser: tenant.iduser,
          status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE],
        })
      } catch {
        tenant.contracts = []
      }

      if (tenant.start_date <= today || filteredTenancies.length === 1) {
        tenants.current.push(tenant)
      } else {
        tenants.future.push(tenant)
      }

      return tenant
    }))

    return tenants
  }

  public updateRoom = (id: string, data: Partial<Room>) => this.roomDao.updateRoomBy({ id: Number(id) }, data)
}
