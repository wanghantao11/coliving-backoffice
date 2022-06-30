import * as dotenv from 'dotenv'
dotenv.config()
import 'reflect-metadata'
import { json } from 'body-parser'
import * as compression from 'compression'
import * as express from 'express'
import { InversifyExpressServer } from 'inversify-express-utils'
import * as morgan from 'morgan'
import * as httpContext from 'express-http-context'
import * as swagger from 'swagger-express-ts'

import { allowCrossDomain } from './application/middleware/cors'
import { API_VERSION } from './infrastructure/constants'
import { TypeORMConnectionService } from './infrastructure/persistence/typeorm/service'
import { logger } from './infrastructure/utils/loggers'
import config from '../config/app-config'
import { container } from './container'
import { handleError } from './application/middleware/error'
import { arenaConfig } from './infrastructure/persistence/queue/arena'
import { queueProcessInitialization } from './infrastructure/persistence/queue/proccessor'

const db: TypeORMConnectionService = container.get('TypeORMConnectionService')
const server = new InversifyExpressServer(container, null, { rootPath: API_VERSION })
server.setConfig((app: express.Application) => {
  // Set swagger configs
  app.use('/api-docs/swagger', express.static('swagger'))
  app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'))
  app.use(swagger.express(
    {
      definition : {
        info : {
          title : 'COLIVE API Docs',
          version : '1.0',
        },
        externalDocs : {
          url : '/api-docs/swagger',
        },
      },
    }
  ))

  app.use(allowCrossDomain)
  app.use(json({ limit: '10mb' }))
  app.use(morgan('combined', { stream: logger.stream }))
  app.use(compression())
  app.use(httpContext.middleware)
  app.use('/', arenaConfig)

  if (process.env.NODE_ENV !== 'production') {
    app.use('/docs', express.static('docs'))
  }
})

server.setErrorConfig((app: express.Application) => {
  app.use(handleError())
})

const app: express.Application = server.build()

// Initialize queue processor
queueProcessInitialization()

// Starts the app
if (process.env.NODE_ENV !== 'test') {
  logger.info(`Starting app at port: ${config.PORT}...`)
  db.startConn()
    .then(() => logger.info('Connected to db.'))
    .catch(reason => logger.error(`Error when connecting to db! ${reason}`))
  app.listen(
    typeof config.PORT === 'string' ? parseInt(config.PORT, 10) : config.PORT
  )
}

export { app }
