"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractEventsRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
let ContractEventsRepository = class ContractEventsRepository {
    constructor() {
        this.REPO_NAME = 'contract_events';
        this.createContractEvent = (contractEvent) => typeorm_1.getRepository(entity_1.ContractEvents, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.ContractEvents)
            .values(Object.assign({}, contractEvent))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.getContractEventsByDateRange = (startDate, endDate) => typeorm_1.getRepository(entity_1.ContractEvents, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('contract_events.created_at > :startDate', { startDate })
            .andWhere('contract_events.created_at <= :endDate', { endDate })
            .select([
            'facade_id',
            'COUNT(*) FILTER (WHERE contract_events.type = \'contract_signed\') AS number_of_signed_contracts',
            'COUNT(*) FILTER (WHERE contract_events.type = \'contract_rejected\') AS number_of_rejected_contracts',
        ])
            .groupBy('contract_events.facade_id')
            .getRawMany();
        this.getContractEventsDetailedByDateRange = (startDate, endDate, facadeId) => typeorm_1.getRepository(entity_1.ContractEvents, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .where('contract_events.created_at > :startDate', { startDate })
            .andWhere('contract_events.created_at <= :endDate', { endDate })
            .andWhere(facadeId ? 'contract_events.facade_id = :facadeId' : '1=1', { facadeId })
            .select([
            'COUNT(*) FILTER (WHERE contract_events.type = \'contract_signed\') AS number_of_signed_contracts',
            'COUNT(*) FILTER (WHERE contract_events.type = \'contract_rejected\') AS number_of_rejected_contracts',
            'COUNT(*) FILTER (WHERE contract_events.type = \'contract_generated\') AS number_of_pending_contracts',
            'TO_CHAR(contract_events.created_at::DATE, \'YYYY-MM-DD\') AS date',
        ])
            .groupBy('date')
            .getRawMany();
    }
};
ContractEventsRepository = __decorate([
    inversify_1.injectable()
], ContractEventsRepository);
exports.ContractEventsRepository = ContractEventsRepository;
//# sourceMappingURL=contractEvents.js.map