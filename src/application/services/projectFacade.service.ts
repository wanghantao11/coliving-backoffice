import { inject, injectable } from 'inversify'
import { isBoolean } from 'lodash'
import 'reflect-metadata'

import { OfferDao, ProjectFacadeDao, TransactionDao } from './../../domain/dao'
import { ProjectFacade } from './../../domain/entity'
import { processOfferFlowSwitch } from '../../infrastructure/utils/offer'

@injectable()
export class ProjectFacadeService {
  constructor(
    @inject('ProjectFacadeDao') private projectFacadeDao: ProjectFacadeDao,
    @inject('TransactionDao') private transaticonDao: TransactionDao,
    @inject('OfferDao') private offerDao: OfferDao
  ) {}

  public createProjectFacade = (facade: ProjectFacade) =>
    ProjectFacade.generateProjectFacade(facade)
      .then(this.transaticonDao.createProjectFacadeWithBillingAndTemplates)

  public deleteProjectFacade = (id: string) =>
    this.projectFacadeDao.deleteProjectFacade(Number(id))

  public getProjectFacade = (id: string) =>
    this.projectFacadeDao.getProjectFacade(Number(id))

  public getAllMyProjectFacades = (clientId: number, offset: string, limit = 12) =>
    this.projectFacadeDao.getAllMyProjectFacades(clientId, limit, Number(offset))

  public updateProjectFacade = (id: string, data: Partial<ProjectFacade>) =>
    this.projectFacadeDao.getProjectFacade(Number(id))
      .then(projectFacade => !projectFacade ? Promise.reject({ message: 'NOT_FOUND', reason: `No project is found for project ${id}` }) : projectFacade)
      .then(({ is_auto_offer_flow }) => isBoolean(data.is_auto_offer_flow)
    && is_auto_offer_flow !== data.is_auto_offer_flow
    && processOfferFlowSwitch({ id: Number(id), is_auto_offer_flow: data.is_auto_offer_flow }, this.offerDao))
      .then(() => this.projectFacadeDao.updateProjectFacade(Number(id), data))
}
