import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { ProjectGalleryDao } from './../../domain/dao'
import { ProjectGallery } from './../../domain/entity'

@injectable()
export class ProjectGalleryRepository implements ProjectGalleryDao {
  private readonly REPO_NAME = 'project_gallery'

  public createProjectImage = (data: ProjectGallery): Promise<ProjectGallery> =>
    getRepository(ProjectGallery, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(ProjectGallery)
      .values({ ...data })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteProjectImage = (id: number) =>
    getRepository(ProjectGallery, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id', { id })
      .execute()

  public getProjectImage = (id: number) =>
    getRepository(ProjectGallery, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id', { id })
      .getOne()

  public getProjectImagesByProjectId = (id: number) =>
    getRepository(ProjectGallery, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('project_id = :id', { id })
      .getMany()

  public updateProjectImage = (id: number, data: Partial<ProjectGallery>) =>
    getRepository(ProjectGallery, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .returning('*')
      .execute()
      .then(res => res.raw[0])
}
