import { inject } from 'inversify'
import * as statuscodes from 'http-status-codes'
import {
  BaseHttpController,
  controller,
  httpPost
} from 'inversify-express-utils'
import { PaymentService } from './../services/payment.service'
import { TenantService } from './../services/tenant.service'

@controller('/job')
export default class JobController extends BaseHttpController {
  constructor(
    @inject('PaymentService')
    private paymentService: PaymentService,
    @inject('TenantService')
    private tenantService: TenantService
  ) {
    super()
  }

  /**
   * POST /create-monthly-rent
   * Creat monthly rent payments for active tenants
   *
   */
  @httpPost(
    '/create-monthly-rent',
    'createMonthlyRentValidator')
  public createMonthlyRentPayments() {
    // Create monthly rent payments for active tenants on the first day of the month
    return this.paymentService.createMonthlyRentPayments()
      .then(() => this.json({}, statuscodes.OK))
  }

  /**
   * POST /send-due-date-notification
   * Send due date notifications for overdue payments
   *
   */
  @httpPost(
    '/send-due-date-notification')
  public sendDueDateNotification() {
    return this.paymentService.sendDueDateNotification()
      .then(() => this.json({}, statuscodes.OK))
  }

  /**
   * POST /send-payment-notification
   * Send payment notifications 2 days before and 7 days after due date
   *
   */
  @httpPost(
    '/send-payment-notification')
  public sendPaymentNotification() {
    return this.paymentService.sendPaymentNotification()
      .then(() => this.json({}, statuscodes.OK))
  }

  /**
   * POST /set-moved-out-tenants-to-users
   * Set moved-out tenants back to normal users
   *
   */
  @httpPost(
    '/set-moved-out-tenants-to-users')
  public setMovedOutTenantsToUsers() {
    return this.tenantService.setMovedOutTenantsToUsers()
      .then(() => this.json({}, statuscodes.OK))
  }
}
