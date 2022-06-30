import { Client, UserPreferredRoommates, User } from './../../../../src/domain/entity'
import { ClientDao, UserPreferredRoommatesDao, UserDao } from './../../../../src/domain/dao'
import { ClientRepository, UserPreferredRoommatesRepository, UserRepository } from './../../../../src/domain/repository'
import { cleanUpMetadata } from 'inversify-express-utils'
import { db } from './../../../'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('testing the user dao', () => {
  const clientDao: ClientDao = new ClientRepository()
  const userPreferredRoommatesDao: UserPreferredRoommatesDao = new UserPreferredRoommatesRepository()
  const userDao: UserDao = new UserRepository()

  const clientData = {
    name: 'Welive AB',
    org_no: '5555-555',
    type: 'admin',
    email: 'admin@ddd.se',
    phone: '319-816-2476',
    country: 'Sweden',
  }

  const userData_1 = {
    iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90',
    first_name: 'First name',
    last_name: 'Last name',
    description: 'I am just a test user',
    tos_version_accepted: 1,
    user_type: 'Light',
    birthday: new Date('1991-01-01'),
    registration_time: new Date('2018-08-08'),
    email: 'fake1@fafake.fake',
  }

  const userData_2 = {
    iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg91',
    first_name: 'First name',
    last_name: 'Last name',
    description: 'I am just a test user',
    tos_version_accepted: 1,
    user_type: 'Light',
    birthday: new Date('1991-01-01'),
    registration_time: new Date('2018-08-08'),
    email: 'fake2@fafake.fake',
  }

  beforeEach(async done => {
    try {
      const userRepo = await db.getRepo<User>(User)
      await userRepo.query('DELETE FROM "user";')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const userPreferredRoommatesRepo = await db.getRepo<UserPreferredRoommates>(UserPreferredRoommates)
      await userPreferredRoommatesRepo.query('DELETE FROM user_preferred_roommates;')
    } finally {
      cleanUpMetadata()
      done()
    }
  })

  afterEach(async done => {
    try {
      const userRepo = await db.getRepo<User>(User)
      await userRepo.query('DELETE FROM "user";')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const userPreferredRoommatesRepo = await db.getRepo<UserPreferredRoommates>(UserPreferredRoommates)
      await userPreferredRoommatesRepo.query('DELETE FROM user_preferred_roommates;')
    } finally {
      cleanUpMetadata()
      done()
      redisClient.quit(done)
    }
  })

  it('should create a pending roommate pair', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user_1: User = await User.generateUser({ ...userData_1, client_id: savedClient.id })
    const user_2: User = await User.generateUser({ ...userData_2, client_id: savedClient.id })
    const actual_1 = await userDao.createUser(user_1)
    const actual_2 = await userDao.createUser(user_2)
    const roommate = await userPreferredRoommatesDao.createUserPreferredRoommate({ inviter_id: actual_1.iduser, invitee_id: actual_2.iduser })
    expect(roommate.status).toBe('Pending')
  })

  it('should not be able to create if roommate is self', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user_1: User = await User.generateUser({ ...userData_1, client_id: savedClient.id })
    const actual_1 = await userDao.createUser(user_1)
    userPreferredRoommatesDao.createUserPreferredRoommate({ inviter_id: actual_1.iduser, invitee_id: actual_1.iduser })
      .catch(({ code }) => expect(code).toBe('23514'))
  })

})
