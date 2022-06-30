import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { ProjectFacadeDao } from './../../domain/dao'
import { ProjectFacade, Room, ProjectFacadeBilling, ContractTemplates, Address } from './../../domain/entity'

@injectable()
export class ProjectFacadeRepository implements ProjectFacadeDao {
  private readonly REPO_NAME = 'project_facade'

  public createProjectFacade = (projectFacade: ProjectFacade) =>
    getRepository(ProjectFacade, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(ProjectFacade)
      .values({ ...projectFacade })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public updateProjectFacade = (
    id: number, data: Partial<ProjectFacade>) =>
    getRepository(ProjectFacade, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteProjectFacade = (id: number) =>
    getRepository(ProjectFacade, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id ', { id })
      .execute()

  public getProjectFacade = (id: number) =>
    getRepository(ProjectFacade, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id', { id })
      .getOne()

  public getProjectFacades = (ids: number[]) =>
    getRepository(ProjectFacade, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id IN (:...ids)', { ids })
      .getMany()

  public getPublishedProjectFacade = (id: number) =>
    getRepository(ProjectFacade, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id AND published = :published', { id, published: true })
      .getOne()

  public getAllPublishedProjectFacades = (limit: number, offset: number) =>
    getRepository(ProjectFacade, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .offset(offset)
      .limit(limit)
      .orderBy('published_at', 'DESC')
      .where('published = :published', { published: true })
      .getMany()

  public getAllMyProjectFacades = (
    clientId: number, limit: number, offset: number): Promise<ProjectFacade[]> =>
    getRepository(ProjectFacade, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .offset(offset)
      .limit(limit)
      .orderBy('published_at', 'DESC')
      .where('client_id = :id', { id: clientId })
      .getMany()

  public getMyProjectFacades = (
    clientId: number, published: boolean, limit: number, offset: number): Promise<ProjectFacade[]> =>
    getRepository(ProjectFacade, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .offset(offset)
      .limit(limit)
      .orderBy('published_at', 'DESC')
      .where('client_id= :id AND published = :published', { id: clientId, published })
      .getMany()

  public getProjectDataForContract = (roomId: number) =>
    getRepository(ProjectFacade, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(Room, 'room', `room.id = ${roomId}`)
      .innerJoin(ProjectFacadeBilling, 'project_facade_billing', 'project_facade_billing.facade_id = room.facade_id')
      .innerJoin(ContractTemplates, 'contract_templates', 'contract_templates.facade_id = room.facade_id')
      .innerJoin(Address, 'address', 'address.id = room.address_id')
      .where('project_facade.id = room.facade_id')
      .select([
        // projectFacade
        'project_facade.name as project_name',
        'project_facade.id as facade_id',
        'landlord_name',
        'landlord_email',
        'landlord_org_no',
        'landlord_street',
        'landlord_zip',
        'landlord_post_area',
        'property_unit_designation',
        'coliving_hub',
        'post_area',
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
        // room
        'room.id',
        'number',
        'people_per_room',
        'size',
        'shared_area_size',
        'floor_no',
        'street',
        'zip',
        'rent',
        'service_fee',
        // collection
        'collection_id'])
      .getRawOne()
}
