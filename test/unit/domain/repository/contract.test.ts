import 'reflect-metadata'
import { cleanUpMetadata } from 'inversify-express-utils'

import {
  AddressRepository,
  ClientRepository,
  ContractRepository,
  ProjectFacadeRepository,
  RoomRepository,
  UserRepository
} from './../../../../src/domain/repository'
import { AddressDao, ClientDao, ContractDao, ProjectFacadeDao, RoomDao, UserDao } from './../../../../src/domain/dao'
import { Address, Client, Contract, ProjectFacade, Room, User } from './../../../../src/domain/entity'

import { CONTRACT_STATUS } from './../../../../src/infrastructure/constants'

import { db } from '../../../'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('testing the Room', () => {
  const addressDao: AddressDao = new AddressRepository()
  const clientDao: ClientDao = new ClientRepository()
  const userDao: UserDao = new UserRepository()
  const projectFacadeDao: ProjectFacadeDao = new ProjectFacadeRepository()
  const roomDao: RoomDao = new RoomRepository()
  const contractDao: ContractDao = new ContractRepository()

  const clientData = {
    name: 'Welive AB',
    org_no: '5555-555',
    type: 'admin',
    email: 'admin@ddd.se',
    phone: '319-816-2476',
    country: 'Sweden',
  }

  const userData = {
    iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90',
    first_name: 'First name',
    last_name: 'Last name',
    description: 'I am just a test user',
    tos_version_accepted: 1,
    user_type: 'Light',
    birthday: new Date('1991-01-01'),
    registration_time: new Date('2018-08-08'),
    email: 'fake@fafake.fake',
  }

  beforeEach(async done => {
    try {
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const contractRepo = await db.getRepo<Contract>(Contract)
      await contractRepo.query('DELETE FROM contract;')
      const projectFacadeRepo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await projectFacadeRepo.query('DELETE FROM project_facade;')
      const roomRepo = await db.getRepo<Room>(Room)
      await roomRepo.query('DELETE FROM room;')
      const userRepo = await db.getRepo<User>(User)
      await userRepo.query('DELETE FROM "user";')
      const addressRepo = await db.getRepo<Address>(Address)
      await addressRepo.query('DELETE FROM address;')
    } finally {
      cleanUpMetadata()
      done()
    }
  })

  afterEach(async done => {
    try {
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const contractRepo = await db.getRepo<Contract>(Contract)
      await contractRepo.query('DELETE FROM contract;')
      const projectFacadeRepo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await projectFacadeRepo.query('DELETE FROM project_facade;')
      const roomRepo = await db.getRepo<Room>(Room)
      await roomRepo.query('DELETE FROM room;')
      const userRepo = await db.getRepo<User>(User)
      await userRepo.query('DELETE FROM "user";')
      const addressRepo = await db.getRepo<Address>(Address)
      await addressRepo.query('DELETE FROM address;')
    } finally {
      cleanUpMetadata()
      done()
      redisClient.quit(done)
    }
  })

  it('should create an contract object', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user: User = await User.generateUser({ ...userData, client_id: savedClient.id })
    const createdUser = await userDao.createUser(user)

    const projectFacade: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      post_area: 'Stockholm',
    })
    const createdProjectFacade = await projectFacadeDao.createProjectFacade(projectFacade)

    const address = await Address.generateAddress({
      facade_id: createdProjectFacade.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const createdAddress = await addressDao.createAddress(address)

    const room = await Room.generateRoom({
      facade_id: createdProjectFacade.id,
      number: '1301',
      address_id: createdAddress.id,
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })
    const createdRoom = await roomDao.createRoom(room)

    const contract = await Contract.generateContract({
      iduser: createdUser.iduser,
      room_id: createdRoom.id,
      facade_id: createdProjectFacade.id,
      status: CONTRACT_STATUS.PENDING,
    })
    const createdContract = await contractDao.createContract(contract)

    expect(createdContract).toBeInstanceOf(Object)
    expect(createdContract.status).toBe(CONTRACT_STATUS.PENDING)
    expect(createdContract.room_id).toBe(createdRoom.id)
  })

  it('should update an already stored contract', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user: User = await User.generateUser({ ...userData, client_id: savedClient.id })
    const createdUser = await userDao.createUser(user)

    const projectFacade: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient,
      name: 'COLIVE Högdalen',
      post_area: 'Stockholm',
    })
    const createdProjectFacade = await projectFacadeDao.createProjectFacade(projectFacade)

    const address = await Address.generateAddress({
      facade_id: createdProjectFacade.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const createdAddress = await addressDao.createAddress(address)

    const room = await Room.generateRoom({
      facade_id: createdProjectFacade.id,
      number: '1301',
      address_id: createdAddress.id,
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })
    const createdRoom = await roomDao.createRoom(room)

    const contract = await Contract.generateContract({
      iduser: createdUser.iduser,
      room_id: createdRoom.id,
      facade_id: createdProjectFacade.id,
      status: CONTRACT_STATUS.PENDING,
    })

    const createdContract = await contractDao.createContract(contract)

    const updatedContract = await contractDao.updateContractBy({ id: createdContract.id }, { status: CONTRACT_STATUS.SIGNED, external_id: 200 })

    expect(updatedContract.status).not.toBe(CONTRACT_STATUS.PENDING)
    expect(updatedContract.external_id).toBe(200)
  })

  it('should find ongoing contracts by room id', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user: User = await User.generateUser({ ...userData, client_id: savedClient.id })
    const createdUser = await userDao.createUser(user)

    const projectFacade: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      post_area: 'Stockholm',
    })
    const createdProjectFacade = await projectFacadeDao.createProjectFacade(projectFacade)

    const address = await Address.generateAddress({
      facade_id: createdProjectFacade.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const createdAddress = await addressDao.createAddress(address)

    const room = await Room.generateRoom({
      facade_id: createdProjectFacade.id,
      number: '1301',
      address_id: createdAddress.id,
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })
    const createdRoom = await roomDao.createRoom(room)

    const contract = await Contract.generateContract({
      iduser: createdUser.iduser,
      room_id: createdRoom.id,
      facade_id: createdProjectFacade.id,
      status: CONTRACT_STATUS.PENDING,
    })

    const createdContract = await contractDao.createContract(contract)

    const fetchedContracts = await contractDao.getContractsBy({ roomIds: [createdRoom.id], status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE] })

    expect(fetchedContracts.length).toBe(1)
    expect(fetchedContracts[0].status).toBe(CONTRACT_STATUS.PENDING)
  })

  it('should not find inactive contracts by room id', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user: User = await User.generateUser({ ...userData, client_id: savedClient.id })
    const createdUser = await userDao.createUser(user)

    const projectFacade: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      post_area: 'Stockholm',
    })
    const createdProjectFacade = await projectFacadeDao.createProjectFacade(projectFacade)

    const address = await Address.generateAddress({
      facade_id: createdProjectFacade.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const createdAddress = await addressDao.createAddress(address)

    const room = await Room.generateRoom({
      facade_id: createdProjectFacade.id,
      number: '1301',
      address_id: createdAddress.id,
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })
    const createdRoom = await roomDao.createRoom(room)

    const contract = await Contract.generateContract({
      iduser: createdUser.iduser,
      room_id: createdRoom.id,
      facade_id: createdProjectFacade.id,
      status: CONTRACT_STATUS.TERMINATED,
    })

    const createdContract = await contractDao.createContract(contract)

    const fetchedContracts = await contractDao.getContractsBy({ roomIds: [createdRoom.id], status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE] })
    expect(fetchedContracts.length).toBe(0)
  })

  it('should find all contracts by room ids', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user: User = await User.generateUser({ ...userData, client_id: savedClient.id })
    const createdUser = await userDao.createUser(user)

    const projectFacade: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      post_area: 'Stockholm',
    })
    const createdProjectFacade = await projectFacadeDao.createProjectFacade(projectFacade)

    const address = await Address.generateAddress({
      facade_id: createdProjectFacade.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const createdAddress = await addressDao.createAddress(address)

    const room = await Room.generateRoom({
      facade_id: createdProjectFacade.id,
      number: '1301',
      address_id: createdAddress.id,
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })
    const createdRoom = await roomDao.createRoom(room)

    const room2 = await Room.generateRoom({
      facade_id: createdProjectFacade.id,
      number: '1302',
      address_id: createdAddress.id,
      size: 15,
      rent: 7000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })
    const createdRoom2 = await roomDao.createRoom(room2)

    const contract = await Contract.generateContract({
      iduser: createdUser.iduser,
      room_id: createdRoom.id,
      facade_id: createdProjectFacade.id,
      status: CONTRACT_STATUS.TERMINATED,
    })
    await contractDao.createContract(contract)

    const contract2 = await Contract.generateContract({
      iduser: createdUser.iduser,
      room_id: createdRoom2.id,
      facade_id: createdProjectFacade.id,
      status: CONTRACT_STATUS.PENDING,
    })

    await contractDao.createContract(contract2)

    const fetchedContracts = await contractDao.getContractsBy({ roomIds: [createdRoom.id, createdRoom2.id], status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.TERMINATED] })
    expect(fetchedContracts.length).toBe(2)
  })

  it('should find the ongoing contract by iduser', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user: User = await User.generateUser({ ...userData, client_id: savedClient.id })
    const createdUser = await userDao.createUser(user)

    userData.email = 'fake2@fake.se'
    userData.iduser = 'U9iqIePQ6mdlMxZ1NLbiDehIKg91'
    const user2: User = await User.generateUser({ ...userData, client_id: savedClient.id })
    const createdUser2 = await userDao.createUser(user2)

    const projectFacade: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      post_area: 'Stockholm',
    })
    const createdProjectFacade = await projectFacadeDao.createProjectFacade(projectFacade)

    const address = await Address.generateAddress({
      facade_id: createdProjectFacade.id,
      careof: 'Driver',
      city: 'Stockholm',
      country: 'Sweden',
      street: '85819 Fay Ridges',
      zip: '12222',
    })
    const createdAddress = await addressDao.createAddress(address)

    const room = await Room.generateRoom({
      facade_id: createdProjectFacade.id,
      number: '1301',
      address_id: createdAddress.id,
      size: 10,
      rent: 5000,
      service_fee: 2000,
      shared_area_size: 100,
      is_suitable_for_disability: true,
      people_per_room: 2,
    })
    const createdRoom = await roomDao.createRoom(room)

    const contract = await Contract.generateContract({
      iduser: createdUser.iduser,
      room_id: createdRoom.id,
      facade_id: createdProjectFacade.id,
      status: CONTRACT_STATUS.PENDING,
      external_id: 1,
    })
    await contractDao.createContract(contract)

    const contract2 = await Contract.generateContract({
      iduser: createdUser2.iduser,
      room_id: createdRoom.id,
      facade_id: createdProjectFacade.id,
      status: CONTRACT_STATUS.PENDING,
      external_id: 1,
    })
    await contractDao.createContract(contract2)

    const fetchedContracts = await contractDao.getContractsBy({ externalId: 1, status: [CONTRACT_STATUS.PENDING, CONTRACT_STATUS.SIGNED, CONTRACT_STATUS.ACTIVE]  })
    expect(fetchedContracts.length).toBe(2)
  })
})
