"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferEventsRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
let OfferEventsRepository = class OfferEventsRepository {
    constructor() {
        this.REPO_NAME = 'offer_events';
        this.createOfferEvent = (offerEvent) => typeorm_1.getRepository(entity_1.OfferEvents, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.OfferEvents)
            .values(Object.assign({}, offerEvent))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteOfferEvent = (id) => typeorm_1.getRepository(entity_1.OfferEvents, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .where('id = :id', { id })
            .execute();
        this.getOfferEvent = (id) => typeorm_1.getRepository(entity_1.OfferEvents, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('id = :id', { id })
            .getOne();
        this.getOfferEventsByExternalId = (iduser) => typeorm_1.getRepository(entity_1.OfferEvents, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('iduser = :iduser', { iduser })
            .getMany();
        this.getOfferEventsByType = (type) => typeorm_1.getRepository(entity_1.OfferEvents, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('type = :type', { type })
            .getMany();
        this.getOfferEventsByDateRange = (startDate, endDate) => typeorm_1.getRepository(entity_1.OfferEvents, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('offer_events.created_at > :startDate', { startDate })
            .andWhere('offer_events.created_at <= :endDate', { endDate })
            .select([
            'facade_id',
            'COUNT(*) FILTER (WHERE offer_events.type = \'offer_accepted\') AS number_of_accepted_offers',
            'COUNT(*) FILTER (WHERE offer_events.type = \'offer_rejected\') AS number_of_rejected_offers',
            'COUNT(*) FILTER (WHERE offer_events.type = \'offer_sent\') AS number_of_sent_offers',
            'json_agg(data->\'offers\') FILTER (WHERE offer_events.type = \'search_ended\') as generated_offers',
            'json_agg(data->\'reason\') FILTER (WHERE offer_events.type = \'offer_rejected\') as rejection_reasons',
        ])
            .groupBy('offer_events.facade_id')
            .getRawMany();
        this.getOfferEventsDetailedByDateRange = (startDate, endDate, facadeId) => typeorm_1.getRepository(entity_1.OfferEvents, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('offer_events.created_at > :startDate', { startDate })
            .andWhere('offer_events.created_at <= :endDate', { endDate })
            .andWhere(facadeId ? 'offer_events.facade_id <= :facadeId' : '1=1', { facadeId })
            .select([
            'COUNT(*) FILTER (WHERE offer_events.type = \'offer_accepted\') AS number_of_accepted_offers',
            'COUNT(*) FILTER (WHERE offer_events.type = \'offer_rejected\') AS number_of_rejected_offers',
            'COUNT(*) FILTER (WHERE offer_events.type = \'offer_sent\') AS number_of_sent_offers',
            'TO_CHAR(offer_events.created_at::DATE, \'YYYY-MM-DD\') AS date',
        ])
            .groupBy('date')
            .getRawMany();
    }
};
OfferEventsRepository = __decorate([
    inversify_1.injectable()
], OfferEventsRepository);
exports.OfferEventsRepository = OfferEventsRepository;
//# sourceMappingURL=offerEvents.js.map