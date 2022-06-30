module.exports = [{
  name: 'test',
  type: 'postgres',
  url: process.env.DATABASE_URL_TEST,
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: ['src/domain/entity/*']
},
{
  name: 'development',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  dropSchema: false,
  entities: ['src/domain/entity/*'],
  migrations: ['src/domain/migrations/*'],
  migrationsRun: false
},
{
  name: 'stage',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  synchronize: false,
  logging: false,
  dropSchema: false,
  entities: ['dist/src/domain/entity/*'],
  migrations: ['dist/src/domain/migrations/*'],
  migrationsRun: true
},
{
  name: 'sandbox',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  synchronize: false,
  logging: false,
  dropSchema: false,
  entities: ['dist/src/domain/entity/*'],
  migrations: ['dist/src/domain/migrations/*'],
  migrationsRun: true
},
{
  name: 'production',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  synchronize: false,
  logging: false,
  dropSchema: false,
  entities: ['dist/src/domain/entity/*'],
  migrations: ['dist/src/domain/migrations/*'],
  migrationsRun: true
}]
