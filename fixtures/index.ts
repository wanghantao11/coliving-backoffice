import * as path from 'path'
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist'
import { createConnection, getRepository, getConnectionOptions } from 'typeorm'
import { logger } from '../src/infrastructure/utils/loggers'

const loadFixtures = async (fixturesPath: string) => {
  let connection

  try {
    const options = await getConnectionOptions(process.env.NODE_ENV)
    connection = await createConnection({ ...options, migrationsRun: false })
    await connection.synchronize(true)
    await connection.query('delete from "user";')
    await connection.query('delete from client;')
    await connection.query('delete from admin;')
    await connection.query('delete from member_tags;')
    await connection.query('delete from label;')
    await connection.query('delete from admin_member_notes;')
    await connection.query('delete from project_facade;')
    await connection.query('delete from address;')
    await connection.query('delete from apartment;')
    await connection.query('delete from application;')
    await connection.query('delete from contract;')
    await connection.query('delete from contract_templates;')
    await connection.query('delete from emergency_contacts;')
    await connection.query('delete from incident_report;')
    await connection.query('delete from interests;')
    await connection.query('delete from offer;')
    await connection.query('delete from project;')
    await connection.query('delete from project_gallery;')
    await connection.query('delete from role;')
    await connection.query('delete from room;')
    await connection.query('delete from scope;')

    const loader = new Loader()
    loader.load(path.resolve(fixturesPath))
    const resolver = new Resolver()
    const fixtures = resolver.resolve(loader.fixtureConfigs)
    const builder = new Builder(connection, new Parser())
    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture)
      await getRepository(entity.constructor.name, process.env.NODE_ENV).save(entity)
    }
  } finally {
    if (connection) {
      await connection.close()
    }
  }
}

loadFixtures('./fixtures')
  .then(() => {
    logger.info({ message: 'Fixtures are successfully loaded.' })
    process.exit()
  })
  .catch(err => logger.info(err))
