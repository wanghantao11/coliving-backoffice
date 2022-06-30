import { IPayment, Payment } from '../../domain/entity'
import { IPaymentFilter } from '../../interfaces'

export interface PaymentDao {
  createPayment(payment: IPayment): Promise<Payment>
  getPaymentBy(filter: IPaymentFilter)
  getPaymentsBy(filter?: IPaymentFilter)
  getPaymentsForAdmin(query: any)
  updatePaymentBy(filter: IPaymentFilter, data: Partial<Payment>)
}
