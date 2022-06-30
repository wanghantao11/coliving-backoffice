import { ProjectGallery } from '../entity'

export interface ProjectGalleryDao {
  createProjectImage(data: ProjectGallery)
  deleteProjectImage(id: number)
  getProjectImage(id: number)
  getProjectImagesByProjectId(id: number)
  updateProjectImage(id: number, data: Partial<ProjectGallery>)
}
