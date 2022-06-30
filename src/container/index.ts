import 'reflect-metadata'
import { Container } from 'inversify'

const container = new Container()

import './auth'
import './controllers'
import './database'
import './repository'
import './services'
import './validators'

export { container }
