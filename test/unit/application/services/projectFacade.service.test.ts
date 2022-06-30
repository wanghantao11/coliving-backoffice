import * as dotenv from 'dotenv'
dotenv.config()

import { ProjectFacadeDao, ClientDao, TransactionDao, OfferDao } from './../../../../src/domain/dao'
import { ProjectFacadeService } from './../../../../src/application/services/projectFacade.service'
import { ProjectFacade, Client, Room } from './../../../../src/domain/entity'
import {
  ProjectFacadeRepository,
  ClientRepository,
  TransactionRepository,
  OfferRepository
} from './../../../../src/domain/repository'
import { cleanUpMetadata } from 'inversify-express-utils'
import { db } from './../../../'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('test the projectFacade service', () => {
  const projectFacadeDao: ProjectFacadeDao = new ProjectFacadeRepository()
  const transactionDao: TransactionDao = new TransactionRepository()
  const clientDao: ClientDao = new ClientRepository()
  const offerDao: OfferDao = new OfferRepository()
  const projectFacadeSvc = new ProjectFacadeService(projectFacadeDao, transactionDao, offerDao)

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
      const roomRepo = await db.getRepo<Room>(Room)
      await roomRepo.query('DELETE FROM room;')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const repo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await repo.query('DELETE FROM project_facade;')
    } finally {
      cleanUpMetadata()
      done()
    }
  })

  afterEach(async done => {
    try {
      const roomRepo = await db.getRepo<Room>(Room)
      await roomRepo.query('DELETE FROM room;')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
      const repo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await repo.query('DELETE FROM project_facade;')
    } finally {
      cleanUpMetadata()
      done()
      redisClient.quit(done)
    }
  })

  it('should save data with the service and create a projectFacade object', async () => {
    // Arrange
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const expected = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      address: 'högdalsvägen 31',
      cover_image_source: 'https://via.placeholder.com/250',
      post_area: 'Stockholm',
    })
    // Act
    const acc = await projectFacadeSvc.createProjectFacade(expected)
    const actual = await projectFacadeDao.getProjectFacade(acc.id)
    // Assert
    expect(actual.name).toEqual(expected.name)
    expect(actual.published).toEqual(false)
    expect(actual.published_at).toBeDefined()
  })
})
