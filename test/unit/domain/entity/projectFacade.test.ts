import { ProjectFacade, Client } from '../../../../src/domain/entity'
import { ClientDao } from './../../../../src/domain/dao'
import { ClientRepository } from '../../../../src/domain/repository'
import { db } from './../../../'
import { cleanUpMetadata } from 'inversify-express-utils'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('testing the projectFacade entity', () => {
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
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
    } finally {
      cleanUpMetadata()
      done()
    }
  })

  afterEach(async done => {
    try {
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
    } finally {
      cleanUpMetadata()
      done()
      redisClient.quit(done)
    }
  })

  it('should create a projectFacade object', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const actual = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Husby',
      post_area: 'Stockholm',
    })

    expect(actual).toBeInstanceOf(ProjectFacade)
  })

  it('should create a projectFacade object and test if there is mandatory properties', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    // Act
    const actual = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Fridhemsplan',
      post_area: 'Stockholm',
    })
    // Assert
    expect(typeof actual.name).toBe('string')
    expect(actual.name.length).toBeGreaterThan(0)
    expect(actual.published).toBeFalsy()
  })
})
