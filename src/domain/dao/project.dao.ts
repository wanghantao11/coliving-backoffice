import { Project } from './../entity/project'

export interface ProjectDao {
  createProject(project: Project)
  deleteProject(id: number)
  getProject(id: number)
  getProjectByFacadeId(facadeId: number)
  getProjectsByFacadeIds(facadeIds: number[])
  getAllPublishedProjects(limit: number, offset: number)
  updateProject(id: number, data: Partial<Project>)
  getProjectDataForContractByProjectId(projectId: number)
}
