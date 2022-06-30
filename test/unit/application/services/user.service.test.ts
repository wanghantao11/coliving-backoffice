import * as dotenv from 'dotenv'
dotenv.config()

import { ClientRepository, UserRepository, TransactionRepository, ContractRepository } from './../../../../src/domain/repository'
import { ClientDao, UserDao, TransactionDao, ContractDao } from './../../../../src/domain/dao'
import { UserService } from './../../../../src/application/services/user.service'
import { Client, User } from './../../../../src/domain/entity'

import { cleanUpMetadata } from 'inversify-express-utils'
import { db } from '../../../'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('test the user service', () => {
  const clientDao: ClientDao = new ClientRepository()
  const userDao: UserDao = new UserRepository()
  const transactionDao: TransactionDao = new TransactionRepository()
  const contractDao: ContractDao = new ContractRepository()
  const userService = new UserService(userDao, transactionDao, contractDao)

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
    email: 'test@thisisfake.colive.se',
    first_name: 'First name',
    last_name: 'Last name',
    description: 'I am just a test user',
    tos_version_accepted: 1,
    user_type: 'Light',
    birthday: new Date('1991-01-01'),
    registration_time: new Date('2018-08-08'),
  }

  beforeEach(async done => {
    try {
      const repo = await db.getRepo<User>(User)
      await repo.query('DELETE FROM "user";')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
    } finally {
      cleanUpMetadata()
      done()
    }
  })

  afterEach(async done => {
    try {
      const repo = await db.getRepo<User>(User)
      await repo.query('DELETE FROM "user";')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
    } finally {
      cleanUpMetadata()
      done()
      redisClient.quit(done)
    }
  })

  it('should save data with the service and create a user object and save it in db', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const expected = await User.generateUser({ ...userData, client_id: savedClient.id })
    await userService.createUser(expected)
    const actual = await userDao.getUserBy({ iduser: userData.iduser })
    expect(actual.first_name).toEqual(expected.first_name)
    expect(actual.last_name).toEqual(expected.last_name)
    expect(actual.user_type).toBe('Light')
  })

  it('should update a user object and save it in db', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const expected = await User.generateUser({ ...userData, client_id: savedClient.id })
    const user = await userService.createUser(expected)
    const dataToUpdate = {
      last_name: 'New last name',
      tos_version_accepted: 0,
    }
    const actual = await userService.updateUserByExternalId(expected.iduser, dataToUpdate)

    expect(actual.first_name).toEqual(expected.first_name)
    expect(actual.last_name).toEqual(dataToUpdate.last_name)
  })
})
