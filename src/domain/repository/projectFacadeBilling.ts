import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { ProjectFacadeBillingDao } from '../dao/projectFacadeBilling.dao'
import { ProjectFacadeBilling } from '../entity/projectFacadeBilling'

@injectable()
export class ProjectFacadeBillingRepository implements ProjectFacadeBillingDao {
  private readonly REPO_NAME = 'project_facade_billing'

  public createProjectFacadeBilling = (data: Partial<ProjectFacadeBilling>) =>
    getRepository(ProjectFacadeBilling, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(ProjectFacadeBilling)
      .values({ ...data })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public getProjectFacadeBilling = (id: number) =>
    getRepository(ProjectFacadeBilling, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('facade_id = :id', { id })
      .getOne()

  public updateProjectFacadeBilling = (id: number, data: Partial<ProjectFacadeBilling>) =>
    getRepository(ProjectFacadeBilling, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('facade_id = :id', { id })
      .returning('*')
      .execute()
      .then(res => res.raw[0])
}
