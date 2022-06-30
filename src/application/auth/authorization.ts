import { inject, injectable } from 'inversify'
import { RoleDao, AdminDao } from './../../domain/dao'
import { hasPermission } from './../../infrastructure/utils/common'

@injectable()
export class Authorization {
  constructor(
    @inject('RoleDao')
    private roleDao: RoleDao,
    @inject('AdminDao')
    private adminDao: AdminDao
  ) {}

  public authorize = (admin_id: number, values: number[]) =>
    this.adminDao.getAdminBy({ id: admin_id })
      .then(admin => !admin ? Promise.reject({ message: 'NOT_FOUND', reason: `No admin is found for ${admin_id} during authorization` }) : admin)
      .then(admin => admin.role.id)
      .then(this.roleDao.getRole)
      .then(({ scopes }) => !scopes ? scopes : hasPermission(scopes, values))
}
