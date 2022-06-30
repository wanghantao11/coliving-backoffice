import { inject, injectable } from 'inversify'
import 'reflect-metadata'

import { ApplicationDao, UserDao, ProjectFacadeDao } from './../../domain/dao'
import { Application } from './../../domain/entity/'
import { updateUserTags, formatUser } from '../../infrastructure/utils/mailchimp'
import { TAG_STATUS } from '../../infrastructure/constants'

@injectable()
export class ApplicationService {
  constructor(
    @inject('ApplicationDao')
    private applicationDao: ApplicationDao,
    @inject('UserDao')
    private userDao: UserDao,
    @inject('ProjectFacadeDao')
    private projectFacadeDao: ProjectFacadeDao
  ) {}

  public applyForProject = (iduser: string, facadeId: number): Promise<Application> =>
    this.applicationDao.getMemberApplications({ iduser, facade_id: facadeId })
      .then(applications => applications.length !== 0 ?
        applications[0]
        : this.projectFacadeDao.getProjectFacade(facadeId)
          .then(project => !project ? Promise.reject({ message: 'NOT_FOUND', reason: `No project can be found by facade ${facadeId}` }) : project)
          .then(({ client_id, id: facade_id }) => this.applicationDao.createApplication(new Application(iduser, facade_id, client_id))
            .then(application => this.userDao.getUserBy({ iduser })
              .then(({ email }) => formatUser({ subscribed_project_ids: [facadeId], email }))
              .then(updateUserTags(process.env.MAILCHIMP_LIST_ID))
              .then(() => application))
          ))

  public getMemberApplications = (iduser: string) => this.applicationDao.getMemberApplications({ iduser })

  public getTotalCountAndTodayCountOfApplications = (facadeId: number) =>
    this.applicationDao.getMemberApplications({ facade_id: facadeId })
      .then(applications => {
        const total = applications.length
        const currentDate = new Date()
        const today = applications.filter(
          application => new Date(application.created_at).getTime() > currentDate.setHours(0, 0, 0, 0)).length
        return { total, today }
      })

  public unapplyForProject = (userId: string, facadeId: string) =>
    this.applicationDao.deleteApplication(Number(facadeId), userId)
      .then(application => this.userDao.getUserBy({ userId })
        .then(({ email }) => formatUser({ subscribed_project_ids: [Number(facadeId)], email, status: TAG_STATUS.INACTIVE }))
        .then(updateUserTags(process.env.MAILCHIMP_LIST_ID))
        .then(() => application)
      )
}
