import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { PaymentDao, ClientDao, ContractDao, ProjectFacadeDao,
  ProjectFacadeBillingDao, RoomDao, UserDao } from '../../domain/dao'
import { Payment } from '../../domain/entity'
import { CONTRACT_STATUS, PAYMENT_STATUS } from '../../infrastructure/constants'
import { formatDueDate } from '../../infrastructure/utils/common'
import { emailAxiosPost } from '../../infrastructure/utils/email'
import {
  createCharge,
  createCustomer,
  getCustomerDefaultCardInfo,
  updateCustomer
} from '../../application/stripe'
import { format } from 'date-fns'

@injectable()
export class PaymentService {
  constructor(
    @inject('PaymentDao') private paymentDao: PaymentDao,
    @inject('ProjectFacadeDao') private projectFacadeDao: ProjectFacadeDao,
    @inject('ProjectFacadeBillingDao') private projectFacadeBillingDao: ProjectFacadeBillingDao,
    @inject('ClientDao') private clientDao: ClientDao,
    @inject('ContractDao') private contractDao: ContractDao,
    @inject('RoomDao') private roomDao: RoomDao,
    @inject('UserDao') private userDao: UserDao
  ) {}

  public createCharge = (
    id: number, iduser: string, facadeId: number, idempotencyKey: string, source: string, saveCard: boolean, newCustomer: boolean): Promise<Payment> =>
    this.projectFacadeDao.getProjectFacade(facadeId)
      .then(({ client_id }) => this.clientDao.getClient(client_id)
        .then(({ stripe_account_id }) => !stripe_account_id ?
          Promise.reject({ message: 'NOT_ALLOWED', reason: `stripe_account_id not exist for client ${client_id}` })
          : this.paymentDao.getPaymentBy({ id }).then(payment => !payment || payment.amount < 0 ?
            Promise.reject({ message: 'NOT_FOUND', reason: `Payment ${id} not found when creating charge` })
            : payment)
            .then(payment => saveCard || newCustomer || (!source && !saveCard) ?
              createCharge(payment.amount, payment.rent, payment.currency, stripe_account_id, iduser, idempotencyKey, payment.stripe_customer_id)
              : createCharge(payment.amount, payment.rent, payment.currency, stripe_account_id, iduser, idempotencyKey, null, source))))
      .then(charge => this.paymentDao.updatePaymentBy({ id }, { stripe_charge_id: charge.id, status: PAYMENT_STATUS.PENDING }))

  public createMonthlyRentPayments = () =>
    this.contractDao.getContractsBy({ status: [CONTRACT_STATUS.ACTIVE] })
      .then(contracts =>
        Promise.all(
          contracts && contracts.length > 0
            ? contracts.map(({ iduser, facade_id, room_id }) =>
            // TODO check contract.end_date
              this.roomDao.getRoomBy({ id: room_id })
                .then(room =>
                  this.paymentDao.createPayment({
                    amount: Math.ceil(room.rent / room.people_per_room) + room.service_fee,
                    currency: 'sek',
                    iduser,
                    facade_id,
                    rent: Math.ceil(room.rent / room.people_per_room),
                    status: PAYMENT_STATUS.CREATED,
                  })
                ))
            : []))

  public getPayment = (id: number) =>
    this.paymentDao.getPaymentBy({ id })
      .then(payment => !payment.stripe_saved_card || !payment.stripe_customer_id ?
        ({ ...payment, due_date: formatDueDate(payment.created_at, payment.due_day_of_month) }) :
        getCustomerDefaultCardInfo(payment.stripe_customer_id).then(card => ({
          ...payment,
          due_date: formatDueDate(payment.created_at, payment.due_day_of_month),
          card,
        })))

  public getPayments = (iduser: string) =>
    this.paymentDao.getPaymentsBy({ iduser })
      .then(payments => payments && payments.length > 0
        ? Promise.all(payments.map(payment => ({
          ...payment, due_date: formatDueDate(payment.created_at, payment.due_day_of_month),
        })))
        : [])

  public getPaymentsForAdmin = (query: any) =>
    this.paymentDao.getPaymentsForAdmin(query)

