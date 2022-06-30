import { ProjectFacade } from './../entity'

export interface ProjectFacadeDao {
  createProjectFacade(projectFacade: ProjectFacade)
  deleteProjectFacade(id: number)
  getProjectFacade(id: number)
  getProjectFacades(ids: number[])
  getPublishedProjectFacade(id: number)
  getAllPublishedProjectFacades(limit: number, offset: number)
  getAllMyProjectFacades(
    clientId: number, limit: number, offset: number)
  getMyProjectFacades(
    clientId: number, published: boolean, limit: number, offset: number)
  updateProjectFacade(id: number, data: Partial<ProjectFacade>)
  getProjectDataForContract(roomId: number)
}
