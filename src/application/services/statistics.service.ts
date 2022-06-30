import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { flatten, uniq } from 'lodash'

import {
  ApplicationDao,
  ContractDao,
  ContractEventsDao,
  OfferEventsDao,
  RoomDao,
  UserDao
} from '../../domain/dao'
import { IStatisticsFilters } from '../../interfaces/statistics'
import {
  convertFromDateStringToISOString,
  convertToDateStringToISOString
} from './../../infrastructure/utils/user'

@injectable()
export class StatisticsService {
  constructor(
    @inject('ApplicationDao') private applicationDao: ApplicationDao,
    @inject('OfferEventsDao') private offerEventsDao: OfferEventsDao,
    @inject('ContractEventsDao') private contractEventsDao: ContractEventsDao,
    @inject('UserDao') private userDao: UserDao,
    @inject('ContractDao') private contractDao: ContractDao,
    @inject('RoomDao') private roomDao: RoomDao
  ) {}

  public getApplicationsStatsByDateRange(filters: IStatisticsFilters) {
    const startDate = convertFromDateStringToISOString(filters.start_date)
    const endDate = convertToDateStringToISOString(filters.end_date)

    return this.applicationDao.getCountOfApplicationsByDateRange(startDate, endDate)
      .then(result => result.map(item => ({
        member: item.count || 0,
        member_count_test_complete: item.count_test_complete || 0,
        project_id: item.facade_id,
        project_name: item.facade_name,
        date: item.date,
      })))
  }

  public getRegistrationsStatsByDateRange(filters: IStatisticsFilters) {
    const startDate = convertFromDateStringToISOString(filters.start_date)
    const endDate = convertToDateStringToISOString(filters.end_date)


    return this.userDao.getCountOfUsersByDateRange(startDate, endDate)
      .then(result => result.map(item => ({
        count: item.count || 0,
        date: item.date,
      })))
  }

  public getGeneralStats = (clientId: number) =>
    Promise.all([
      this.contractDao.getPendingContractsByClientId(clientId),
      this.roomDao.getRoomStatisticsByClientId(clientId),
      this.userDao.getTotalNumberOfUsersByClientId(clientId),
      this.applicationDao.getTotalNumberOfSubscribersByClientId(clientId),
    ])
      .then(([contracts, rooms, members, subscribers]) => ({ contracts, rooms, members, subscribers }))

  public getMembersStatsByDateRange(filters: IStatisticsFilters) {
    const startDate = convertFromDateStringToISOString(filters.start_date)
    const endDate = convertToDateStringToISOString(filters.end_date)
    const registrationTimeSpan = { startDate, endDate }
    return this.userDao.getUsersCountBy({ registrationTimeSpan })
  }

  public getOffersStatsByDateRange = (filters: IStatisticsFilters) => {
    const startDate = convertFromDateStringToISOString(filters.start_date)
    const endDate = convertToDateStringToISOString(filters.end_date)

    return this.offerEventsDao.getOfferEventsByDateRange(startDate, endDate)
      .then(dataGroupedByProjects => dataGroupedByProjects.map(({
        facade_id,
        number_of_accepted_offers,
        number_of_rejected_offers,
        number_of_sent_offers,
        generated_offers,
        rejection_reasons }) =>
        ({
          facade_id,
          number_of_accepted_offers,
          number_of_rejected_offers,
          number_of_sent_offers,
          number_of_room_offered: generated_offers ? uniq(flatten(generated_offers).map(({ room_id }) => room_id)).length : 0,
          count_of_rejection_reason: rejection_reasons ? rejection_reasons.reduce((result, reasons) => {
            Object.keys(reasons).forEach(reason => {
              result[reason] = result[reason] ? result[reason] + 1 : 1
            })
            return result
          }, {}) : {},
        })
      ))
  }

  public getContractsStatsByDateRange = (filters: IStatisticsFilters) => {
    const startDate = convertFromDateStringToISOString(filters.start_date)
    const endDate = convertToDateStringToISOString(filters.end_date)

    return this.contractEventsDao.getContractEventsByDateRange(startDate, endDate)
  }

  public getSalesProgressStats = async (filters: IStatisticsFilters) => {
    const startDate = convertFromDateStringToISOString(filters.start_date)
    const endDate = convertToDateStringToISOString(filters.end_date)
    const facadeId = Number(filters.facade_id)

    const contractEvents = await this.contractEventsDao.getContractEventsDetailedByDateRange(
      startDate, endDate, facadeId)
    const offerEvents = await this.offerEventsDao.getOfferEventsDetailedByDateRange(startDate,
      endDate, facadeId)

    return ([...contractEvents, ...offerEvents]).reduce(
      (prev, curr) => {
        const existDate = prev.findIndex(({ date }) => date === curr.date)

        if (existDate > -1) {
          prev[existDate] = {
            ...prev[existDate],
            ...curr,
          }

          return prev
        }

        prev.push(curr)
        return prev
      }, [])
  }
}
