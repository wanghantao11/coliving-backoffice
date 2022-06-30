import * as httpMocks from 'node-mocks-http'
import 'reflect-metadata'
import { cleanUpMetadata } from 'inversify-express-utils'
import { IsAuthorized } from '../../../../src/application/middleware/authorization'
import { Authorization } from '../../../../src/application/auth/authorization'
import { db } from '../../..'
import {
  RoleRepository,
  AdminRepository,
  ClientRepository
} from '../../../../src/domain/repository'
import { Admin, Role, Client } from '../../../../src/domain/entity'
import { BACKOFFICE, COMMUNITY } from '../../../../src/infrastructure/constants'
import { redisClient } from '../../../../src/infrastructure/persistence/redis'

describe('Test authorization middleware', () => {
  const roleDao = new RoleRepository()
  const adminDao = new AdminRepository()
  const clientDao = new ClientRepository()
  const authorization = new Authorization(roleDao, adminDao)
  const validator = new IsAuthorized(authorization)
  const allowPermission = 1
  const notAllowPermission = 2

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

  it('should pass when auth type is community', async () => {
    let trigger = false
    const req = httpMocks.createRequest()
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()
    res.locals.allowAuthTypes = COMMUNITY
    await validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should pass when auth type is backoffice with proper authorization', async () => {
    const clientObj = {
      name: 'olive',
      org_no: '12345',
      phone: '54321',
      email: 'oliveAB@thisisfake.colive.se',
      country: 'se',
      type: 'IT',
    }
    const client = await Client.generateClient(clientObj)
    const createdClient = await clientDao.createClient(client)

    const roleObj = {
      name: 'sys_admin',
      client_id: createdClient.id,
      scopes: [allowPermission],
    }
    const role = await Role.generateRole(roleObj)
    const createdRole = await roleDao.createRole(role)

    const adminObj = {
      first_name: 'oliver',
      last_name: 'jam',
      email: 'oliver@thisisfake.colive.se',
      verified: true,
      role_id: createdRole.id,
      client_id: createdClient.id,
    }
    const admin = await Admin.generateAdmin(adminObj)
    const createdAdmin = await adminDao.createAdmin(admin)

    let trigger = false
    const req = httpMocks.createRequest()
    const next = () => {
      trigger = true
    }
    const res = httpMocks.createResponse()
    res.locals.allowAuthTypes = BACKOFFICE
    res.locals.authType = BACKOFFICE
    res.locals.userId = createdAdmin.id
    res.locals.permission = [allowPermission]

    await validator.handler(req, res, next)
    expect(trigger).toBe(true)
  })

  it('should not pass when auth type is backoffice without proper authorization', async () => {
    const clientObj = {
      name: 'olive',
      org_no: '12345',
      phone: '54321',
      email: 'oliveAB@thisisfake.colive.se',
      country: 'se',
      type: 'IT',
    }
    const client = await Client.generateClient(clientObj)
    const createdClient = await clientDao.createClient(client)

    const roleObj = {
      name: 'sys_admin',
      client_id: createdClient.id,
      scopes: [allowPermission],
    }
    const role = await Role.generateRole(roleObj)
    const createdRole = await roleDao.createRole(role)

    const adminObj = {
      first_name: 'oliver',
      last_name: 'jam',
      email: 'oliver@thisisfake.colive.se',
      verified: true,
      role_id: createdRole.id,
      client_id: createdClient.id,
    }
    const admin = await Admin.generateAdmin(adminObj)
    const createdAdmin = await adminDao.createAdmin(admin)

    const req = httpMocks.createRequest()
    const res = httpMocks.createResponse()
    res.locals.allowAuthTypes = BACKOFFICE
    res.locals.authType = BACKOFFICE
    res.locals.userId = createdAdmin.id
    res.locals.permission = [notAllowPermission]
    await validator.handler(req, res, err => {
      if (err) {
        expect(err.message).toBe('NOT_AUTHORIZED')
      }
    })
  })
})
