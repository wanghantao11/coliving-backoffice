import { injectable } from 'inversify'
import { getRepository, DeleteResult } from 'typeorm'

import { ProjectDao } from './../../domain/dao/project.dao'
import { Project } from './../../domain/entity/project'
import { ProjectFacade, ProjectFacadeBilling, ContractTemplates , Room, Address} from '../entity'

@injectable()
export class ProjectRepository implements ProjectDao {
  private readonly REPO_NAME = 'project'

  public createProject = (data: Project) => getRepository(Project, process.env.NODE_ENV)
    .createQueryBuilder(this.REPO_NAME)
    .insert()
    .into(Project)
    .values({ ...data })
    .returning('*')
    .execute()
    .then(res => res.raw[0])

  public deleteProject = (id: number): Promise<DeleteResult> =>
    getRepository(Project, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id ', { id })
      .delete()
      .execute()

  public getProject = (id: number): Promise<Project> =>
    getRepository(Project, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id', { id })
      .getOne()

  public getProjectByFacadeId = (facadeId: number): Promise<Project> =>
    getRepository(Project, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('facade_id = :facadeId', { facadeId })
      .getOne()

  public getProjectsByFacadeIds = (facadeIds: number[]) =>
    getRepository(Project, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('facade_id IN (:...facadeIds)', { facadeIds })
      .getMany()

  public getAllPublishedProjects = (limit = 10, offset = 0): Promise<Project[]> =>
    getRepository(Project, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .offset(offset)
      .limit(limit)
      .orderBy('published_at', 'DESC')
      .where('is_published = :isPublished', { isPublished: true })
      .getMany()

  public updateProject = (id: number, data: Partial<Project>): Promise<Project> =>
    getRepository(Project, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public getProjectDataForContractByProjectId = (projectId: number) => {
    const selectedFields = [
      '\"projectFacade\".name',
      '\"projectFacade\".id',
      '\"projectFacade\".landlord_name',
      '\"projectFacade\".landlord_email',
      '\"projectFacade\".landlord_org_no',
      '\"projectFacade\".landlord_street',
      '\"projectFacade\".landlord_zip',
      '\"projectFacade\".landlord_post_area',
      '\"projectFacade\".property_unit_designation',
      '\"projectFacade\".coliving_hub',
      '\"projectFacade\".post_area',
      // projectFacadeBilling
      'bankgiro_no',
      'deposit',
      'deposit_refund_weeks',
      'rent_yearly_increase_rate',
      'rent_yearly_increase_date',
      'rent_day_of_month',
      'service_fee_day_of_month',
      // contractTemplates
      'extra_fields',
      // collection
      'collection_id',
    ]

    const roomFields = [
      '\"room\".id',
      '\"room\".number',
      '\"room\".people_per_room',
      '\"room\".size',
      '\"room\".shared_area_size',
      '\"room\".floor_no',
      '\"room\".rent',
      '\"room\".service_fee',
      '\"address\".street',
      '\"address\".zip',
      '\"project\".id as project_id',
    ]

    const groupByFields = selectedFields.join(',')

    return getRepository(Project, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where(`project.id = ${projectId}`)
      .innerJoin(ProjectFacade, 'projectFacade', 'projectFacade.id = project.facade_id')
      .innerJoin(ProjectFacadeBilling, 'project_facade_billing', 'project_facade_billing.facade_id = project.facade_id')
      .innerJoin(ContractTemplates, 'contract_templates', 'contract_templates.facade_id = project.facade_id')
      .innerJoinAndSelect(subquery => subquery
        .from(Project, 'project')
        .innerJoin(ProjectFacade, 'projectFacade', 'projectFacade.id = project.facade_id')
        .innerJoin(Room, 'room', 'room.facade_id = project.facade_id')
        .innerJoin(Address, 'address', 'address.id = room.address_id')
        .select(roomFields),
      'room', `room.project_id = ${projectId}`)
      .select(selectedFields)
      .addSelect('json_agg(room) FILTER (WHERE room.id IS NOT NULL) AS rooms')
      .groupBy(groupByFields)
      .getRawOne()
  }
}
