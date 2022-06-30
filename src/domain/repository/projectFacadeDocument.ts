import { injectable } from 'inversify'
import { getRepository } from 'typeorm'
import { ProjectFacadeDocumentDao } from '../dao/projectFacadeDocument.dao'
import { ProjectFacadeDocument } from '../entity/projectFacadeDocument'

@injectable()
export class ProjectFacadeDocumentRepository implements ProjectFacadeDocumentDao {
  private readonly REPO_NAME = 'project_facade_document'

  public getProjectFacadeDocumentsByFacadeId = (facadeId: number) =>
    getRepository(ProjectFacadeDocument, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('facade_id = :facadeId', { facadeId })
      .getMany()
}
