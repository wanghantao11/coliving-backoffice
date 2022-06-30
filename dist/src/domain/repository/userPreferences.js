"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferencesRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const userPreferences_1 = require("./../../domain/entity/userPreferences");
let UserPreferencesRepository = class UserPreferencesRepository {
    constructor() {
        this.REPO_NAME = 'user_preferences';
        this.createUserPreferences = (data) => typeorm_1.getRepository(userPreferences_1.UserPreferences, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .insert()
            .into(userPreferences_1.UserPreferences)
            .values(Object.assign({}, data))
            .returning([
            'locations',
            'is_suitable_for_disability',
            'has_private_bathroom',
            'has_private_toilet',
            'has_double_room',
            'has_single_room',
            'has_room_type_preference',
            'rent_from',
            'rent_to',
            'roomies',
            'move_in_date_from',
            'move_in_date_to',
            'period_of_stay',
        ])
            .execute()
            .then(res => res.raw[0]);
        this.getUserPreferences = (id) => typeorm_1.getRepository(userPreferences_1.UserPreferences, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .select([
            'user_preferences.locations',
            'user_preferences.is_suitable_for_disability',
            'user_preferences.has_private_bathroom',
            'user_preferences.has_private_toilet',
            'user_preferences.has_double_room',
            'user_preferences.has_single_room',
            'user_preferences.has_room_type_preference',
            'user_preferences.rent_from',
            'user_preferences.rent_to',
            'user_preferences.roomies',
            'user_preferences.move_in_date_from',
            'user_preferences.move_in_date_to',
            'user_preferences.period_of_stay',
            'user_preferences.needs_contact_back',
            'user_preferences.needs_manual_offer',
        ])
            .where('iduser = :id', { id })
            .getOne();
        this.updateUserPreferences = (id, data) => typeorm_1.getRepository(userPreferences_1.UserPreferences, process.env.NODE_ENV)
            .createQueryBuilder(this.REPO_NAME)
            .update()
            .set(Object.assign({}, data))
            .where('iduser = :id', { id })
            .returning([
            'locations',
            'is_suitable_for_disability',
            'has_private_bathroom',
            'has_private_toilet',
            'has_double_room',
            'has_single_room',
            'has_room_type_preference',
            'rent_from',
            'rent_to',
            'roomies',
            'move_in_date_from',
            'move_in_date_to',
            'period_of_stay',
            'needs_contact_back',
            'needs_manual_offer',
        ])
            .execute()
            .then(res => res.raw[0]);
    }
};
UserPreferencesRepository = __decorate([
    inversify_1.injectable()
], UserPreferencesRepository);
exports.UserPreferencesRepository = UserPreferencesRepository;
//# sourceMappingURL=userPreferences.js.map