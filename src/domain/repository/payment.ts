import { injectable } from 'inversify'
import { countBy } from 'lodash'
import { getRepository } from 'typeorm'

import { PaymentDao } from './../../domain/dao'
import { Payment, ProjectFacadeBilling, User } from './../../domain/entity'
import { IPaymentFilter } from './../../interfaces'
import { PAYMENT_STATUS } from './../../infrastructure/constants'
import { convertDateToISOString, convertStringToBoolean } from './../../infrastructure/utils/common'

@injectable()
export class PaymentRepository implements PaymentDao {
  private readonly REPO_NAME = 'payment'

  public createPayment = (payment: Payment): Promise<Payment> =>
    getRepository(Payment, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .insert()
      .into(Payment)
      .values({ ...payment })
      .returning('*')
      .execute()
      .then(res => res.raw[0])

  public getPaymentBy = (filter: IPaymentFilter): Promise<Payment> => {
    const { id, status = [] } = filter
    const queries = []
    if (id) {
      queries.push(`payment.id = '${id}'`)
    }

    if (status.length !== 0) {
      queries.push(`payment.status = ANY('{${status.join(',')}}')`)
    }

    return getRepository(Payment, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(User, 'user', 'user.iduser = payment.iduser')
      .innerJoin(ProjectFacadeBilling, 'projectFacadeBilling', 'projectFacadeBilling.facade_id = payment.facade_id')
      .select([
        '\"payment\".id',
        '\"payment\".iduser',
        '\"payment\".facade_id',
        '\"payment\".amount',
        '\"payment\".currency',
        '\"payment\".receipt_url',
        '\"payment\".rent',
        '\"payment\".status',
        '\"payment\".failed_reason',
        '\"payment\".created_at',
        '\"payment\".is_overdue',
        '\"payment\".paid_at',
        '\"projectFacadeBilling\".rent_day_of_month as due_day_of_month',
        '\"user\".stripe_customer_id as stripe_customer_id',
        '\"user\".stripe_has_saved_card as stripe_saved_card',
      ])
      .where(queries.join(' AND '))
      .getRawOne()
  }

  public getPaymentsBy = (filter: IPaymentFilter = {}): Promise<Payment[]> => {
    const { iduser, status = [], stripe_charge_id } = filter
    const queries = []

    if (iduser) {
      queries.push(`iduser = '${iduser}'`)
    }

    if (status.length !== 0) {
      queries.push(`status = ANY('{${status.join(',')}}')`)
    }

    if (stripe_charge_id) {
      queries.push(`payment.stripe_charge_id = '${stripe_charge_id}'`)
    }

    return getRepository(Payment, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(ProjectFacadeBilling, 'projectFacadeBilling', 'projectFacadeBilling.facade_id = payment.facade_id')
      .select([
        '\"payment\".id',
        '\"payment\".iduser',
        '\"payment\".facade_id',
        '\"payment\".amount',
        '\"payment\".currency',
        '\"payment\".status',
        '\"payment\".created_at',
        '\"payment\".is_overdue',
        '\"payment\".paid_at',
        '\"projectFacadeBilling\".rent_day_of_month as due_day_of_month',
      ])
      .where(queries.join(' AND '))
      .orderBy({ created_at: 'DESC' })
      .getRawMany()
  }

  public getPaymentsForAdmin = (query: any) => {
    const { facade_id, id, iduser, email, name, created_from, created_to, is_overdue, status = [],
      offset, limit, sort_by = 'created_at', sort_order = 'DESC' } = query

    const filterQuery = []
    if (facade_id) {
      filterQuery.push(`payment.facade_id = ${facade_id}`)
    }

    if (id) {
      filterQuery.push(`payment.id = ${id}`)
    }

    if (iduser) {
      filterQuery.push(`payment.iduser = '${iduser}'`)
    }

    if (email) {
      filterQuery.push(`(user.email ilike '%${email}%')`)
    }

    if (name) {
      filterQuery.push(`(user.first_name ilike '%${name}%' OR user.last_name ilike '%${name}%')`)
    }

    if (created_from) {
      filterQuery.push(`payment.created_at >= '${convertDateToISOString(new Date(created_from))}'`)
    }

    if (created_to) {
      filterQuery.push(`payment.created_at < '${convertDateToISOString(new Date(created_to))}'`)
    }

    const statusFilterQuery = []
    if (convertStringToBoolean(is_overdue)) {
      statusFilterQuery.push('payment.is_overdue = TRUE')
    }

    if (status.length !== 0) {
      statusFilterQuery.push(`payment.status = ANY('{${status.join(',')}}')`)
    }

    const dbQuery = getRepository(Payment, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .innerJoin(User, 'user', 'user.iduser = payment.iduser')
      .select([
        '\"payment\".id',
        '\"payment\".iduser',
        '\"payment\".created_at',
        '\"payment\".is_overdue',
        '\"payment\".failed_reason',
        '\"payment\".paid_at',
        '\"payment\".status',
        '\"user\".first_name',
        '\"user\".last_name',
        '\"user\".img_url',
        '\"user\".email',
        '\"user\".user_type',
      ])
      .where(filterQuery.join(' AND '))

    return Promise.all([
      dbQuery.getRawMany().then(payments => Promise.resolve(countBy(payments, 'status'))
        .then(counts => Promise.resolve(payments.reduce(
          (cnt, payment) => payment.status !== PAYMENT_STATUS.SUCCEEDED && payment.is_overdue ? cnt + 1 : cnt, 0))
          .then(is_overdue => ({ ...counts, all: payments.length, is_overdue })))),
      statusFilterQuery.length > 0 ?
        dbQuery.andWhere(statusFilterQuery.join(' AND ')).orderBy(sort_by, sort_order).offset(offset).limit(limit).getRawMany()
        : dbQuery.orderBy(sort_by, sort_order).offset(offset).limit(limit).getRawMany(),
    ])
  }

  public updatePaymentBy = (filter: IPaymentFilter, data: Partial<Payment>) => {
    const { id } = filter
    const queries = []

    if (id) {
      queries.push(`payment.id = '${id}'`)
    }

    return getRepository(Payment, process.env.NODE_ENV)
      .createQueryBuilder(this.REPO_NAME)
      .update()
      .set({ ...data })
      .where(queries.join(' AND '))
      .returning('*')
      .execute()
      .then(res => res.raw[0])
  }
}
