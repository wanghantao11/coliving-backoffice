import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { ContractTemplatesDao } from './../../domain/dao'
import { ContractTemplates } from './../../domain/entity'
import IContractTemplateFilter from '../../interfaces/contractTemplate'

@injectable()
export class ContractTemplatesRepository implements ContractTemplatesDao {
  private readonly REPO_NAME = 'contract_templates'

  public getContractTemplateBy = (filter: IContractTemplateFilter): Promise<ContractTemplates> => {
    const { collectionId, facadeId } = filter
    const queries = []
    if (collectionId) {
      queries.push(`contract_templates.collection_id = '${collectionId}'`)
    }
    if (facadeId) {
      queries.push(`contract_templates.facade_id = '${facadeId}'`)
    }
    return getRepository(ContractTemplates, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where(queries.join(' AND '))
      .getOne()
  }

  public updateContractTemplateBy = (filter: IContractTemplateFilter, data: Partial<ContractTemplates>): Promise<ContractTemplates> => {
    const { facadeId } = filter
    const queries = []
    if (facadeId) {
      queries.push(`contract_templates.facade_id = '${facadeId}'`)
    }
    return getRepository(ContractTemplates, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where(queries.join(' AND '))
      .returning('*')
      .execute()
      .then(res => res.raw[0])
  }
}
