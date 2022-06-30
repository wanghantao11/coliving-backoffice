import { injectable } from 'inversify'
import { Connection, Repository } from 'typeorm'
import 'reflect-metadata'

@injectable()
export abstract class TypeORMConnection {
  protected connection: Promise<Connection>
  public getRepo<T>(
    target: string | (new (...params) => {})
  ): Promise<Repository<T>> {
    return this.getConn().then((connection: Connection) =>
      connection.getRepository<T>(target)
    )
  }
  public abstract startConn(): Promise<Connection>
  public getConn(): Promise<Connection> {
    return this.connection ? this.connection : this.startConn()
  }
}
