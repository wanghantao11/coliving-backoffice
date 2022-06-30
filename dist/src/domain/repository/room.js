"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const entity_1 = require("./../../domain/entity");
const constants_1 = require("./../../infrastructure/constants");
const common_1 = require("./../../infrastructure/utils/common");
let RoomRepository = class RoomRepository {
    constructor() {
        this.REPO_NAME = 'room';
        this.createRoom = (room) => typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(entity_1.Room)
            .values(Object.assign({}, room))
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.deleteRoom = (id) => typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .delete()
            .where('id = :id', { id })
            .returning('*')
            .execute()
            .then(res => res.raw[0]);
        this.getRoomBy = (filter) => {
            const { id } = filter;
            const queries = [];
            if (id) {
                queries.push(`room.id = '${id}'`);
            }
            return typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .leftJoin(entity_1.Apartment, 'apartment', 'room.apartment_id = apartment.id')
                .select([
                '\"room\".id',
                'address_id',
                'apartment.id AS apartment_id',
                'apartment.name AS apartment_name',
                'apartment_plan_uri',
                '\"room\".created_at',
                '\"room\".facade_id',
                'has_private_bathroom',
                'has_private_kitchen',
                'has_private_toilet',
                'floor_no',
                'is_suitable_for_disability',
                'label_ids',
                'move_in_date',
                '\"room\".name',
                'notes',
                'number',
                'people_per_room',
                'rent',
                'service_fee',
                'shared_area_size',
                'size',
                'status',
                '\"room\".updated_at',
            ])
                .where(queries.join(' AND '))
                .getRawOne();
        };
        this.getRoomsBy = (filter) => {
            const { ids = [], facadeId, apartmentIds = [], status } = filter;
            const queries = [];
            if (ids.length !== 0) {
                queries.push(`room.id = ANY('{${ids.join(',')}}')`);
            }
            if (facadeId) {
                queries.push(`room.facade_id = '${facadeId}'`);
            }
            if (apartmentIds.length !== 0) {
                queries.push(`room.apartment_id = ANY('{${apartmentIds.join(',')}}')`);
            }
            if (status) {
                queries.push(`room.status = '${status}'`);
            }
            return typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .where(queries.join(' AND '))
                .getMany();
        };
        this.updateRoomBy = (filter, data) => {
            const { id } = filter;
            const queries = [];
            if (id) {
                queries.push(`room.id = '${id}'`);
            }
            return typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .update()
                .set(Object.assign({}, data))
                .where(queries.join(' AND '))
                .returning('*')
                .execute()
                .then(res => res.raw[0]);
        };
        this.getRoomsWithTenantsBy = (query) => {
            const { facadeId, status, label_ids, people_per_room, name, room_number, prefix, } = query;
            // tenant implies that contract has to be active
            const queries = [`contract.status = '${constants_1.CONTRACT_STATUS.ACTIVE}'`];
            if (facadeId) {
                queries.push(`contract.facade_id = ${facadeId}`);
            }
            if (status) {
                queries.push(`room.status = '${status}'`);
            }
            if (label_ids) {
                queries.push(`label_ids @> '{${label_ids.join(',')}}'::int[]`);
            }
            if (people_per_room) {
                queries.push(`people_per_room = ${people_per_room}`);
            }
            if (name) {
                queries.push(`room.name = '${name.trim()}'`);
            }
            if (room_number) {
                queries.push(`number = '${room_number}'`);
            }
            if (prefix) {
                queries.push(`(first_name ilike '%${prefix}%' OR last_name ilike '%${prefix}%')`);
            }
            return typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .leftJoin(entity_1.Contract, 'contract', 'room.id = contract.room_id')
                .leftJoin(entity_1.User, 'user', 'user.iduser = contract.iduser')
                .select([
                'json_agg("user") FILTER (WHERE "user".iduser = contract.iduser) AS users',
                'room.id',
            ])
                .groupBy('room.id')
                .where(queries.join(' AND '))
                .getRawMany();
        };
        this.getUserScoresForTenantsAndCandidatesByRoomIds = (ids) => {
            const selectedFields = [
                'user.iduser as iduser',
                'apartment_id',
                'room.id',
                'agreeableness',
                'conscientiousness',
                'emotional_stability',
                'extroversion',
                'openness',
                'activity',
                'conformity',
                'engagement',
                'hedonism',
                'humanism',
                'performance',
                'power',
                'safety',
                'tradition'
            ];
            const candidatesPromise = typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoinAndSelect(entity_1.Offer, 'offer', 'room.id = offer.room_id AND offer.status= \'Accepted\'')
                .innerJoinAndSelect(entity_1.User, 'user', 'offer.iduser = user.iduser AND user.user_type = \'Candidate\' AND user.is_test_complete = TRUE')
                .innerJoinAndSelect(entity_1.UserScore, 'user_score', 'user.iduser = user_score.iduser')
                .where(`room.id = ANY('{${ids.join(',')}}'::int[])`)
                .select(selectedFields)
                .getRawMany();
            const tenantsPromise = typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.Contract, 'contract', 'room.id = contract.room_id AND contract.status= \'Active\'')
                .innerJoin(entity_1.User, 'user', 'contract.iduser = user.iduser AND user.user_type = \'Tenant\' AND user.is_test_complete = TRUE')
                .innerJoin(entity_1.UserScore, 'user_score', 'user.iduser = user_score.iduser')
                .where(`room.id = ANY('{${ids.join(',')}}'::int[])`)
                .select(selectedFields)
                .getRawMany();
            const potentialTenantsPromise = typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.Contract, 'contract', 'room.id = contract.room_id AND contract.status= \'Signed\'')
                .innerJoin(entity_1.User, 'user', 'contract.iduser = user.iduser AND user.user_type = \'Candidate\' AND user.is_test_complete = TRUE')
                .innerJoin(entity_1.UserScore, 'user_score', 'user.iduser = user_score.iduser')
                .where(`room.id = ANY('{${ids.join(',')}}'::int[])`)
                .select(selectedFields)
                .getRawMany();
            return Promise.all([candidatesPromise, tenantsPromise, potentialTenantsPromise])
                .then(([candidates, tenants, potentialTenants]) => ([...candidates, ...tenants, ...potentialTenants]));
        };
        this.getRoomStatisticsByClientId = (clientId) => typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .innerJoin(entity_1.ProjectFacade, 'project_facade', `project_facade.client_id = '${clientId}'`)
            .where('room.facade_id = project_facade.id')
            .select([
            'facade_id',
            'COUNT(*) AS number_of_total_rooms',
            `COUNT(*) FILTER (WHERE room.status = '${constants_1.ROOM_STATUS.AVAILABLE}') AS number_of_available_rooms`,
        ])
            .groupBy('facade_id')
            .getRawMany();
        this.getRoomsWithTerminatedContractsByFacadeId = (facadeId) => typeorm_1.getRepository(entity_1.Room, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .leftJoin(entity_1.Contract, 'contract', 'contract.room_id = room.id')
            .select([
            'json_agg(contract) FILTER (WHERE contract.room_id = room.id) AS contracts',
            'room.id',
        ])
            .groupBy('room.id')
            .where(`contract.facade_id = ${facadeId} AND contract.status = '${constants_1.CONTRACT_STATUS.TERMINATED}' AND contract.end_date >= '${common_1.convertDateToISOString(new Date()).split('T')[0]}'`)
            .getRawMany();
    }
};
RoomRepository = __decorate([
    inversify_1.injectable()
], RoomRepository);
exports.RoomRepository = RoomRepository;
//# sourceMappingURL=room.js.map