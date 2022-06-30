"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferRepository = void 0;
const inversify_1 = require("inversify");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
const constants_1 = require("./../../infrastructure/constants");
const common_1 = require("./../../infrastructure/utils/common");
let OfferRepository = class OfferRepository {
    constructor() {
        this.REPO_NAME = 'offer';
        this.createOffer = (offer) => typeorm_1.getRepository(entity_1.Offer, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.Offer)
            .values(Object.assign({}, offer))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.createOffersForPair = (iduser, preferred_roommate_iduser, room_id, facade_id, is_preferences_matched) => typeorm_1.getRepository(entity_1.Offer, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.Offer)
            .values([{ iduser, room_id, facade_id, is_preferences_matched },
            { iduser: preferred_roommate_iduser, room_id, facade_id, is_preferences_matched }])
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.getOfferBy = (filter) => {
            const { id, iduser, status } = filter;
            const queries = [];
            if (id) {
                queries.push(`offer.id = '${id}'`);
            }
            if (iduser) {
                queries.push(`offer.iduser = '${iduser}'`);
            }
            if (status) {
                queries.push(`offer.status = '${status}'`);
            }
            return typeorm_1.getRepository(entity_1.Offer, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .where(queries.join(' AND '))
                .getOne();
        };
        this.getOffersBy = (filter) => {
            const { iduser, is_sent_by_admin, roomId, status } = filter;
            const queries = [];
            if (iduser) {
                queries.push(`offer.iduser = '${iduser}'`);
            }
            if (is_sent_by_admin) {
                queries.push(`offer.is_sent_by_admin = ${is_sent_by_admin}`);
            }
            if (roomId) {
                queries.push(`offer.room_id = '${roomId}'`);
            }
            if (status) {
                queries.push(`offer.status = '${status}'`);
            }
            return typeorm_1.getRepository(entity_1.Offer, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .where(queries.join(' AND '))
                .getMany();
        };
        this.getOffersCountBy = (filter) => {
            const { iduser, roomId, status } = filter;
            const queries = [];
            if (iduser) {
                queries.push(`offer.iduser = '${iduser}'`);
            }
            if (roomId) {
                queries.push(`offer.room_id = '${roomId}'`);
            }
            if (status) {
                queries.push(`offer.status = '${status}'`);
            }
            return typeorm_1.getRepository(entity_1.Offer, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .where(queries.join(' AND '))
                .getCount();
        };
        this.getPendingOfferMembers = (query) => {
            const { facade_id, email, name, sent_from, sent_to, tag_ids, offset, limit, sort_by = 'sent_at', sort_order = 'DESC' } = query;
            const filterQuery = [`offer.status = '${constants_1.OFFER_STATUS.PENDING}'`];
            if (facade_id) {
                filterQuery.push(`offer.facade_id = ${facade_id}`);
            }
            if (email) {
                filterQuery.push(`(user.email ilike '%${email}%')`);
            }
            if (name) {
                filterQuery.push(`(user.first_name ilike '%${name}%' OR user.last_name ilike '%${name}%')`);
            }
            if (sent_from) {
                filterQuery.push(`offer.created_at >= '${common_1.convertDateToISOString(new Date(sent_from))}'`);
            }
            if (sent_to) {
                filterQuery.push(`offer.created_at < '${common_1.convertDateToISOString(new Date(sent_to))}'`);
            }
            if (tag_ids) {
                filterQuery.push(`adminMemberNotes.tag_ids @> '{${tag_ids.join(',')}}'::int[]`);
            }
            const dbQuery = typeorm_1.getRepository(entity_1.Offer, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.User, 'user', 'user.iduser = offer.iduser')
                .innerJoin(entity_1.UserPreferences, 'userPreferences', 'user.user_key = userPreferences.iduser')
                .leftJoin(entity_1.AdminMemberNotes, 'adminMemberNotes', 'adminMemberNotes.iduser = offer.iduser')
                .leftJoin(entity_1.Room, 'room', 'room.id = offer.room_id')
                .leftJoin(entity_1.Apartment, 'apartment', 'apartment.id = room.apartment_id')
                .select([
                'offer.iduser AS iduser',
                'offer.created_at AS sent_at',
                'room.name AS room_name',
                'apartment.name AS apartment_name',
                'adminMemberNotes.description AS notes',
                '\"user\".first_name',
                '\"user\".last_name',
                '\"user\".img_url',
                '\"user\".birthday',
                '\"user\".user_type',
                '\"userPreferences\".move_in_date_from',
                '\"userPreferences\".move_in_date_to',
            ])
                .where(filterQuery.join(' AND '))
                .orderBy(sort_by, sort_order);
            return Promise.all([
                dbQuery.getRawMany().then(members => members.length),
                dbQuery.offset(offset).limit(limit).getRawMany()
            ]);
        };
        this.updateOfferBy = (filter, data) => {
            const { id, iduser, roomId } = filter;
            const queries = [];
            if (id) {
                queries.push(`offer.id = '${id}'`);
            }
            if (iduser) {
                queries.push(`offer.iduser = '${iduser}'`);
            }
            if (roomId) {
                queries.push(`offer.room_id = '${roomId}'`);
            }
            return typeorm_1.getRepository(entity_1.Offer, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .update()
                .set(Object.assign({}, data))
                .where(queries.join(' AND '))
                .returning('*')
                .execute()
                .then(res => res.raw[0]);
        };
        this.getContractDataByRoomIdAndExternalIds = (id, idusers) => typeorm_1.getRepository(entity_1.Offer, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .innerJoin(entity_1.User, 'user', 'user.iduser = offer.iduser')
            .innerJoin(entity_1.UserPreferences, 'user_preferences', 'user_preferences.iduser = user.user_key')
            .innerJoin(entity_1.Room, 'room', 'room.id = offer.room_id')
            .innerJoin(entity_1.Project, 'project', 'project.facade_id = room.facade_id')
            .innerJoin(entity_1.ProjectFacade, 'project_facade', 'project_facade.id = room.facade_id')
            .innerJoin(entity_1.ProjectFacadeBilling, 'project_facade_billing', 'project_facade_billing.facade_id = room.facade_id')
            .innerJoin(entity_1.ContractTemplates, 'contract_templates', 'contract_templates.facade_id = room.facade_id')
            .innerJoin(entity_1.Address, 'address', 'address.id = room.address_id')
            .where('offer.room_id = :id AND offer.iduser IN (:...idusers)', { id, idusers })
            .select([
            // user
            'user.iduser as iduser',
            'first_name',
            'last_name',
            'email',
            'phone',
            // userPreferences
            'user_preferences.move_in_date_from as user_move_in_date',
            // project
            'project.city as post_area',
            // projectFacade
            'project_facade.name as project_name',
            'project_facade.id as facade_id',
            'is_auto_offer_flow',
            'landlord_name',
            'landlord_email',
            'landlord_org_no',
            'landlord_street',
            'landlord_zip',
            'landlord_post_area',
            'property_unit_designation',
            'coliving_hub',
            // projectFacadeBilling
            'bankgiro_no',
            'deposit',
            'deposit_refund_weeks',
            'rent_yearly_increase_rate',
            'rent_yearly_increase_date',
            'rent_day_of_month',
            'service_fee_day_of_month',
            // contractTemplates
            'extra_fields',
            // room
            'room.id',
            'number',
            'people_per_room',
            'size',
            'shared_area_size',
            'floor_no',
            'address.street as street',
            'address.zip as zip',
            'rent',
            'room.move_in_date as room_move_in_date',
            'room.service_fee as service_fee',
            // collection
            'collection_id'
        ])
            .getRawMany();
        this.deleteOffersBy = (filter) => {
            const queries = [];
            const { iduser, facade_id, status, is_sent_by_admin } = filter;
            if (iduser) {
                queries.push(`offer.iduser = '${iduser}'`);
            }
            if (facade_id) {
                queries.push(`offer.facade_id = '${facade_id}'`);
            }
            if (status) {
                queries.push(`offer.status = '${status}'`);
            }
            if (lodash_1.isBoolean(is_sent_by_admin)) {
                queries.push(`offer.is_sent_by_admin = ${is_sent_by_admin}`);
            }
            return typeorm_1.getRepository(entity_1.Offer, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .delete()
                .where(queries.join(' AND '))
                .execute();
        };
    }
};
OfferRepository = __decorate([
    inversify_1.injectable()
], OfferRepository);
exports.OfferRepository = OfferRepository;
//# sourceMappingURL=offer.js.map