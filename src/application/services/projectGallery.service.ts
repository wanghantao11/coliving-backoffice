import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { ProjectGalleryDao } from './../../domain/dao'
import { ProjectGallery } from '../../domain/entity'

@injectable()
export class ProjectGalleryService {
  constructor(
    @inject('ProjectGalleryDao') private projectGalleryDao: ProjectGalleryDao
  ) {}

  public createProjectImage = (data: ProjectGallery) =>
    this.projectGalleryDao.createProjectImage(new ProjectGallery(data.source, data.text, data.id))

  public updateProjectImage = (id: string, data: Partial<ProjectGallery>) =>
    this.projectGalleryDao.updateProjectImage(Number(id), data)

  public deleteProjectImage = (id: string) => this.projectGalleryDao.deleteProjectImage(Number(id))
}
