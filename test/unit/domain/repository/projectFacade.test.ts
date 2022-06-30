import * as Chance from 'chance'
import { ProjectFacadeDao, ClientDao } from '../../../../src/domain/dao'
import { ProjectFacade, Client } from '../../../../src/domain/entity'
import { ProjectFacadeRepository, ClientRepository } from '../../../../src/domain/repository'
import { cleanUpMetadata } from 'inversify-express-utils'
import { db } from '../../../'
import { DeleteResult } from 'typeorm'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('testing the projectFacade dao', () => {
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
      const repo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await repo.query('DELETE FROM project_facade;')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
    } finally {
      cleanUpMetadata()
      done()
      redisClient.quit(done)
    }
  })

  afterEach(async done => {
    try {
      const repo = await db.getRepo<ProjectFacade>(ProjectFacade)
      await repo.query('DELETE FROM project_facade;')
      const clientRepo = await db.getRepo<Client>(Client)
      await clientRepo.query('DELETE FROM client;')
    } finally {
      cleanUpMetadata()
      done()
    }
  })

  it('should create a projectFacade object', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const projectFacade: ProjectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      post_area: 'Stockholm',
    })
    const actual = await projectFacadeDao.createProjectFacade(projectFacade)

    expect(actual.id).toBe(1)
  })

  it('should get an stored project facade', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const projectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      address: 'Högdalensv 21',
      post_area: 'Stockholm',
    })
    // Act
    const actual = await projectFacadeDao.createProjectFacade(projectFacade)
    // Assert
    expect(actual.name).toBe(projectFacade.name)
  })

  it('should update an already stored project facade', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const projectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      address: 'Högdalensv 21',
      post_area: 'Stockholm',
    })
    const savedAcc = await projectFacadeDao.createProjectFacade(projectFacade)
    const actual = await projectFacadeDao.updateProjectFacade(
      savedAcc.id,
      { address: 'Högdalshöjden 12', published: true })
    // Assert
    expect(actual.name).toBe(projectFacade.name)
    expect(actual.address).not.toBe('Högdalensv 21')
    expect(actual.address).toBe('Högdalshöjden 12')
  })

  it('should delete an stored project facade', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const projectFacade = await ProjectFacade.generateProjectFacade({
      client_id: savedClient.id,
      name: 'COLIVE Högdalen',
      address: 'Högdalensv 23',
      post_area: 'Stockholm',
    })

    const savedProjectFacade = await projectFacadeDao.createProjectFacade(projectFacade)
    const actual = await projectFacadeDao.deleteProjectFacade(savedProjectFacade.id)

    expect(actual).toBeInstanceOf(DeleteResult)
  })

  it('should return 12 project facades', async () => {
    const client = await Client.generateClient(clientData)
    const savedClient = await clientDao.createClient(client)

    const LIMIT = 12
    const TOTAL = 13
    const accomodations: ProjectFacade[] = []
    const chance = new Chance()
    for (let index = 0; index < TOTAL; index++) {
      const element = await ProjectFacade.generateProjectFacade({
        client_id: savedClient.id,
        name: chance.address(),
        post_area: 'Stockholm',
      })
      element.published_at = new Date(`2019-01-${index + 1}`)
      element.published = true
      accomodations.push(element)
    }

    await Promise.all(
      accomodations.map(acc => projectFacadeDao.createProjectFacade(acc))
    )
    const actual = await projectFacadeDao.getMyProjectFacades(savedClient.id, true, LIMIT, 0)

    expect(actual.length).toBe(LIMIT)
    expect(actual.length).not.toBeGreaterThan(LIMIT)
  })
})
