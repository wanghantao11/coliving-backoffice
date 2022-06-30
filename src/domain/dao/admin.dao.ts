import { Admin } from './../entity'

export interface AdminDao {
  createAdmin(admin: Admin)
  getAdminBy(filter: any)
  getAdminsBy(filter?: any)
  updateAdminBy(filter: any, data: Partial<Admin>)
  deleteAdmin(id: number)
}
