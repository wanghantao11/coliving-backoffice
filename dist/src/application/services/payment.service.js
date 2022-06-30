"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const constants_1 = require("../../infrastructure/constants");
const common_1 = require("../../infrastructure/utils/common");
const email_1 = require("../../infrastructure/utils/email");
const stripe_1 = require("../../application/stripe");
const date_fns_1 = require("date-fns");
let PaymentService = class PaymentService {
    constructor(paymentDao, projectFacadeDao, projectFacadeBillingDao, clientDao, contractDao, roomDao, userDao) {
        this.paymentDao = paymentDao;
        this.projectFacadeDao = projectFacadeDao;
        this.projectFacadeBillingDao = projectFacadeBillingDao;
        this.clientDao = clientDao;
        this.contractDao = contractDao;
        this.roomDao = roomDao;
        this.userDao = userDao;
        this.createCharge = (id, iduser, facadeId, idempotencyKey, source, saveCard, newCustomer) => this.projectFacadeDao.getProjectFacade(facadeId)
            .then(({ client_id }) => this.clientDao.getClient(client_id)
            .then(({ stripe_account_id }) => !stripe_account_id ?
            Promise.reject({ message: 'NOT_ALLOWED', reason: `stripe_account_id not exist for client ${client_id}` })
            : this.paymentDao.getPaymentBy({ id }).then(payment => !payment || payment.amount < 0 ?
                Promise.reject({ message: 'NOT_FOUND', reason: `Payment ${id} not found when creating charge` })
                : payment)
                .then(payment => saveCard || newCustomer || (!source && !saveCard) ?
                stripe_1.createCharge(payment.amount, payment.rent, payment.currency, stripe_account_id, iduser, idempotencyKey, payment.stripe_customer_id)
                : stripe_1.createCharge(payment.amount, payment.rent, payment.currency, stripe_account_id, iduser, idempotencyKey, null, source))))
            .then(charge => this.paymentDao.updatePaymentBy({ id }, { stripe_charge_id: charge.id, status: constants_1.PAYMENT_STATUS.PENDING }));
        this.createMonthlyRentPayments = () => this.contractDao.getContractsBy({ status: [constants_1.CONTRACT_STATUS.ACTIVE] })
            .then(contracts => Promise.all(contracts && contracts.length > 0
            ? contracts.map(({ iduser, facade_id, room_id }) => 
            // TODO check contract.end_date
            this.roomDao.getRoomBy({ id: room_id })
                .then(room => this.paymentDao.createPayment({
                amount: Math.ceil(room.rent / room.people_per_room) + room.service_fee,
                currency: 'sek',
                iduser,
                facade_id,
                rent: Math.ceil(room.rent / room.people_per_room),
                status: constants_1.PAYMENT_STATUS.CREATED,
            })))
            : []));
        this.getPayment = (id) => this.paymentDao.getPaymentBy({ id })
            .then(payment => !payment.stripe_saved_card || !payment.stripe_customer_id ?
            (Object.assign(Object.assign({}, payment), { due_date: common_1.formatDueDate(payment.created_at, payment.due_day_of_month) })) :
            stripe_1.getCustomerDefaultCardInfo(payment.stripe_customer_id).then(card => (Object.assign(Object.assign({}, payment), { due_date: common_1.formatDueDate(payment.created_at, payment.due_day_of_month), card }))));
        this.getPayments = (iduser) => this.paymentDao.getPaymentsBy({ iduser })
            .then(payments => payments && payments.length > 0
            ? Promise.all(payments.map(payment => (Object.assign(Object.assign({}, payment), { due_date: common_1.formatDueDate(payment.created_at, payment.due_day_of_month) }))))
            : []);
        this.getPaymentsForAdmin = (query) => this.paymentDao.getPaymentsForAdmin(query);
        this.sendDueDateNotification = () => this.paymentDao.getPaymentsBy({ status: [constants_1.PAYMENT_STATUS.CREATED] })
            .then(payments => Promise.all(payments && payments.length > 0
            ? payments.map(payment => !payment.is_overdue && new Date().getUTCDate() > payment.due_day_of_month
                ? this.userDao.getUserBy({ iduser: payment.iduser })
                    .then(({ email, first_name }) => email_1.emailAxiosPost('/mail/payment-overdue', {
                    email,
                    first_name,
                    amount: payment.amount,
                    currency: payment.currency,
                    due_date: date_fns_1.format(common_1.formatDueDate(payment.created_at, payment.due_day_of_month), 'yyyy MMM dd'),
                }))
                    .then(() => this.paymentDao.updatePaymentBy({ id: payment.id }, { is_overdue: true }))
                : payment)
            : []));
        this.sendPaymentNotification = () => this.paymentDao.getPaymentsBy({ status: [constants_1.PAYMENT_STATUS.CREATED] })
            .then(payments => Promise.all(payments && payments.length > 0
            ? payments.map(payment => 
            // Only send late payment notification 7 days after the due date
            new Date().getUTCDate() === payment.due_day_of_month + 7
                ? this.userDao.getUserBy({ iduser: payment.iduser })
                    .then(({ email, first_name }) => email_1.emailAxiosPost('/mail/payment-too-late', {
                    email,
                    first_name,
                    amount: payment.amount,
                    currency: payment.currency,
                    due_date: common_1.formatDueDate(payment.created_at, payment.due_day_of_month),
                }))
                : new Date().getUTCDate() === payment.due_day_of_month - 2
                    ? this.userDao.getUserBy({ iduser: payment.iduser })
                        .then(({ email, first_name }) => email_1.emailAxiosPost('/mail/payment-upcoming', {
                        email,
                        first_name,
                        amount: payment.amount,
                        currency: payment.currency,
                        due_date: common_1.formatDueDate(payment.created_at, payment.due_day_of_month),
                    }))
                    : payment)
            : []));
        this.submitPayment = (id, iduser, facadeId, idempotencyKey, source, saveCard) => this.createOrGetStripeCustomer(iduser, source)
            .then(({ stripe_customer_id, new_customer }) => saveCard ?
            // Update stripe customer default card for future payments
            this.updateSavedCard(iduser, stripe_customer_id, source, new_customer).then(() => new_customer) : new_customer)
            .then(newCustomer => this.createCharge(id, iduser, facadeId, idempotencyKey, source, saveCard, newCustomer));
        this.updatePaymentOnWebhookEvent = (event) => {
            const chargeObj = event.data.object;
            switch (event.type) {
                case 'charge.succeeded':
                    this.paymentDao.getPaymentsBy({ stripe_charge_id: chargeObj.id })
                        .then(payments => Promise.all(payments && payments.length > 0
                        ? payments.map(({ id }) => this.paymentDao.updatePaymentBy({ id }, { status: constants_1.PAYMENT_STATUS.SUCCEEDED, paid_at: new Date(chargeObj.created * 1000), receipt_url: chargeObj.receipt_url }))
                        // Payment succeeded but not found in DB, ignore the success
                        : []));
                    break;
                case 'charge.failed':
                    this.paymentDao.getPaymentsBy({ stripe_charge_id: chargeObj.id })
                        .then(payments => Promise.all(payments && payments.length > 0
                        ? payments.map(({ id }) => this.paymentDao.updatePaymentBy({ id }, { status: constants_1.PAYMENT_STATUS.FAILED, failed_reason: chargeObj.failure_message })
                            .then(({ iduser, created_at, due_day_of_month }) => this.userDao.getUserBy({ iduser })
                            .then(user => email_1.emailAxiosPost('/mail/payment-failed', {
                            email: user.email,
                            first_name: user.first_name,
                            due_date: common_1.formatDueDate(created_at, due_day_of_month),
                        }))))
                        // Payment failed but not found in DB, ignore the failure
                        : []));
                    break;
            }
            return Promise.resolve({ received: true });
        };
        this.createOrGetStripeCustomer = (iduser, source) => this.userDao.getUserBy({ iduser })
            .then(({ stripe_customer_id, email, first_name, last_name }) => !stripe_customer_id
            ? stripe_1.createCustomer({ email, first_name, last_name, source })
                .then(stripe_customer_id => this.userDao.updateUserBy({ iduser }, { stripe_customer_id }).then(() => ({ stripe_customer_id, new_customer: true })))
            : ({ stripe_customer_id, new_customer: false }));
        this.updateSavedCard = (iduser, stripeCustomerId, source, newCustomer) => Promise.all([
            this.userDao.updateUserBy({ iduser }, { stripe_has_saved_card: true }),
            !newCustomer && source ? stripe_1.updateCustomer(stripeCustomerId, { source }) : {},
        ]);
    }
};
PaymentService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('PaymentDao')),
    __param(1, inversify_1.inject('ProjectFacadeDao')),
    __param(2, inversify_1.inject('ProjectFacadeBillingDao')),
    __param(3, inversify_1.inject('ClientDao')),
    __param(4, inversify_1.inject('ContractDao')),
    __param(5, inversify_1.inject('RoomDao')),
    __param(6, inversify_1.inject('UserDao')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map