import * as dotenv from 'dotenv'
dotenv.config()

import { ApplicationService } from './../../../../src/application/services/application.service'
import 'reflect-metadata'
import { cleanUpMetadata } from 'inversify-express-utils'
import { ProjectFacadeDao, ApplicationDao, ClientDao, UserDao } from './../../../../src/domain/dao'
import { ProjectFacade, Application, Client, User } from './../../../../src/domain/entity'
import {
  ClientRepository,
  ProjectFacadeRepository,
  ApplicationRepo,
  UserRepository
} from './../../../../src/domain/repository'

import { db } from '../../../'
import { QueryFailedError } from 'typeorm'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('testing the ApplicationRepo', () => {
  const applicationDao: ApplicationDao = new ApplicationRepo()
  const projectFacadeDao: ProjectFacadeDao = new ProjectFacadeRepository()
  const userDao: UserDao = new UserRepository()
  const clientDao: ClientDao = new ClientRepository()

  const clientData = {
    name: 'Welive AB',
    org_no: '5555-555',
    type: 'admin',
    email: 'admin@ddd.se',
    phone: '319-816-2476',
    country: 'Sweden',
  }

  const applicationSvc = new ApplicationService(
    applicationDao,
    userDao,
    projectFacadeDao
  )

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
      const repo = await db.getRepo<Application>(Application)
      await repo.query('DELETE FROM application;')
      const accRepo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await accRepo.query('DELETE FROM project_facade;')
      const userRepo = await db.getRepo<User>(User)
      await userRepo.query('DELETE FROM "user";')
    } finally {
      cleanUpMetadata()
      done()
    }
  })

  afterEach(async done => {
    try {
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const repo = await db.getRepo<Application>(Application)
      await repo.query('DELETE FROM application;')
      const accRepo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await accRepo.query('DELETE FROM project_facade;')
      const userRepo = await db.getRepo<User>(User)
      await userRepo.query('DELETE FROM "user";')
    } finally {
      cleanUpMetadata()
      done()
      redisClient.quit(done)
    }
  })

  it('should create an AppliedAccommodation in db', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const projectFacade: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      post_area: 'Stockholm',
    })
    const createdProjectFacade = await projectFacadeDao.createProjectFacade(projectFacade)

    const appAcc = new Application(savedUser.iduser, createdProjectFacade.id, savedClient.id)
    const actual = await applicationDao.createApplication(appAcc)

    expect(actual).toBeInstanceOf(Object)
    expect(actual.facade_id).toBe(createdProjectFacade.id)
    expect(actual.iduser).toBe(savedUser.iduser)
  })

  it('should throw an error if applying to same accommodation again', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const projectFacade: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      post_area: 'Stockholm',
    })
    const createdProjectFacade = await projectFacadeDao.createProjectFacade(projectFacade)

    const appAcc = new Application(savedUser.iduser, createdProjectFacade.id, savedClient.id)
    await applicationDao.createApplication(appAcc)
    const actual = applicationDao.createApplication(appAcc)

    await expect(actual).rejects.toThrowError(QueryFailedError)
  })

  it('should get all applications done by a member', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const projectFacade1: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen1',
      post_area: 'Stockholm',
    })
    const createdProjectFacade1 = await projectFacadeDao.createProjectFacade(projectFacade1)

    const projectFacade2: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen2',
      post_area: 'Stockholm',
    })
    const createdProjectFacade2 = await projectFacadeDao.createProjectFacade(projectFacade2)

    const projectFacade3: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen3',
      post_area: 'Stockholm',
    })
    const createdProjectFacade3 = await projectFacadeDao.createProjectFacade(projectFacade3)

    const appAccs = [
      new Application(savedUser.iduser, createdProjectFacade1.id, savedClient.id),
      new Application(savedUser.iduser, createdProjectFacade2.id, savedClient.id),
      new Application(savedUser.iduser, createdProjectFacade3.id, savedClient.id),
    ]

    await Promise.all(
      appAccs.map(appAcc => applicationDao.createApplication(appAcc))
    )

    const result = await applicationDao.getMemberApplications({ iduser: savedUser.iduser })
    const actual = result.sort()

    expect(actual).toHaveLength(3)
  })

  it('should remove an application from a member', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const user = await User.generateUser({ ...userData, client_id: savedClient.id })
    const savedUser = await userDao.createUser(user)

    const projectFacade1: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen1',
      post_area: 'Stockholm',
    })
    const createdProjectFacade1 = await projectFacadeDao.createProjectFacade(projectFacade1)

    const projectFacade2: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen2',
      post_area: 'Stockholm',
    })
    const createdProjectFacade2 = await projectFacadeDao.createProjectFacade(projectFacade2)

    const projectFacade3: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen3',
      post_area: 'Stockholm',
    })
    const createdProjectFacade3 = await projectFacadeDao.createProjectFacade(projectFacade3)

    const appAccs = [
      new Application(savedUser.iduser, createdProjectFacade1.id, savedClient.id),
      new Application(savedUser.iduser, createdProjectFacade2.id, savedClient.id),
      new Application(savedUser.iduser, createdProjectFacade3.id, savedClient.id),
    ]

    const appliedAccs = await Promise.all(
      appAccs.map(appAcc => applicationDao.createApplication(appAcc))
    )

    await applicationDao.deleteApplication(createdProjectFacade3.id, savedUser.iduser)
    const actual = await applicationDao.getMemberApplications({ iduser: savedUser.iduser })

    expect(actual).toHaveLength(2)
  })
})
