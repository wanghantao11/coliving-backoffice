import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { ClientDao } from './../../domain/dao'
import { Client } from './../../domain/entity'

@injectable()
export class ClientRepository implements ClientDao {
  private readonly REPO_NAME = 'client'

  public createClient = (client: Client): Promise<Client> =>
    getRepository(Client, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Client)
      .values({ ...client })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteClient = (id: number) =>
    getRepository(Client, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id', { id })
      .execute()

  public getClient = (id: number) =>
    getRepository(Client, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id', { id })
      .getOne()
}