  public sendDueDateNotification = () =>
    this.paymentDao.getPaymentsBy({ status: [PAYMENT_STATUS.CREATED] })
      .then(payments =>
        Promise.all(
          payments && payments.length > 0
            ? payments.map(payment =>
              !payment.is_overdue && new Date().getUTCDate() > payment.due_day_of_month
                ? this.userDao.getUserBy({ iduser: payment.iduser })
                  .then(({ email, first_name }) => emailAxiosPost(
                    '/mail/payment-overdue',
                    {
                      email,
                      first_name,
                      amount: payment.amount,
                      currency: payment.currency,
                      due_date: format(formatDueDate(payment.created_at, payment.due_day_of_month),'yyyy MMM dd'),
                    }))
                  .then(() => this.paymentDao.updatePaymentBy({ id: payment.id }, { is_overdue: true }))
                : payment)
            : []))

  public sendPaymentNotification = () =>
    this.paymentDao.getPaymentsBy({ status: [PAYMENT_STATUS.CREATED] })
      .then(payments =>
        Promise.all(
          payments && payments.length > 0
            ? payments.map(payment =>
            // Only send late payment notification 7 days after the due date
              new Date().getUTCDate() === payment.due_day_of_month + 7
                ? this.userDao.getUserBy({ iduser: payment.iduser })
                  .then(({ email, first_name }) => emailAxiosPost(
                    '/mail/payment-too-late',
                    {
                      email,
                      first_name,
                      amount: payment.amount,
                      currency: payment.currency,
                      due_date: formatDueDate(payment.created_at, payment.due_day_of_month),
                    }))
                : new Date().getUTCDate() === payment.due_day_of_month - 2
                  ? this.userDao.getUserBy({ iduser: payment.iduser })
                    .then(({ email, first_name }) => emailAxiosPost(
                      '/mail/payment-upcoming',
                      {
                        email,
                        first_name,
                        amount: payment.amount,
                        currency: payment.currency,
                        due_date: formatDueDate(payment.created_at, payment.due_day_of_month),
                      }))
                  : payment)
            : []))

  public submitPayment = (
    id: number, iduser: string, facadeId: number, idempotencyKey: string, source: string, saveCard: boolean) =>
    this.createOrGetStripeCustomer(iduser, source)
      .then(({ stripe_customer_id, new_customer }) => saveCard ?
        // Update stripe customer default card for future payments
        this.updateSavedCard(iduser, stripe_customer_id, source, new_customer).then(() => new_customer) : new_customer)
      .then(newCustomer => this.createCharge(id, iduser, facadeId, idempotencyKey, source, saveCard, newCustomer))

  public updatePaymentOnWebhookEvent = (event: any) => {
    const chargeObj = event.data.object
    switch (event.type) {
    case 'charge.succeeded':
      this.paymentDao.getPaymentsBy({ stripe_charge_id: chargeObj.id })
        .then(payments => Promise.all(payments && payments.length > 0
          ? payments.map(({ id }) => this.paymentDao.updatePaymentBy({ id },
            { status: PAYMENT_STATUS.SUCCEEDED, paid_at: new Date(chargeObj.created * 1000), receipt_url: chargeObj.receipt_url }))
        // Payment succeeded but not found in DB, ignore the success
          : []))
      break
    case 'charge.failed':
      this.paymentDao.getPaymentsBy({ stripe_charge_id: chargeObj.id })
        .then(payments => Promise.all(payments && payments.length > 0
          ? payments.map(({ id }) => this.paymentDao.updatePaymentBy({ id },
            { status: PAYMENT_STATUS.FAILED, failed_reason: chargeObj.failure_message })
            .then(({ iduser, created_at, due_day_of_month }) => this.userDao.getUserBy({ iduser })
              .then(user => emailAxiosPost(
                '/mail/payment-failed',
                {
                  email: user.email,
                  first_name: user.first_name,
                  due_date: formatDueDate(created_at, due_day_of_month),
                }))))
        // Payment failed but not found in DB, ignore the failure
          : []))
      break
    }

    return Promise.resolve({ received: true })
  }

  private createOrGetStripeCustomer = (iduser: string, source: string) =>
    this.userDao.getUserBy({ iduser })
      .then(({ stripe_customer_id, email, first_name, last_name }) =>
        !stripe_customer_id
          ? createCustomer({ email, first_name, last_name, source })
            .then(stripe_customer_id =>
              this.userDao.updateUserBy({ iduser }, { stripe_customer_id }).then(() => ({ stripe_customer_id, new_customer: true })))
          : ({ stripe_customer_id, new_customer: false }))

  private updateSavedCard = (iduser: string, stripeCustomerId: string, source: string, newCustomer: boolean) =>
    Promise.all([
      this.userDao.updateUserBy({ iduser }, { stripe_has_saved_card: true }),
      !newCustomer && source ? updateCustomer(stripeCustomerId, { source }) : {},
    ])
}
