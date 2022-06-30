import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { ProjectFacadeBillingDao } from './../../domain/dao'
import { ProjectFacadeBilling } from './../../domain/entity'

@injectable()
export class ProjectFacadeBillingService {
  constructor(
    @inject('ProjectFacadeBillingDao') private projectFacadeBillingDao: ProjectFacadeBillingDao
  ) {}
  public getProjectFacadeBilling = (id: string) =>
    this.projectFacadeBillingDao.getProjectFacadeBilling(Number(id))

  public updateProjectFacadeBilling = (id: string, data: Partial<ProjectFacadeBilling>) =>
    this.projectFacadeBillingDao.updateProjectFacadeBilling(Number(id), data)
}
