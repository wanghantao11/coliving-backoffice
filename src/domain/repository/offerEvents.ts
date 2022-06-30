import { injectable } from 'inversify'
import { getRepository } from 'typeorm'

import { OfferEventsDao } from './../../domain/dao'
import { OfferEvents } from './../../domain/entity'

@injectable()
export class OfferEventsRepository implements OfferEventsDao {
  private readonly REPO_NAME = 'offer_events'

  public createOfferEvent = (offerEvent: OfferEvents): Promise<OfferEvents> =>
    getRepository(OfferEvents, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(OfferEvents)
      .values({ ...offerEvent })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public deleteOfferEvent = (id: number) =>
    getRepository(OfferEvents, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .delete()
      .where('id = :id', { id })
      .execute()

  public getOfferEvent = (id: number) =>
    getRepository(OfferEvents, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('id = :id', { id })
      .getOne()

  public getOfferEventsByExternalId = (iduser: string) =>
    getRepository(OfferEvents, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('iduser = :iduser', { iduser })
      .getMany()

  public getOfferEventsByType = (type: string) =>
    getRepository(OfferEvents, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('type = :type', { type })
      .getMany()

  public getOfferEventsByDateRange = (startDate: string, endDate: string) =>
    getRepository(OfferEvents, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('offer_events.created_at > :startDate', { startDate })
      .andWhere('offer_events.created_at <= :endDate', { endDate })
      .select([
        'facade_id',
        'COUNT(*) FILTER (WHERE offer_events.type = \'offer_accepted\') AS number_of_accepted_offers',
        'COUNT(*) FILTER (WHERE offer_events.type = \'offer_rejected\') AS number_of_rejected_offers',
        'COUNT(*) FILTER (WHERE offer_events.type = \'offer_sent\') AS number_of_sent_offers',
        'json_agg(data->\'offers\') FILTER (WHERE offer_events.type = \'search_ended\') as generated_offers',
        'json_agg(data->\'reason\') FILTER (WHERE offer_events.type = \'offer_rejected\') as rejection_reasons',
      ])
      .groupBy('offer_events.facade_id')
      .getRawMany()

  public getOfferEventsDetailedByDateRange = (startDate: string, endDate: string, facadeId: number) =>
    getRepository(OfferEvents, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .where('offer_events.created_at > :startDate', { startDate })
      .andWhere('offer_events.created_at <= :endDate', { endDate })
      .andWhere(facadeId ? 'offer_events.facade_id <= :facadeId' : '1=1', { facadeId })
      .select([
        'COUNT(*) FILTER (WHERE offer_events.type = \'offer_accepted\') AS number_of_accepted_offers',
        'COUNT(*) FILTER (WHERE offer_events.type = \'offer_rejected\') AS number_of_rejected_offers',
        'COUNT(*) FILTER (WHERE offer_events.type = \'offer_sent\') AS number_of_sent_offers',
        'TO_CHAR(offer_events.created_at::DATE, \'YYYY-MM-DD\') AS date',
      ])
      .groupBy('date')
      .getRawMany()
}
