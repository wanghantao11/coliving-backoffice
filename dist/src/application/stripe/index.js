"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharge = exports.updateCustomer = exports.getCustomerDefaultCardInfo = exports.createCustomer = void 0;
const stripe_1 = require("stripe");
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY, {
    apiVersion: '2020-08-27',
    // maxNetworkRetries: 2,
    timeout: 20 * 1000,
    typescript: true,
});
const convertToStripeAmount = (amount) => 
// Stripe minimum charge is 3kr
amount < 3 ? 300 : Math.ceil(amount * 100);
const handleStripeError = (e) => Promise.reject({ message: 'INTERNAL_SERVER_ERROR', reason: 'Stripe Request Error', detail: e.message });
exports.createCustomer = ({ email, first_name, last_name, source }) => {
    const params = {
        email,
        name: `${first_name} ${last_name}`,
        source,
        description: `${first_name} ${last_name}`,
    };
    return stripe.customers.create(params)
        .then(customer => customer.id)
        .catch(handleStripeError);
};
exports.getCustomerDefaultCardInfo = (customerId) => stripe.customers.retrieve(customerId)
    .then(res => {
    // TODO Improve ts casting
    const customer = res;
    return !customer.default_source ?
        Promise.reject({ message: 'NOT_FOUND', reason: `Missing default card info for stripe customer ${customerId}` }) :
        stripe.customers.retrieveSource(customerId, String(customer.default_source))
            .then(card => {
            const { last4, exp_month, exp_year, name, brand } = card;
            return { last4, exp_month, exp_year, name, brand };
        });
})
    .catch(handleStripeError);
exports.updateCustomer = (stripe_customer_id, data) => stripe.customers.update(stripe_customer_id, data)
    .catch(handleStripeError);
exports.createCharge = (amount, rent, currency, destination, iduser, idempotencyKey, customer, source) => {
    const stripeAmount = convertToStripeAmount(amount);
    const chargeData = {
        amount: stripeAmount,
        currency,
        transfer_data: { destination },
        metadata: { iduser, rent, service_fee: amount - rent },
    };
    if (customer) {
        chargeData.customer = customer;
    }
    if (source) {
        chargeData.source = source;
    }
    return stripe.charges.create(chargeData, { idempotencyKey }).catch(handleStripeError);
};
//# sourceMappingURL=index.js.map