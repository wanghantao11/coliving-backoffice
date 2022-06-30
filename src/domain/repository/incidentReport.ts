import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { IncidentReportDao } from './../../domain/dao/incidentReport.dao'
import { Admin, IncidentReport } from './../../domain/entity'

@injectable()
export class IncidentReportRepository implements IncidentReportDao {
  private readonly REPO_NAME = 'incident_report'

  public createIncidentReport = (incidentReport: IncidentReport): Promise<IncidentReport> =>
    getRepository(IncidentReport, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(IncidentReport)
      .values({ ...incidentReport })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public getIncidentReportById = (id: number) =>
    getRepository(IncidentReport, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .leftJoin(Admin, 'admin', 'incident_report.owner_id = admin.id')
      .select([
        '\"admin\".id AS owner_id',
        '\"admin\".first_name AS owner_first_name',
        '\"admin\".last_name AS owner_last_name',
        '\"admin\".img_url AS owner_img_url',
        '\"incident_report\".id',
        '\"incident_report\".category',
        '\"incident_report\".client_id',
        '\"incident_report\".closed_at',
        '\"incident_report\".created_at',
        '\"incident_report\".decline_reason',
        '\"incident_report\".description',
        '\"incident_report\".estimated_done_date',
        '\"incident_report\".facade_id',
        '\"incident_report\".feedback',
        '\"incident_report\".is_private',
        '\"incident_report\".location',
        '\"incident_report\".owner_comment',
        '\"incident_report\".photos',
        '\"incident_report\".priority',
        '\"incident_report\".reporter_id',
        '\"incident_report\".satisfaction_level',
        '\"incident_report\".subcategory',
        '\"incident_report\".status',
        '\"incident_report\".title',
      ])
      .where('incident_report.id = :id', { id })
      .getRawOne()

  public getIncidentReportsByClientId = (id: number, facadeIds: number[], query: any) => {
    const {
      status,
      offset = 0,
      limit = 10,
    } = query

    let filterQuery = `client_id = ${id}`

    if (facadeIds) {
      filterQuery = filterQuery + ` AND (facade_id = ANY('{${facadeIds.join(',')}}'::int[]))`
    }

    if (status) {
      filterQuery = filterQuery + ` AND (status = ANY('{${status.join(',')}}'))`
    }

    const dbQuery = getRepository(IncidentReport, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where(filterQuery)

    return Promise.all([
      dbQuery.getMany().then(incidents => incidents.length),
      dbQuery.offset(offset).limit(limit).getMany()])
  }

  public getIncidentReportsForTenant = (id: string, facadeId: number, query: any) => {
    const {
      closed_at,
      status,
      offset = 0,
      limit = 10,
    } = query

    let filterQuery = `incident_report.facade_id = ${facadeId} AND (incident_report.reporter_id = '${id}' OR incident_report.is_private = FALSE)`

    if (closed_at) {
      filterQuery = filterQuery + ` AND (incident_report.closed_at IS NULL OR incident_report.closed_at >= (${closed_at})::timestamp)`
    }

    if (status) {
      filterQuery = filterQuery + ` AND (incident_report.status = ANY('{${status.join(',')}}'))`
    }

    const dbQuery = getRepository(IncidentReport, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .select([
        'incident_report.id',
        'incident_report.closed_at',
        'incident_report.created_at',
        'incident_report.client_id',
        'incident_report.estimated_done_date',
        'incident_report.facade_id',
        'incident_report.is_private',
        'incident_report.location',
        'incident_report.status',
        'incident_report.title',
      ])
      .where(filterQuery)

    return Promise.all([
      dbQuery.getMany().then(incidents => incidents.length),
      dbQuery.offset(offset).limit(limit).getMany()])
  }

  public updateIncidentReport = (id: number, data: Partial<IncidentReport>) =>
    getRepository(IncidentReport, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .returning('*')
      .execute()
      .then(res => res.raw[0])
}
