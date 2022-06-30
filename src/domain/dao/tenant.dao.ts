
export interface TenantDao {
  getTenants(iduser: string, facade_id: number, query: any)
  getTenantDetailById(iduser: string)
}
