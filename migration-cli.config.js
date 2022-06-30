module.exports = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    dropSchema: false,
    entities: ['src/domain/entity/*'],
    migrations: ['src/domain/migrations/*'],
    cli: {
        migrationsDir: "src/domain/migrations"
    }
}