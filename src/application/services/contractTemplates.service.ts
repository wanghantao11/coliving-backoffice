import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ContractTemplatesDao } from './../../domain/dao'
import { ContractTemplates } from './../../domain/entity'
import { getDataFromResponse } from '../../infrastructure/utils/common'
import {
  parseContractTemplates,
  getTemplateGroup,
  parseTemplateGroup,
  getDataFieldsSet,
  getCollections as getCollectionsFromOneFlow,
  parseCollections,
  getTemplatesByCollectionId,
  excludeSharedDataFields
} from '../../infrastructure/utils/contract'

@injectable()
export class ContractTemplatesService {
  constructor(
    @inject('ContractTemplatesDao') private contractTemplatesDao: ContractTemplatesDao
  ) {}

  public getCollections = () => getCollectionsFromOneFlow()
    .then(parseCollections)

  public updateContractTemplateByFacadeId = (
    facadeId: number, data: Partial<ContractTemplates>): Promise<Partial<ContractTemplates>> =>
    this.contractTemplatesDao.updateContractTemplateBy({ facadeId }, data)

  public getContractTemplateByCollectionId = (collectionId: number): Promise<Partial<ContractTemplates>> =>
    this.contractTemplatesDao.getContractTemplateBy({ collectionId })
      .then(template => !template ? getTemplatesByCollectionId(collectionId)
        .then(parseContractTemplates)
        .then(([{ template_group_id }]) => getTemplateGroup(template_group_id)
          .then(parseTemplateGroup)
          .then(getDataFieldsSet)
          .then(getDataFromResponse)
          .then(excludeSharedDataFields)
          .then(extraFields => ({ collection_id: collectionId, extra_fields: extraFields }))) : template)

  public getContractTemplateByFacadeId = (facadeId: number): Promise<Partial<ContractTemplates>> =>
    this.contractTemplatesDao.getContractTemplateBy({ facadeId })
      .then(template => !template ?
        Promise.reject({
          message: 'NO_CONTENT',
          reason: `No contract template is found for project facade ${facadeId}`,
        }) : template)
}
