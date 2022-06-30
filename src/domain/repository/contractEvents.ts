import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { ContractEventsDao } from './../../domain/dao'
import { ContractEvents } from './../../domain/entity'

@injectable()
export class ContractEventsRepository implements ContractEventsDao {
  private readonly REPO_NAME = 'contract_events'

  public createContractEvent = (contractEvent: ContractEvents): Promise<ContractEvents> =>
    getRepository(ContractEvents, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(ContractEvents)
      .values({ ...contractEvent })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public getContractEventsByDateRange = (startDate: string, endDate: string) =>
    getRepository(ContractEvents, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('contract_events.created_at > :startDate', { startDate })
      .andWhere('contract_events.created_at <= :endDate', { endDate })
      .select([
        'facade_id',
        'COUNT(*) FILTER (WHERE contract_events.type = \'contract_signed\') AS number_of_signed_contracts',
        'COUNT(*) FILTER (WHERE contract_events.type = \'contract_rejected\') AS number_of_rejected_contracts',
      ])
      .groupBy('contract_events.facade_id')
      .getRawMany()

  public getContractEventsDetailedByDateRange = (startDate: string, endDate: string, facadeId: number) =>
    getRepository(ContractEvents, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('contract_events.created_at > :startDate', { startDate })
      .andWhere('contract_events.created_at <= :endDate', { endDate })
      .andWhere(facadeId ? 'contract_events.facade_id = :facadeId' : '1=1', { facadeId })
      .select([
        'COUNT(*) FILTER (WHERE contract_events.type = \'contract_signed\') AS number_of_signed_contracts',
        'COUNT(*) FILTER (WHERE contract_events.type = \'contract_rejected\') AS number_of_rejected_contracts',
        'COUNT(*) FILTER (WHERE contract_events.type = \'contract_generated\') AS number_of_pending_contracts',
        'TO_CHAR(contract_events.created_at::DATE, \'YYYY-MM-DD\') AS date',
      ])
      .groupBy('date')
      .getRawMany()
}
