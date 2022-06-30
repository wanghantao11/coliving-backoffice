import { ContractEvents } from './../entity'

export interface ContractEventsDao {
  createContractEvent(contractEvent: ContractEvents)
  getContractEventsByDateRange(startDate: string, endDate: string)
  getContractEventsDetailedByDateRange(startDate: string, endDate: string, facadeId: number)
}
