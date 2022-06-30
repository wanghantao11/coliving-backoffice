import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { RoleDao } from './../../domain/dao'
import { Role } from './../../domain/entity'

@injectable()
export class RoleService {
  constructor(
    @inject('RoleDao') private roleDao: RoleDao
  ) {}

  public createRole = (role: Role) => this.roleDao.createRole(role)

  public findRole = (id: number) => this.roleDao.getRole(id)

  public getRolesByClientId = (clientId: string) => this.roleDao.getRolesByClientId(Number(clientId))
}
