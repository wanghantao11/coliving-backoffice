"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const inversify_1 = require("inversify");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
const constants_1 = require("./../../infrastructure/constants");
const common_1 = require("./../../infrastructure/utils/common");
let PaymentRepository = class PaymentRepository {
    constructor() {
        this.REPO_NAME = 'payment';
        this.createPayment = (payment) => typeorm_1.getRepository(entity_1.Payment, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.Payment)
            .values(Object.assign({}, payment))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.getPaymentBy = (filter) => {
            const { id, status = [] } = filter;
            const queries = [];
            if (id) {
                queries.push(`payment.id = '${id}'`);
            }
            if (status.length !== 0) {
                queries.push(`payment.status = ANY('{${status.join(',')}}')`);
            }
            return typeorm_1.getRepository(entity_1.Payment, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.User, 'user', 'user.iduser = payment.iduser')
                .innerJoin(entity_1.ProjectFacadeBilling, 'projectFacadeBilling', 'projectFacadeBilling.facade_id = payment.facade_id')
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
                .getRawOne();
        };
        this.getPaymentsBy = (filter = {}) => {
            const { iduser, status = [], stripe_charge_id } = filter;
            const queries = [];
            if (iduser) {
                queries.push(`iduser = '${iduser}'`);
            }
            if (status.length !== 0) {
                queries.push(`status = ANY('{${status.join(',')}}')`);
            }
            if (stripe_charge_id) {
                queries.push(`payment.stripe_charge_id = '${stripe_charge_id}'`);
            }
            return typeorm_1.getRepository(entity_1.Payment, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.ProjectFacadeBilling, 'projectFacadeBilling', 'projectFacadeBilling.facade_id = payment.facade_id')
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
                .getRawMany();
        };
        this.getPaymentsForAdmin = (query) => {
            const { facade_id, id, iduser, email, name, created_from, created_to, is_overdue, status = [], offset, limit, sort_by = 'created_at', sort_order = 'DESC' } = query;
            const filterQuery = [];
            if (facade_id) {
                filterQuery.push(`payment.facade_id = ${facade_id}`);
            }
            if (id) {
                filterQuery.push(`payment.id = ${id}`);
            }
            if (iduser) {
                filterQuery.push(`payment.iduser = '${iduser}'`);
            }
            if (email) {
                filterQuery.push(`(user.email ilike '%${email}%')`);
            }
            if (name) {
                filterQuery.push(`(user.first_name ilike '%${name}%' OR user.last_name ilike '%${name}%')`);
            }
            if (created_from) {
                filterQuery.push(`payment.created_at >= '${common_1.convertDateToISOString(new Date(created_from))}'`);
            }
            if (created_to) {
                filterQuery.push(`payment.created_at < '${common_1.convertDateToISOString(new Date(created_to))}'`);
            }
            const statusFilterQuery = [];
            if (common_1.convertStringToBoolean(is_overdue)) {
                statusFilterQuery.push('payment.is_overdue = TRUE');
            }
            if (status.length !== 0) {
                statusFilterQuery.push(`payment.status = ANY('{${status.join(',')}}')`);
            }
            const dbQuery = typeorm_1.getRepository(entity_1.Payment, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.User, 'user', 'user.iduser = payment.iduser')
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
                .where(filterQuery.join(' AND '));
            return Promise.all([
                dbQuery.getRawMany().then(payments => Promise.resolve(lodash_1.countBy(payments, 'status'))
                    .then(counts => Promise.resolve(payments.reduce((cnt, payment) => payment.status !== constants_1.PAYMENT_STATUS.SUCCEEDED && payment.is_overdue ? cnt + 1 : cnt, 0))
                    .then(is_overdue => (Object.assign(Object.assign({}, counts), { all: payments.length, is_overdue }))))),
                statusFilterQuery.length > 0 ?
                    dbQuery.andWhere(statusFilterQuery.join(' AND ')).orderBy(sort_by, sort_order).offset(offset).limit(limit).getRawMany()
                    : dbQuery.orderBy(sort_by, sort_order).offset(offset).limit(limit).getRawMany(),
            ]);
        };
        this.updatePaymentBy = (filter, data) => {
            const { id } = filter;
            const queries = [];
            if (id) {
                queries.push(`payment.id = '${id}'`);
            }
            return typeorm_1.getRepository(entity_1.Payment, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .update()
                .set(Object.assign({}, data))
                .where(queries.join(' AND '))
                .returning('*')
                .execute()
                .then(res => res.raw[0]);
        };
    }
};
PaymentRepository = __decorate([
    inversify_1.injectable()
], PaymentRepository);
exports.PaymentRepository = PaymentRepository;
//# sourceMappingURL=payment.js.map