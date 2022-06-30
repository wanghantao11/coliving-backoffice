import * as dotenv from 'dotenv'
dotenv.config()

import { ApplicationService } from './../../../../src/application/services/application.service'
import { ProjectFacadeDao, ApplicationDao, ClientDao, UserDao } from './../../../../src/domain/dao'
import { ProjectFacade, Application, Client, User } from './../../../../src/domain/entity'
import {
  ProjectFacadeRepository,
  ApplicationRepo,
  ClientRepository,
  UserRepository
} from './../../../../src/domain/repository'
import { cleanUpMetadata } from 'inversify-express-utils'
import { db } from '../../../'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('testing ApplicationService', () => {
  const appAccRepo: ApplicationDao = new ApplicationRepo()
  const projectFacadeDao: ProjectFacadeDao = new ProjectFacadeRepository()
  const clientRepo: ClientDao = new ClientRepository()
  const userRepo: UserDao = new UserRepository()
  const appAccSvc = new ApplicationService(appAccRepo, userRepo, projectFacadeDao)

  const clientData = {
    name: 'Welive AB',
    org_no: '5555-555',
    type: 'admin',
    email: 'admin@ddd.se',
    phone: '319-816-2476',
    country: 'Sweden',
  }

  const userData = {
    user_key: 123,
    iduser: 'U9iqIePQ6mdlMxZ1NLbiDehIKg90',
    email: 'test@test.com',
    first_name: 'Firstname',
    last_name: 'Lastname',
    description: 'I am just a test user',
    tos_version_accepted: 1,
    user_type: 'Light',
    birthday: new Date('1991-01-01'),
    img_url: '',
  }

  beforeEach(async done => {
    try {
      const userRepo = await db.getRepo<User>(User)
      await userRepo.query('DELETE FROM "user";')
      const accRepo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await accRepo.query('DELETE FROM project_facade;')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const repo = await db.getRepo<Application>(Application)
      await repo.query('DELETE FROM application;')
    } finally {
      cleanUpMetadata()
      done()
    }
  })

  afterEach(async done => {
    try {
      const userRepo = await db.getRepo<User>(User)
      await userRepo.query('DELETE FROM "user";')
      const accRepo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await accRepo.query('DELETE FROM project_facade;')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const repo = await db.getRepo<Application>(Application)
      await repo.query('DELETE FROM application;')
    } finally {
      cleanUpMetadata()
      done()
      redisClient.quit(done)
    }
  })

  it('should apply a member to an accommodation', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientRepo.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userRepo.createUser(user)

    const acc = new ProjectFacade()
    acc.name = 'COLIVE Test'
    acc.client_id = savedClient.id
    acc.post_area = 'Stockholm'
    const result = await projectFacadeDao.createProjectFacade(acc)
    const accId = result.id
    const actual = await appAccSvc.applyForProject(savedUser.iduser, accId)

    expect(actual.facade_id).toEqual(accId)
    expect(actual.iduser).toEqual(savedUser.iduser)
    expect(actual.id).toBeDefined()
  })
})
