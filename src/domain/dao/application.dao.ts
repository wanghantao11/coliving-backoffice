import { Application } from './../entity'

export interface ApplicationDao {
  createApplication(appAcc: Application)
  deleteApplication(facadeId: number, iduser: string)
  getCountOfApplicationsByDateRange(startDate: string, endDate: string)
  getInterestedMembers(query: any)
  getMemberApplications(query: Partial<Application>): Promise<Application[]>
  getTotalNumberOfSubscribersByClientId(clientId: number)
}
