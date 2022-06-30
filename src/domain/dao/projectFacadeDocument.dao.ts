import { ProjectFacadeDocument } from './../entity/projectFacadeDocument'

export interface ProjectFacadeDocumentDao {
  getProjectFacadeDocumentsByFacadeId(facadeId: number): Promise<ProjectFacadeDocument[]>
}
