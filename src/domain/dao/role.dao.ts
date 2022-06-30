import { Role } from './../entity/role'

export interface RoleDao {
  createRole(role: Role)
  getRole(id: number)
  getRolesByClientId(clientId: number)
}
