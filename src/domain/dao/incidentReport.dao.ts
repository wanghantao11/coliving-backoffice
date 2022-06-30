import { IncidentReport } from './../entity'

export interface IncidentReportDao {
  createIncidentReport(incidentReport: IncidentReport)
  updateIncidentReport(id: number, data: Partial<IncidentReport>)
  getIncidentReportById(id: number)
  getIncidentReportsByClientId(id: number, facadeIds: number[], query: any)
  getIncidentReportsForTenant(id: string, facadeId: number, query: any)
}
