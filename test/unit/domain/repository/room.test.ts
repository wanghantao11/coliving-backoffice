import 'reflect-metadata'
import { cleanUpMetadata } from 'inversify-express-utils'

import {
  AddressRepository,
  ClientRepository,
  RoomRepository,
  ProjectFacadeRepository
} from './../../../../src/domain/repository'
import { AddressDao, ProjectFacadeDao, ClientDao, RoomDao } from './../../../../src/domain/dao'
import { Address, ProjectFacade, Client, Room } from './../../../../src/domain/entity'

import { db } from '../../../'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('testing the Room', () => {
  const roomDao: RoomDao = new RoomRepository()
  const addressDao: AddressDao = new AddressRepository()
  const projectFacadeDao: ProjectFacadeDao = new ProjectFacadeRepository()
  const clientDao: ClientDao = new ClientRepository()

  const clientData = {
    name: 'Welive AB',
    org_no: '5555-555',
    type: 'admin',
    email: 'admin@ddd.se',
    phone: '319-816-2476',
    country: 'Sweden',
  }

  beforeEach(async done => {
    try {
      const repo = await db.getRepo<Room>(Room)
      await repo.query('DELETE FROM room;')
      const projectFacadeRepo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await projectFacadeRepo.query('DELETE FROM project_facade;')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const addressRepo = await db.getRepo<Address>(Address)
      await addressRepo.query('DELETE FROM address;')
    } finally {
      cleanUpMetadata()
      done()
    }
  })

  afterEach(async done => {
    try {
      const repo = await db.getRepo<Room>(Room)
      await repo.query('DELETE FROM room;')
      const projectFacadeRepo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await projectFacadeRepo.query('DELETE FROM project_facade;')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const addressRepo = await db.getRepo<Address>(Address)
      await addressRepo.query('DELETE FROM address;')
    } finally {
      cleanUpMetadata()
      done()
      redisClient.quit(done)
    }
  })

  it('should create an room object', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const projectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE 1',
      address: 'Brommavägen 22',
      post_area: 'Stockholm',
    })
    const savedAcc = await projectFacadeDao.createProjectFacade(projectFacade)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const room = await Room.generateRoom({
      address_id: savedAddress.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })
    const actual = await roomDao.createRoom(room)

    expect(actual).toBeInstanceOf(Object)
    expect(actual.id).toBe(1)
  })

  it('should update an already stored room', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const projectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE 2',
      address: 'Högdalensv 21',
      post_area: 'Stockholm',
    })
    const savedAcc = await projectFacadeDao.createProjectFacade(projectFacade)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const expected = await Room.generateRoom({
      address_id: savedAddress.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })
    const savedRoom = await roomDao.createRoom(expected)
    expect(savedRoom).toBeInstanceOf(Object)

    const actual = await roomDao.updateRoomBy({ id: savedRoom.id }, { number: '123', rent: 6000 })

    expect(actual.number).not.toBe(1)
    expect(actual.rent).toBe(6000)
  })

  it('should find already stored room', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const projectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE 3',
      address: 'Högdalensv 21',
      post_area: 'Stockholm',
    })
    const savedAcc = await projectFacadeDao.createProjectFacade(projectFacade)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const expected = await Room.generateRoom({
      address_id: savedAddress.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })

    const room = await roomDao.createRoom(expected)
    const _room = await roomDao.getRoomBy({ id: room.id })

    expect(_room.id).toBe(room.id)
  })

  it('should find already stored rooms', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const projectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE 4',
      address: 'Högdalensv 21',
      post_area: 'Stockholm',
    })
    const savedAcc = await projectFacadeDao.createProjectFacade(projectFacade)

    const address = await Address.generateAddress({
      facade_id: savedAcc.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const savedAddress = await addressDao.createAddress(address)

    const expected = await Room.generateRoom({
      address_id: savedAddress.id,
      facade_id: savedAcc.id,
      number: '1301',
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })
    const savedRoom = await roomDao.createRoom(expected)

    const rooms = await roomDao.getRoomsBy({ facadeId: savedAcc.id })

    expect(rooms).toBeInstanceOf(Array)
    expect(rooms.length).toBe(1)
  })
})
