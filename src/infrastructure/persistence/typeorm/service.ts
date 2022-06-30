import { injectable } from 'inversify'
import { Connection, createConnection, getConnectionOptions } from 'typeorm'
import { TypeORMConnection } from './connection'

@injectable()
export class TypeORMConnectionService extends TypeORMConnection {
  public startConn(): Promise<Connection> {
    if (!this.connection) {
      return getConnectionOptions(process.env.NODE_ENV).then(options => {
        this.connection = createConnection(options)
        return this.connection
      })
    } else {
      return Promise.reject('Already connected to database.')
    }
  }
}
