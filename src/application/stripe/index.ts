import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2020-08-27',
  // maxNetworkRetries: 2,
  timeout: 20 * 1000, // set timeout to 20s
  typescript: true,
})

const convertToStripeAmount = (amount: number): number =>
// Stripe minimum charge is 3kr
  amount < 3 ? 300 : Math.ceil(amount * 100)

const handleStripeError = (e: Stripe.StripeError) =>
  Promise.reject({ message: 'INTERNAL_SERVER_ERROR', reason: 'Stripe Request Error', detail: e.message })

export const createCustomer = ({ email, first_name, last_name, source }) => {
  const params: Stripe.CustomerCreateParams = {
    email,
    name: `${first_name} ${last_name}`,
    source,
    description: `${first_name} ${last_name}`,
  }

  return stripe.customers.create(params)
    .then(customer => customer.id)
    .catch(handleStripeError)
}

export const getCustomerDefaultCardInfo = (customerId: string) =>
  stripe.customers.retrieve(customerId)
    .then(res => {
      // TODO Improve ts casting
      const customer = res as Stripe.Customer
      return !customer.default_source ?
        Promise.reject({ message: 'NOT_FOUND', reason: `Missing default card info for stripe customer ${customerId}` }) :
        stripe.customers.retrieveSource(customerId, String(customer.default_source))
          .then(card => {
            const { last4, exp_month, exp_year, name, brand } = card as Stripe.Card
            return { last4, exp_month, exp_year, name, brand }
          })
    })
    .catch(handleStripeError)

export const updateCustomer = (stripe_customer_id: string, data: any): Promise<Stripe.Response<Stripe.Customer>> =>
  stripe.customers.update(stripe_customer_id, data)
    .catch(handleStripeError)

export const createCharge = (
  amount: number,
  rent: number,
  currency: string,
  destination: string,
  iduser: string,
  idempotencyKey: string,
  customer: string,
  source?: string
): Promise<Stripe.Response<Stripe.Charge>> => {
  const stripeAmount = convertToStripeAmount(amount)

  const chargeData: any = {
    amount: stripeAmount,
    currency,
    transfer_data: { destination },
    metadata: { iduser, rent, service_fee: amount - rent },
  }

  if (customer) {
    chargeData.customer = customer
  }

  if (source) {
    chargeData.source = source
  }

  return stripe.charges.create(chargeData, { idempotencyKey }).catch(handleStripeError)
}
