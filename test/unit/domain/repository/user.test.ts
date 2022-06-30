import { Client, User } from './../../../../src/domain/entity'
import { ClientDao, UserDao } from './../../../../src/domain/dao'
import { ClientRepository, UserRepository } from './../../../../src/domain/repository'
import { cleanUpMetadata } from 'inversify-express-utils'
import { db } from './../../../'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('testing the user dao', () => {
  const clientDao: ClientDao = new ClientRepository()
  const userDao: UserDao = new UserRepository()

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

  it('should create a user object', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user: User = await User.generateUser({ ...userData, client_id: savedClient.id })
    const actual = await userDao.createUser(user)

    expect(actual.last_name).toBe('Last name')
  })

  it('should not create a user object that has the same email except for the case sensitivity', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user: User = await User.generateUser({ ...userData, client_id: savedClient.id })
    await userDao.createUser(user)
    const user1: User = await User.generateUser(Object.assign(user, { email: user.email.toUpperCase() }))
    userDao.createUser(user1).catch(e => expect(Number(e.code)).toEqual(23505))
  })

  it('should update an already stored user', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)
    const actual = await userDao.updateUserBy({ iduser: savedUser.iduser }, { first_name: 'New first name', tos_version_accepted: 0 })
    expect(actual.first_name).toBe('New first name')
  })

  it('should delete an stored user', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const actual = await userDao.deleteUserByExternalId(savedUser.iduser)

    expect(actual).toBeInstanceOf(Object)
    expect(actual.email).toBe('fake@fafake.fake')
  })
})
