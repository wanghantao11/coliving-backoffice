import 'reflect-metadata'
import { inject, injectable } from 'inversify'

import { AdminDao, IncidentReportDao, UserDao } from './../../domain/dao'
import { IncidentReport } from './../../domain/entity'
import { excludeKeysFromObject } from './../../infrastructure/utils/common'

@injectable()
export class IncidentReportService {
  constructor(
    @inject('IncidentReportDao') private incidentReportDao: IncidentReportDao,
    @inject('AdminDao') private adminDao: AdminDao,
    @inject('UserDao') private userDao: UserDao
  ) {}

  public createIncidentReport = (incidentReport: IncidentReport) =>
    this.incidentReportDao.createIncidentReport(incidentReport)

  public getIncidentReportForAdmin = (id: string) =>
    this.getIncidentReportById(Number(id))

  public getIncidentReportsByClientId = (id: string, facadeIds: number[], query: any) =>
    this.incidentReportDao.getIncidentReportsByClientId(Number(id), facadeIds, query)
      .then(([total, incidents]) => total === 0 ? Promise.reject({ message: 'NO_CONTENT', reason: 'No incident report is found' })
        : ({ total, incidents }))

  public getIncidentReportForTenant = (id: string) =>
    this.getIncidentReportById(Number(id))
      .then(incident => !incident ? Promise.reject({ message: 'NOT_FOUND', reason: 'No incident report is found' }) : incident)
      .then(excludeKeysFromObject('priority'))

  public getIncidentReportsForTenant = (id: string, facadeId: string, query: any) =>
    this.incidentReportDao.getIncidentReportsForTenant(id, Number(facadeId), query)

  public updateIncidentReport = (id: string, data: Partial<IncidentReport>) =>
    this.incidentReportDao.updateIncidentReport(Number(id), data)

  private getIncidentReportById = (id: number) =>
    this.incidentReportDao.getIncidentReportById(id)
      .then(incidentReport => isNaN(Number(incidentReport.reporter_id)) ?
      // Reporter is a tenant
        this.userDao.getUserBy({ iduser: incidentReport.reporter_id })
          .then(tenant => ({
            ...incidentReport,
            reporter_name: tenant.first_name + ' ' + tenant.last_name,
            reporter_img_url: tenant.img_url,
          }))
        : // Reporter is an admin
        this.adminDao.getAdminBy({ id: Number(incidentReport.reporter_id) })
          .then(admin => ({
            ...incidentReport,
            reporter_name: admin.first_name + ' ' + admin.last_name,
            reporter_img_url: admin.img_url,
          }))
      )
}
