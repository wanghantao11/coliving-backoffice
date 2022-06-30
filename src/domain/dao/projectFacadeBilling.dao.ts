import { ProjectFacadeBilling } from './../entity/projectFacadeBilling'

export interface ProjectFacadeBillingDao {
  createProjectFacadeBilling(data: Partial<ProjectFacadeBilling>)
  getProjectFacadeBilling(id: number): Promise<ProjectFacadeBilling>
  updateProjectFacadeBilling(id: number, data: Partial<ProjectFacadeBilling>)
}
