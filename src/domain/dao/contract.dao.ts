import { Contract } from '../entity/'
import { IContractFilter, ITenancyFilter } from '../../interfaces'

export interface ContractDao {
  createContract(contract: Contract)
  updateContractBy(filter: IContractFilter, data: Partial<Contract>)
  deleteContract(id: number)
  getContractBy(filter: IContractFilter): Promise<Contract>
  getContractsBy(filter: IContractFilter)
  getContractMembers(query: any)
  getPendingContractsByClientId(clientId: number)
  getTenancyBy(filter: ITenancyFilter)
}
