"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const constants_1 = require("./../../infrastructure/constants");
const common_1 = require("./../../infrastructure/utils/common");
const user_1 = require("./../../infrastructure/utils/user");
const entity_1 = require("./../entity");
let TenantRepository = class TenantRepository {
    constructor() {
        this.REPO_NAME = 'user';
        this.getTenants = (iduser, facade_id, query) => {
            const { food_preferences, interest_ids, age_from, age_to, include_unspecified_age, prefix, offset, limit } = query;
            let filterQuery = `user.iduser != '${iduser}' AND user.user_type = '${constants_1.USER_TYPE.TENANT}' AND contract.facade_id = ${facade_id} AND contract.status = '${constants_1.CONTRACT_STATUS.ACTIVE}'`;
            if (food_preferences) {
                filterQuery = filterQuery + ` AND userProfiles.food_preference = ANY ('{${food_preferences.join(',')}}')`;
            }
            if (interest_ids) {
                filterQuery = filterQuery + ` AND userProfiles.interest_ids && '{${interest_ids.join(',')}}'::int[]`;
            }
            const maxAgeDate = user_1.convertAgeToBirthday(age_from);
            const minAgeDate = user_1.convertAgeToBirthday(age_to);
            if (common_1.convertStringToBoolean(include_unspecified_age)) {
                filterQuery = filterQuery +
                    ` AND (user.birthday <= '${common_1.convertDateToISOString(maxAgeDate)}'
        AND user.birthday > '${common_1.convertDateToISOString(minAgeDate)}'
        OR user.birthday IS NULL)`;
            }
            else {
                filterQuery = filterQuery +
                    ` AND user.birthday <= '${common_1.convertDateToISOString(maxAgeDate)}'
        AND user.birthday > '${common_1.convertDateToISOString(minAgeDate)}'`;
            }
            if (prefix) {
                filterQuery = filterQuery + ` AND (user.first_name ilike '%${prefix}%' OR user.last_name ilike '%${prefix}%')`;
            }
            return typeorm_1.getRepository(entity_1.User, process.env.NODE_ENV)
                .createQueryBuilder(this.REPO_NAME)
                .innerJoin(entity_1.Contract, 'contract', 'user.iduser = contract.iduser')
                .leftJoin(entity_1.UserProfiles, 'userProfiles', 'user.iduser = userProfiles.iduser')
                .where(filterQuery)
                .select([
                'first_name',
                'user.iduser as iduser',
                'last_name',
                'img_url',
            ])
                .offset(offset)
                .limit(limit)
                .getRawMany();
        };
        this.getTenantDetailById = (iduser) => typeorm_1.getRepository(entity_1.User, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .leftJoin(entity_1.UserProfiles, 'userProfiles', 'user.iduser = userProfiles.iduser')
            .where('user.iduser = :iduser and user.user_type = :type', { iduser, type: constants_1.USER_TYPE.TENANT })
            .select([
            'first_name',
            'last_name',
            'user.iduser AS iduser',
            'email',
            'birthday',
            'img_url',
            'registration_time',
            'phone',
            'gender',
            'user_type',
            '\"userProfiles\".display_name',
            '\"userProfiles\".interest_ids',
            '\"userProfiles\".hometown',
            '\"userProfiles\".occupation',
            '\"userProfiles\".schools',
            '\"userProfiles\".food_preference',
            '\"userProfiles\".gluten_intolerent',
            '\"userProfiles\".wheat_intolerent',
            '\"userProfiles\".lactose_intolerent',
            '\"userProfiles\".allergic_to_milk',
            '\"userProfiles\".allergic_to_egg',
            '\"userProfiles\".allergic_to_shellfish',
            '\"userProfiles\".allergic_to_fish',
            '\"userProfiles\".allergic_to_nuts',
            '\"userProfiles\".fun_facts',
        ])
            .getRawOne();
    }
};
TenantRepository = __decorate([
    inversify_1.injectable()
], TenantRepository);
exports.TenantRepository = TenantRepository;
//# sourceMappingURL=tenant.js.map