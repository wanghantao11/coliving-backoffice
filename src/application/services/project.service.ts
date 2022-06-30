import { inject, injectable } from 'inversify'
import 'reflect-metadata'

import { ProjectDao, ProjectFacadeDao, ProjectGalleryDao } from './../../domain/dao'
import { ProjectGallery } from './../../domain/entity'
import { Project } from './../../domain/entity'
import { parseImagePath } from './../../infrastructure/utils/firebase'

import { deleteImage } from './../firebase/accomodation'
import { isPublishable } from '../../infrastructure/utils/project'

@injectable()
export class ProjectService {
  constructor(
    @inject('ProjectDao') private projectDao: ProjectDao,
    @inject('ProjectFacadeDao') private projectFacadeDao: ProjectFacadeDao,
    @inject('ProjectGalleryDao') private projectGalleryDao: ProjectGalleryDao
  ) {}

  public createProject = data => {
    const { gallery = [] } = data
    return this.projectDao.createProject(data).then(project =>
      Promise.all(
        gallery && gallery.length > 0 ? gallery.map(({ source, text }) =>
          this.projectGalleryDao.createProjectImage(new ProjectGallery(source, text, project.id))) : []
      ).then(createdGallery => ({ ...project, gallery: createdGallery }))
    )
  }

  public deleteProject = (id: string) => this.projectDao.deleteProject(Number(id))

  public updateProject = (id: string, data: Partial<Project>) =>
    this.projectDao.getProject(Number(id))
      .then(project => !project ? Promise.reject({ message: 'NOT_FOUND', reason: `No project is found for project ${id}` }) : null)
      .then(() => this.projectDao.updateProject(Number(id), data))
      .then(project => this.projectGalleryDao.getProjectImagesByProjectId(project.id)
        .then(updatedGallery => ({ ...project, gallery: updatedGallery }))
      )

  public getProjectByFacadeId = (id: number) =>
    this.projectDao.getProjectByFacadeId(id)
      .then(project => !project ? Promise.reject({ message: 'NOT_FOUND', reason: `No project is found for project facade ${id}` }) :
        Promise.all([
          this.projectGalleryDao.getProjectImagesByProjectId(project.id),
          this.projectFacadeDao.getProjectFacade(project.facade_id)])
          .then(([gallery, { is_auto_offer_flow }]) => ({ ...project, gallery, is_auto_offer_flow })))

  public getProjectsByFacadeIds = (ids: number[]) =>
    this.projectDao.getProjectsByFacadeIds(ids)

  public getAllPublishedProjects = (offset: string, limit: number) =>
    this.projectDao.getAllPublishedProjects(limit, Number(offset)).then(projects =>
      Promise.all(
        projects && projects.length > 0 ? projects.map(project =>
          Promise.all([
            this.projectGalleryDao.getProjectImagesByProjectId(project.id),
            this.projectFacadeDao.getProjectFacade(project.facade_id)])
            .then(([gallery, { is_auto_offer_flow }]) => ({ ...project, gallery, is_auto_offer_flow }))) : []
      )
    )

  public publishProject = (id: number) =>
    this.projectDao.getProject(id)
      .then(project => !project ? Promise.reject({ message: 'NOT_FOUND', reason: `No project is found for project ${id}` }) :
        project.is_published ? Promise.reject({ message: 'CONFLICT', reason: `Project ${id} is already published` }) :
          isPublishable(project).then(() =>
            this.projectDao.updateProject(
              project.id,
              {
                is_published: true,
                published_at: new Date(),
              }
            ).then(project =>
              this.projectGalleryDao.getProjectImagesByProjectId(project.id)
                .then(gallery => ({ ...project, gallery }))
            )
          )
      )

  public deleteProjectImage = (galleryId: number) =>
    this.projectGalleryDao.deleteProjectImage(galleryId)
      .then(deletedImage => parseImagePath(deletedImage.source))
      .then(deleteImage)

  public getProjectImagesByProjectId = (id: number) =>
    this.projectGalleryDao.getProjectImagesByProjectId(id)
}
