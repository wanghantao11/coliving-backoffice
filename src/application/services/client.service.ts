import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { ClientDao, TransactionDao } from './../../domain/dao'
import { Client } from './../../domain/entity'

@injectable()
export class ClientService {
  constructor(
    @inject('ClientDao') private clientDao: ClientDao,
    @inject('TransactionDao') private transactionDao: TransactionDao
  ) {}

  public createClient = (client: Client) => this.transactionDao.createClientAndRoles(client)

  public deleteClient = (id: string) => this.clientDao.deleteClient(Number(id))

  public getClient = (id: number) => this.clientDao.getClient(id)
}
