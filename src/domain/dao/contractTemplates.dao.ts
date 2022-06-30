import { ContractTemplates } from '../entity'
import IContractTemplateFilter from '../../interfaces/contractTemplate'

export interface ContractTemplatesDao {
  getContractTemplateBy(filter: IContractTemplateFilter): Promise<ContractTemplates>
  updateContractTemplateBy(filter: IContractTemplateFilter, data: Partial<ContractTemplates>): Promise<ContractTemplates>
}
