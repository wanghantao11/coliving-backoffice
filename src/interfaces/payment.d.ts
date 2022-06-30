import { PAYMENT_STATUS } from '../infrastructure/constants'

export interface IPaymentFilter {
  id?: number
  iduser?: string
  status?: PAYMENT_STATUS[]
  stripe_charge_id?: string
}
