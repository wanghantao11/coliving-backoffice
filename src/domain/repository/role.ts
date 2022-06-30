import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { RoleDao } from './../../domain/dao'
import { Role } from './../../domain/entity'

@injectable()
export class RoleRepository implements RoleDao {
  private readonly REPO_NAME = 'role'

  public createRole = (role: Role): Promise<Role> =>
    getRepository(Role, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Role)
      .values({ ...role })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public getRole = (id: number) =>
    getRepository(Role, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id', { id })
      .getOne()

  public getRolesByClientId = (clientId: number) =>
    getRepository(Role, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('role.client_id = :clientId', { clientId })
      .getMany()
}
